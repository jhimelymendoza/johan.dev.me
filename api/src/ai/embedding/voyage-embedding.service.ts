import { Injectable } from '@nestjs/common';
import {
  IEmbeddingModelInfo,
  IEmbeddingProvider,
} from './embedding-provider.interface';
import { VoyageAIClient } from 'voyageai';

const EMBEDDING_MODEL = process.env.VOYAGE_EMBEDDING_MODEL!;

@Injectable()
export class VoyageEmbeddingService implements IEmbeddingProvider {
  constructor(private readonly voyageClient: VoyageAIClient) {}

  async generateEmbedding(text: string): Promise<number[]> {
    const result = await this.voyageClient.embed({
      input: text,
      model: EMBEDDING_MODEL,
    });

    return result.data![0].embedding!;
  }

  getEmbeddingModelInfo(): IEmbeddingModelInfo {
    return { provider: 'Voyage AI', embeddingModel: EMBEDDING_MODEL };
  }
}
