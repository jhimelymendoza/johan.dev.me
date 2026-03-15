import { Injectable } from '@nestjs/common';
import { Ollama } from 'ollama';
import { getSkillComparisonIntentPrompt } from '../default_prompts/default.prompts';
import { IAIProvider, IChatMessage } from './ai-provider.interface';

const CHAT_MODEL = 'qwen3.5:cloud';
const EMBEDDING_MODEL = 'qwen3-embedding:latest';

@Injectable()
export class OllamaService implements IAIProvider {
  constructor(private readonly client: Ollama) {}


  async chat(
    prompt: string,
    history: IChatMessage[],
    systemInstruction: string,
  ): Promise<string> {
    const response = await this.client.chat({
      model: CHAT_MODEL,
      messages: [
        { role: 'system', content: systemInstruction },
        ...history.map((msg) => ({
          role: msg.role === 'model' ? ('assistant' as const) : ('user' as const),
          content: msg.content,
        })),
        { role: 'user', content: prompt },
      ],
    });

    return response.message.content;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.client.embed({
      model: EMBEDDING_MODEL,
      input: text,
    });

    return response.embeddings[0];
  }

  async isSkillComparison(prompt: string): Promise<boolean> {
    const response = await this.client.chat({
      model: CHAT_MODEL,
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
