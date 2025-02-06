const AI_TIMEOUT = 30000; // 30 seconds timeout

export interface AiProvider {
  generateContent(prompt: string): Promise<string>;
}

export abstract class BaseAiProvider implements AiProvider {
  async generateContent(prompt: string): Promise<string> {
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('AI request timed out after 30 seconds')), AI_TIMEOUT);
      });

      const contentPromise = this.generateContentInternal(prompt);
      const result = await Promise.race([contentPromise, timeoutPromise]);
      
      if (!result || typeof result !== 'string' || result.trim().length === 0) {
        throw new Error('AI returned empty or invalid response');
      }

      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected abstract generateContentInternal(prompt: string): Promise<string>;

  protected handleError(error: unknown): never {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      if (message.includes('timeout')) {
        throw new Error('🕒 AI požadavek vypršel. Zkuste to prosím znovu.');
      }
      if (message.includes('rate limit') || message.includes('quota')) {
        throw new Error('⚠️ Byl překročen limit AI požadavků. Zkuste to prosím později.');
      }
      throw new Error(`❌ Chyba AI: ${error.message}`);
    }
    throw new Error('❌ Neznámá chyba při komunikaci s AI');
  }
}

export { BaseAiProvider }