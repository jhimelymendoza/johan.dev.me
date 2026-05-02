import { Injectable } from '@nestjs/common';
import { IEmbeddingModelInfo, IEmbeddingProvider } from './embedding-provider.interface';

/**
 * STUB — MongoDB Atlas does not expose a standalone embedding generation endpoint.
 * Atlas Vector Search is used for *querying* stored embeddings, not generating them.
 *
 * Future implementation paths:
 *   1. Atlas App Services (Functions) to proxy an external model call
 *   2. Atlas AI endpoint once a generation API becomes available
 *
 * Env vars reserved for future use: MONGO_ATLAS_APP_ID, MONGO_ATLAS_API_KEY
 */
@Injectable()
export class MongoAtlasEmbeddingService implements IEmbeddingProvider {
  async generateEmbedding(_text: string): Promise<number[]> {
    throw new Error(
      'MongoAtlasEmbeddingService.generateEmbedding — not implemented. ' +
        'MongoDB Atlas does not offer a standalone embedding generation API.',
    );
  }

  getEmbeddingModelInfo(): IEmbeddingModelInfo {
    return { provider: 'MongoDB Atlas', embeddingModel: 'not implemented' };
  }
}