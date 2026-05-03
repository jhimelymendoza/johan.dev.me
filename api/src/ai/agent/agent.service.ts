import { Injectable } from '@nestjs/common';
import { IAgentService } from './interfaces/agent.service.interface';
import { IChatMessage, IModelInfo } from '../ai-provider.interface';

@Injectable()
export class AgentService implements IAgentService {
  constructor() {
    // TODO: inject LangChain / LangGraph client(s) here when implemented
  }
  chat(
    prompt: string,
    history: IChatMessage[],
    systemInstruction: string,
  ): Promise<string> {
    throw new Error('Method not implemented.');
  }
  isSkillComparison(prompt: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  getModelInfo(): IModelInfo {
    throw new Error('Method not implemented.');
  }

  async ask(query: string): Promise<string> {
    // TODO: implement with LangGraph agent
    return Promise.resolve(`[stub] received query: ${query}`);
  }
}
