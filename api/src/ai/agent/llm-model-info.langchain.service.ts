import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IModelInfo } from '../ai-provider.interface';

@Injectable()
export class LlmModelInfoLangChainService {
  constructor(private readonly configService: ConfigService) {}

  getModelInfo(): IModelInfo {
    const provider = this.configService.get<string>(
      'LANG_CHAIN_LLM_PROVIDER',
      'Not setted',
    );

    switch (provider) {
      case 'ollama': {
        const useCloud =
          this.configService.get<string>('OLLAMA_CLOUD') === 'true';

        const model = this.configService.get<string>(
          'OLLAMA_CHAT_MODEL',
          'llama3.2',
        );

        return {
          chatModel: model,
          provider: useCloud
            ? `Lang Chain - ${provider} cloud`
            : `Lang Chain ${provider}`,
        };
      }
      default: {
        return {
          chatModel: 'Not setted',
          provider: 'Not setted',
        };
      }
    }
  }
}
