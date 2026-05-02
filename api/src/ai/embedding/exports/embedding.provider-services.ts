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
    useFactory: (cs: ConfigService) => {
      const localHost = cs.get<string>('OLLAMA_LOCAL_HOST');
      if (!localHost) {
        throw new InternalServerErrorException(
          'OLLAMA_LOCAL_HOST should be setting',
        );
      }
      return new OllamaEmbeddingService(
        new Ollama({
          host: localHost,
        }),
        cs,
      );
    },
    inject: [ConfigService],
  },
  {
    provide: VoyageAIClient,
    inject: [ConfigService],
    useFactory: (cs: ConfigService) => {
      const key = cs.get<string>('VOYAGE_API_KEY');
      if (!key) {
        throw new InternalServerErrorException('VOYAGE_API_KEY must be set');
      }
      return new VoyageAIClient({
        apiKey: cs.get<string>('VOYAGE_API_KEY'),
      });
    },
  },
  {
    provide: VoyageEmbeddingService,
    inject: [VoyageAIClient],
    useFactory: (voyageAIClient: VoyageAIClient) => {
      return new VoyageEmbeddingService(voyageAIClient);
    },
  },
  MongoAtlasEmbeddingService,
  // ── Active embedding provider — change useClass to switch ────────────────
  // Options: OpenAIEmbeddingService | GenAIEmbeddingService | OllamaEmbeddingService
  //          VoyageEmbeddingService | MongoAtlasEmbeddingService
  {
    provide: EMBEDDING_PROVIDER,
    useClass: VoyageEmbeddingService,
  },
];

export default EMBEDDING_SERVICES;
