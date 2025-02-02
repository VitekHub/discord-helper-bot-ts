import { Config } from '../../utils/config';
import { AiProvider } from './base';
import { GoogleAiProvider } from './google';
import { OllamaProvider } from './ollama';

export class AiProviderFactory {
  static createProvider(config: Config): AiProvider {
    switch (config.aiProvider) {
      case 'google':
        if (!config.googleApiKey) {
          throw new Error('Google API key is required');
        }
        return new GoogleAiProvider(config.googleApiKey);
      case 'ollama':
        if (!config.ollamaHost || !config.ollamaModel) {
          throw new Error('Ollama host and model are required');
        }
        return new OllamaProvider(config.ollamaHost, config.ollamaModel);
      default:
        throw new Error(`Unsupported AI provider: ${config.aiProvider}`);
    }
  }
}