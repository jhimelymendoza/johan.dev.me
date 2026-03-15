import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { getSkillComparisonIntentPrompt } from '../default_prompts/default.prompts';
import { IAIProvider, IChatMessage, IModelInfo } from './ai-provider.interface';

const CHAT_MODEL = 'gpt-4o-mini';
const EMBEDDING_MODEL = 'text-embedding-3-small';
const TEMPERATURE = 0.5;

@Injectable()
export class OpenAIService implements IAIProvider {
  constructor(private readonly client: OpenAI) {}

  async chat(
    prompt: string,
    history: IChatMessage[],
    systemInstruction: string,
  ): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: CHAT_MODEL,
      temperature: TEMPERATURE,
      messages: [
        { role: 'system', content: systemInstruction },
        ...history.map((msg) => ({
          role: msg.role === 'model' ? ('assistant' as const) : ('user' as const),
          content: msg.content,
        })),
        { role: 'user', content: prompt },
      ],
    });

    return response.choices[0].message.content ?? 'no tengo respuesta';
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.client.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
    });

    return response.data[0].embedding;
  }

  getModelInfo(): IModelInfo {
    return { provider: 'OpenAI', chatModel: CHAT_MODEL, embeddingModel: EMBEDDING_MODEL };
  }

  async isSkillComparison(prompt: string): Promise<boolean> {
    const response = await this.client.chat.completions.create({
      model: CHAT_MODEL,
      temperature: 0,
      messages: [
        { role: 'system', content: getSkillComparisonIntentPrompt(prompt) },
        { role: 'user', content: prompt },
      ],
    });

    const text = (response.choices[0].message.content ?? '').toLowerCase();
    return /sí|si/.test(text.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
  }
}