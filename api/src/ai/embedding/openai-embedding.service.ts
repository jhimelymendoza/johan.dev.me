import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  IEmbeddingModelInfo,
  IEmbeddingProvider,
} from './embedding-provider.interface';

const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL!;

@Injectable()
export class OpenAIEmbeddingService implements IEmbeddingProvider {
  constructor(private readonly client: OpenAI) {}

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.client.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
    });
    return response.data[0].embedding;
  }

  getEmbeddingModelInfo(): IEmbeddingModelInfo {
    return { provider: 'OpenAI', embeddingModel: EMBEDDING_MODEL };
  }
}
