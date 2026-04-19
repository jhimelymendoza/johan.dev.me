import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AiConfigDto } from './ai-config.dto';
import { IChat } from './dto/chat.interface';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Skills } from './project/skills.schema';
import { ProjectService } from './project/project.service';
import cosineSimilarity from 'compute-cosine-similarity';
import {
  getInstructions,
  getIsSkillQuestionPrompt,
} from './default_prompts/default.prompts';
import { AI_PROVIDER, IAIProvider, IChatMessage } from './ai/ai-provider.interface';

@Injectable()
export class AppService {
  history: IChatMessage[] = [];

  constructor(
    @Inject(AI_PROVIDER) private aiProvider: IAIProvider,
    @InjectConnection() private connection: Connection,
    private projectService: ProjectService,
    @InjectModel(Skills.name) private skillsModel: Model<Skills>,
  ) {}

  async onModuleInit() {
    const isConnected = this.connection.readyState === 1;
    console.log(
      `MongoDB connection started: ${isConnected ? 'Connected' : 'Not Connected'}`,
    );

    const { provider, chatModel, embeddingModel } = this.aiProvider.getModelInfo();
    console.info(`AI Provider: ${provider} | Chat model: ${chatModel} | Embedding model: ${embeddingModel}`);
  }

  getAiConfig(): AiConfigDto {
    const { provider, chatModel, embeddingModel } = this.aiProvider.getModelInfo();
    return { provider, chatModel, embeddingModel };
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

  async setEmbeddingsByProjectId(id: string) {
    let skill = await this.skillsModel.findById({ _id: id }).exec();

    if (!skill) {
      throw new NotFoundException(`Skill with id "${id}" not found`);
    }

    const embeddings = await this.aiProvider.generateEmbedding(skill.name);

    skill = await this.skillsModel
      .findByIdAndUpdate(id, { embeddings }, { new: true })
      .exec();

    return { id: skill!._id, name: skill!.name, embeddings: skill!.embeddings };
  }

  async hasAnyOfQuestionSkills(
    text: string,
  ): Promise<{ skill: string; similarity: number }[]> {
    const questionEmbedding = await this.aiProvider.generateEmbedding(text);
    const skills = await this.skillsModel.find().exec();

    const result = skills.map((skill) => ({
      skill: skill.name,
      similarity: cosineSimilarity(questionEmbedding!, skill.embeddings)!,
    }));

    return result.sort((a, b) => b.similarity - a.similarity);
  }
}
