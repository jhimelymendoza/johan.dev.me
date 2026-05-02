import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { IEmbeddingModelInfo, IEmbeddingProvider } from './embedding-provider.interface';

const EMBEDDING_MODEL = 'gemini-embedding-001';

@Injectable()
export class GenAIEmbeddingService implements IEmbeddingProvider {
  constructor(private readonly googleGenAI: GoogleGenAI) {}

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.googleGenAI.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: text,
      config: { outputDimensionality: 768 },
    });
    return response.embeddings![0].values!;
  }

  getEmbeddingModelInfo(): IEmbeddingModelInfo {
    return { provider: 'Google GenAI', embeddingModel: EMBEDDING_MODEL };
  }
}