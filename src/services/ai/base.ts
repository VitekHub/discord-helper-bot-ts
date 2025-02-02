export interface AiProvider {
  generateContent(prompt: string): Promise<string>;
}

export abstract class BaseAiProvider implements AiProvider {
  abstract generateContent(prompt: string): Promise<string>;

  protected async handleError(error: unknown): Promise<never> {
    if (error instanceof Error) {
      throw new Error(`AI Provider Error: ${error.message}`);
    }
    throw new Error('Unknown AI Provider Error');
  }
}

export { BaseAiProvider }