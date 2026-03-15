import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { getSkillComparisonIntentPrompt } from '../default_prompts/default.prompts';
import { IAIProvider, IChatMessage } from './ai-provider.interface';

const MODEL = 'gemini-2.0-flash-001';
const EMBEDDING_MODEL = 'gemini-embedding-001';
const TEMPERATURE = 0.5;

@Injectable()
export class GenAIService implements IAIProvider {
  constructor(private googleGenAI: GoogleGenAI) {}

  async chat(
    prompt: string,
    history: IChatMessage[],
    systemInstruction: string,
  ): Promise<string> {
    const genAIHistory = history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    const chatAi = this.googleGenAI.chats.create({
      model: MODEL,
      history: genAIHistory,
      config: {
        systemInstruction,
        temperature: TEMPERATURE,
      },
    });

    const response = await chatAi.sendMessage({ message: prompt });
    return response.text ?? 'no tengo respuesta';
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.googleGenAI.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: text,
      config: {
        outputDimensionality: 768,
      },
    });

    return response.embeddings![0].values!;
  }

  async isSkillComparison(prompt: string): Promise<boolean> {
    const chatAi = this.googleGenAI.chats.create({
      model: MODEL,
      history: [
        {
          role: 'model',
          parts: [{ text: getSkillComparisonIntentPrompt(prompt) }],
        },
      ],
      config: {
        temperature: 0,
      },
    });

    const response = await chatAi.sendMessage({ message: prompt });
    const text = response.text?.toLowerCase() ?? '';

    return /sí|si/.test(text.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
  }
}