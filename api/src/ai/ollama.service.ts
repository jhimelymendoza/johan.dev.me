import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Ollama } from 'ollama';
import { getSkillComparisonIntentPrompt } from '../default_prompts/default.prompts';
import { IAIProvider, IChatMessage, IModelInfo } from './ai-provider.interface';

@Injectable()
export class OllamaService implements IAIProvider {
  private readonly modelInfo: IModelInfo;
  private readonly isCloud: boolean;

  constructor(
    private readonly client: Ollama,
    private readonly configService: ConfigService,
  ) {
    this.isCloud = this.configService.get<string>('OLLAMA_CLOUD') === 'true';
    this.modelInfo = {
      provider: this.isCloud ? 'Ollama Cloud' : 'Ollama',
      chatModel: this.configService.get<string>('OLLAMA_CHAT_MODEL')!,
    };
  }

  async chat(
    prompt: string,
    history: IChatMessage[],
    systemInstruction: string,
  ): Promise<string> {
    const response = await this.client.chat({
      model: this.modelInfo.chatModel,
      messages: [
        { role: 'system', content: systemInstruction },
        ...history.map((msg) => ({
          role:
            msg.role === 'model' ? ('assistant' as const) : ('user' as const),
          content: msg.content,
        })),
        { role: 'user', content: prompt },
      ],
    });

    return response.message.content;
  }

  getModelInfo() {
    return this.modelInfo;
  }

  async isSkillComparison(prompt: string): Promise<boolean> {
    const response = await this.client.chat({
      model: this.modelInfo.chatModel,
      options: { temperature: 0 },
      messages: [
        { role: 'system', content: getSkillComparisonIntentPrompt(prompt) },
        { role: 'user', content: prompt },
      ],
    });

    const text = response.message.content.toLowerCase();
    return /sí|si/.test(text.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
  }
}
