import { OllamaService } from '../ollama.service';
import { Ollama } from 'ollama';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { GenAIService } from '../genai.service';
import OpenAI from 'openai';
import { OpenAIService } from '../openai.service';
import { AI_PROVIDER } from '../ai-provider.interface';
import { LangchainAgentService } from '../agent';

function getOllamaInstance(
  configService: ConfigService<Record<string | symbol, unknown>, false>,
) {
  const isCloud = configService.get<string>('OLLAMA_CLOUD') === 'true';
  const host = configService.get<string>('OLLAMA_HOST');
  const apiKey = configService.get<string>('OLLAMA_API_KEY');

  if (isCloud) {
    if (!host) {
      throw new InternalServerErrorException('OLLAMA_HOST should be setting');
    }
    return new Ollama({
      host,
      ...(isCloud && apiKey
        ? { headers: { Authorization: `Bearer ${apiKey}` } }
        : {}),
    });
  }

  const localHost = configService.get<string>('OLLAMA_LOCAL_HOST');
  if (!localHost) {
    throw new InternalServerErrorException(
      'OLLAMA_LOCAL_HOST should be setting',
    );
  }
  return new Ollama({
    host: localHost,
  });
}

export const OLLAMA_SERVICES = [
  // Ollama client
  {
    provide: Ollama,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      return getOllamaInstance(configService);
    },
  },
  {
    provide: OllamaService,
    useFactory: (client: Ollama, configService: ConfigService) =>
      new OllamaService(client, configService),
    inject: [Ollama, ConfigService],
  },
];

export const GOOGLE_SERVICES = [
  {
    provide: GoogleGenAI,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const apiKey = configService.get<string>('GENAI_API_KEY');
      return new GoogleGenAI({ apiKey });
    },
  },
  GenAIService,
];

const OPENAI_SERVICES = [
  {
    provide: OpenAI,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const apiKey = configService.get<string>('OPENAI_API_KEY');
      return new OpenAI({ apiKey });
    },
  },
  OpenAIService,
];
const AI_SERVICES = [
  ...OLLAMA_SERVICES,
  ...GOOGLE_SERVICES,
  ...OPENAI_SERVICES,
  // set your AI Provider
  {
    provide: AI_PROVIDER,
    useClass: LangchainAgentService,
  },
];

export default AI_SERVICES;
