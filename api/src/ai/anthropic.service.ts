import { Injectable } from '@nestjs/common';
// import Anthropic from '@anthropic-ai/sdk';
import { IAIProvider, IChatMessage, IModelInfo } from './ai-provider.interface';

@Injectable()
export class AnthropicService implements IAIProvider {
  // private client: Anthropic;
  //
  // constructor(private configService: ConfigService) {
  //   this.client = new Anthropic({
  //     apiKey: this.configService.get<string>('ANTHROPIC_API_KEY'),
  //   });
  // }

  getModelInfo(): IModelInfo {
    return { provider: 'Anthropic', chatModel: 'not implemented' };
  }

  async chat(
    prompt: string,
    history: IChatMessage[],
    systemInstruction: string,
  ): Promise<string> {
    // TODO: implement using @anthropic-ai/sdk
    //
    // Map history to Anthropic message format:
    // history.map(msg => ({ role: msg.role === 'model' ? 'assistant' : 'user', content: msg.content }))
    //
    // Example:
    // const response = await this.client.messages.create({
    //   model: 'claude-sonnet-4-6',
    //   max_tokens: 1024,
    //   system: systemInstruction,
    //   messages: [
    //     ...history.map(msg => ({
    //       role: msg.role === 'model' ? 'assistant' : 'user',
    //       content: msg.content,
    //     })),
    //     { role: 'user', content: prompt },
    //   ],
    // });
    // return response.content[0].type === 'text' ? response.content[0].text : 'no tengo respuesta';
    throw new Error('AnthropicService.chat — not implemented yet');
  }

  async isSkillComparison(_prompt: string): Promise<boolean> {
    // TODO: implement using @anthropic-ai/sdk
    //
    // Example:
    // const response = await this.client.messages.create({
    //   model: 'claude-haiku-4-5-20251001',
    //   max_tokens: 10,
    //   system: getSkillComparisonIntentPrompt(_prompt),
    //   messages: [{ role: 'user', content: _prompt }],
    // });
    // const text = response.content[0].type === 'text'
    //   ? response.content[0].text.toLowerCase()
    //   : '';
    // return /sí|si/.test(text.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
    throw new Error(
      'AnthropicService.isSkillComparison — not implemented yet',
    );
  }
}