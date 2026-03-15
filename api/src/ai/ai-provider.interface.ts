export const AI_PROVIDER = 'AI_PROVIDER';

export interface IChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface IModelInfo {
  provider: string;
  chatModel: string;
  embeddingModel: string;
}

export interface IAIProvider {
  /**
   * Send a chat message and return the model's response text.
   * @param prompt - The current user message
   * @param history - Previous conversation messages
   * @param systemInstruction - System-level instructions for the model
   */
  chat(
    prompt: string,
    history: IChatMessage[],
    systemInstruction: string,
  ): Promise<string>;

  /**
   * Generate a vector embedding for the given text.
   * @param text - The text to embed
   * @returns Array of floats representing the embedding
   */
  generateEmbedding(text: string): Promise<number[]>;

  /**
   * Determine whether the given prompt is a skill-related query.
   * @param prompt - The user's message
   * @returns true if the prompt is asking about skills/capabilities
   */
  isSkillComparison(prompt: string): Promise<boolean>;

  /**
   * Returns information about the active provider and models in use.
   */
  getModelInfo(): IModelInfo;
}