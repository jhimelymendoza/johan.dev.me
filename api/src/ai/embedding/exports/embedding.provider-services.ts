import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
import { Ollama } from 'ollama';

import { EMBEDDING_PROVIDER } from '../embedding-provider.interface';
import { OpenAIEmbeddingService } from '../openai-embedding.service';
import { GenAIEmbeddingService } from '../genai-embedding.service';
import { OllamaEmbeddingService } from '../ollama-embedding.service';
import { VoyageEmbeddingService } from '../voyage-embedding.service';
import { MongoAtlasEmbeddingService } from '../mongodb-atlas-embedding.service';
import { InternalServerErrorException } from '@nestjs/common';
import { VoyageAIClient } from 'voyageai';

export const EMBEDDING_SERVICES = [
  {
    provide: OpenAIEmbeddingService,
    useFactory: (client: OpenAI) => new OpenAIEmbeddingService(client),
    inject: [OpenAI],
  },
  {
    provide: GenAIEmbeddingService,
    useFactory: (client: GoogleGenAI) => new GenAIEmbeddingService(client),
    inject: [GoogleGenAI],
  },
  {
    provide: OllamaEmbeddingService,
    useFactory: (client: Ollama, cs: ConfigService) =>
      new OllamaEmbeddingService(client, cs),
    inject: [Ollama, ConfigService],
  },
  {
    provide: VoyageEmbeddingService,
    useFactory: (cs: ConfigService) => {
      const key = cs.get<string>('VOYAGE_API_KEY');
      if (!key) {
        throw new InternalServerErrorException('VOYAGE_API_KEY must be set');
      }
      const voyageAiClient = new VoyageAIClient({
        apiKey: cs.get<string>('VOYAGE_API_KEY'),
      });

      new VoyageEmbeddingService(voyageAiClient);
    },
    inject: [ConfigService],
  },
  MongoAtlasEmbeddingService,
  // ── Active embedding provider — change useClass to switch ────────────────
  // Options: OpenAIEmbeddingService | GenAIEmbeddingService | OllamaEmbeddingService
  //          VoyageEmbeddingService | MongoAtlasEmbeddingService
  {
    provide: EMBEDDING_PROVIDER,
    useClass: OllamaEmbeddingService,
  },
];

export default EMBEDDING_SERVICES;
