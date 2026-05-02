export const EMBEDDING_PROVIDER = 'EMBEDDING_PROVIDER';

export interface IEmbeddingModelInfo {
  provider: string;
  embeddingModel: string;
}

export interface IEmbeddingProvider {
  generateEmbedding(text: string): Promise<number[]>;
  getEmbeddingModelInfo(): IEmbeddingModelInfo;
}
