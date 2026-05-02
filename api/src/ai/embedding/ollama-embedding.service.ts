import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Ollama } from 'ollama';
import {
  IEmbeddingModelInfo,
  IEmbeddingProvider,
} from './embedding-provider.interface';

const EMBEDDING_MODEL = 'qwen3-embedding:latest';

@Injectable()
export class OllamaEmbeddingService implements IEmbeddingProvider {
  constructor(
    private readonly client: Ollama,
    private readonly configService: ConfigService,
  ) {}

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.client.embed({
      model: EMBEDDING_MODEL,
      input: text,
    });
    return response.embeddings[0];
  }

  getEmbeddingModelInfo(): IEmbeddingModelInfo {
    const isCloud = this.configService.get<string>('OLLAMA_CLOUD') === 'true';
    return {
      provider: isCloud ? 'Ollama Cloud' : 'Ollama',
      embeddingModel: EMBEDDING_MODEL,
    };
  }
}
