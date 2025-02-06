import { BaseAiProvider } from './base';

export class OllamaProvider extends BaseAiProvider {
  constructor(
    private readonly host: string,
    private readonly model: string
  ) {
    super();
  }

  protected async generateContentInternal(prompt: string): Promise<string> {
    const response = await fetch(`${this.host}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  }
}