import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AiConfigDto } from './ai-config.dto';
import { EmbeddingConfigDto } from './embedding-config.dto';
import { IChat } from './dto/chat.interface';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, ConnectionStates, Model } from 'mongoose';
import { Skills } from './project/skills.schema';
import { ProjectService } from './project/project.service';
import cosineSimilarity from 'compute-cosine-similarity';
import {
  getInstructions,
  getIsSkillQuestionPrompt,
} from './default_prompts/default.prompts';
import {
  AI_PROVIDER,
  IAIProvider,
  IChatMessage,
} from './ai/ai-provider.interface';
import {
  EMBEDDING_PROVIDER,
  IEmbeddingProvider,
} from './ai/embedding/embedding-provider.interface';

@Injectable()
export class AppService {
  history: IChatMessage[] = [];

  constructor(
    @Inject(AI_PROVIDER) private aiProvider: IAIProvider,
    @Inject(EMBEDDING_PROVIDER) private embeddingProvider: IEmbeddingProvider,
    @InjectConnection() private connection: Connection,
    private projectService: ProjectService,
    @InjectModel(Skills.name) private skillsModel: Model<Skills>,
  ) {}

  onModuleInit() {
    const isConnected =
      this.connection.readyState === ConnectionStates.connected;
    console.log(
      `MongoDB connection started: ${isConnected ? 'Connected' : 'Not Connected'}`,
    );

    const { provider, chatModel } = this.aiProvider.getModelInfo();
    const { provider: embProvider, embeddingModel } =
      this.embeddingProvider.getEmbeddingModelInfo();
    console.info(`AI Provider: ${provider} | Chat model: ${chatModel}`);
    console.info(
      `Embedding Provider: ${embProvider} | Embedding model: ${embeddingModel}`,
    );
  }

  getAiConfig(): AiConfigDto {
    const { provider, chatModel } = this.aiProvider.getModelInfo();
    const { provider: embProvider, embeddingModel } = this.getEmbeddingConfig();
    return {
      provider,
      chatModel: `Model : ${chatModel}`,
      embeddingModel: `Embedding : ${embProvider} - ${embeddingModel}`,
    };
  }

  getEmbeddingConfig(): EmbeddingConfigDto {
    const { provider, embeddingModel } =
      this.embeddingProvider.getEmbeddingModelInfo();
    return { provider, embeddingModel };
  }

  async ask(question: string): Promise<IChat> {
    const project = await this.projectService.findAll();

    const isSkillQuery = await this.aiProvider.isSkillComparison(question);
    let skillsResult: { skill: string; similarity: number }[] | undefined;

    if (isSkillQuery) {
      skillsResult = await this.hasAnyOfQuestionSkills(question);
    }

    const effectivePrompt = isSkillQuery
      ? getIsSkillQuestionPrompt(question, skillsResult)
      : question;

    const answerText = await this.aiProvider.chat(
      effectivePrompt,
      this.history,
      getInstructions({ projects: project }),
    );

    this.history = [
      ...this.history,
      { role: 'user', content: question },
      { role: 'model', content: answerText },
    ];

    return {
      isSkillQuery,
      skills: skillsResult,
      answer: answerText,
    };
  }

  async resetAllSkillsEmbeddings(): Promise<{ id: string; name: string }[]> {
    const skills = await this.skillsModel.find().exec();

    return Promise.all(
      skills.map(async (skill) => {
        const embeddings = await this.embeddingProvider.generateEmbedding(
          skill.name,
        );
        await this.skillsModel
          .findByIdAndUpdate(skill._id, { embeddings })
          .exec();
        return { id: skill._id, name: skill.name };
      }),
    );
  }

  async setEmbeddingsBySkillId(id: string) {
    let skill = await this.skillsModel.findById({ _id: id }).exec();

    if (!skill) {
      throw new NotFoundException(`Skill with id "${id}" not found`);
    }

    const embeddings = await this.embeddingProvider.generateEmbedding(
      skill.name,
    );

    skill = await this.skillsModel
      .findByIdAndUpdate(id, { embeddings }, { new: true })
      .exec();

    return { id: skill!._id, name: skill!.name, embeddings: skill!.embeddings };
  }

  async hasAnyOfQuestionSkills(
    text: string,
  ): Promise<{ skill: string; similarity: number }[]> {
    const questionEmbedding =
      await this.embeddingProvider.generateEmbedding(text);
    const skills = await this.skillsModel.find().exec();

    const result = skills.map((skill) => ({
      skill: skill.name,
      similarity: cosineSimilarity(questionEmbedding, skill.embeddings)!,
    }));

    return result.sort((a, b) => b.similarity - a.similarity);
  }
}
