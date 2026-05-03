import { ConfigService } from '@nestjs/config';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatOllama } from '@langchain/ollama';

export function llmFactory(config: ConfigService): BaseChatModel {
  const provider = config.get<string>('LANG_CHAIN_LLM_PROVIDER', 'ollama');

  switch (provider) {
    case 'ollama': {
      const useCloud = config.get<string>('OLLAMA_CLOUD') === 'true';

      const baseUrl = useCloud
        ? config.get<string>('OLLAMA_HOST', 'https://api.ollama.com')
        : config.get<string>('OLLAMA_LOCAL_HOST', 'http://localhost:11434');

      const model = config.get<string>('OLLAMA_CHAT_MODEL', 'llama3.2');

      const apiKey = config.get<string>('OLLAMA_API_KEY');

      const headers = apiKey
        ? { Authorization: `Bearer ${apiKey}` }
        : undefined;

      return new ChatOllama({ baseUrl, model, ...(headers && { headers }) });
    }
    // future: case 'anthropic': ... case 'openai': ...
    default:
      throw new Error(
        `Unsupported LLM_PROVIDER: "${provider}". Supported values: ollama`,
      );
  }
}
