import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseAiProvider } from './base';

export class GoogleAiProvider extends BaseAiProvider {
  private model: any;

  constructor(apiKey: string) {
    super();
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  protected async generateContentInternal(prompt: string): Promise<string> {
    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }
}