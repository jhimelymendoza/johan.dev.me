export const AI_PROVIDER = 'AI_PROVIDER';

export interface IChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface IModelInfo {
  provider: string;
  chatModel: string;
}

export interface IAIProvider {
  chat(
    prompt: string,
    history: IChatMessage[],
    systemInstruction: string,
  ): Promise<string>;

  isSkillComparison(prompt: string): Promise<boolean>;

  getModelInfo(): IModelInfo;
}