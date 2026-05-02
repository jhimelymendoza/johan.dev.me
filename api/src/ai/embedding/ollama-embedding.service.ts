import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Ollama } from 'ollama';
import { IEmbeddingModelInfo, IEmbeddingProvider, } from './embedding-provider.interface';

@Injectable()
export class OllamaEmbeddingService implements IEmbeddingProvider {
  private readonly embeddingModelInfo: IEmbeddingModelInfo;
  private readonly isCloud: boolean;

  constructor(
    private readonly client: Ollama,
    private readonly configService: ConfigService,
  ) {
    this.isCloud = this.configService.get<string>('OLLAMA_CLOUD') === 'true';
    this.embeddingModelInfo = {
      provider: this.isCloud ? 'Ollama Cloud' : 'Ollama',
      embeddingModel: this.configService.get<string>('OLLAMA_EMBEDDING_MODEL')!,
    };
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.client.embed({
      model: this.embeddingModelInfo.embeddingModel,
      input: text,
    });
    return response.embeddings[0];
  }

  getEmbeddingModelInfo(): IEmbeddingModelInfo {
    return this.embeddingModelInfo;
  }
}
