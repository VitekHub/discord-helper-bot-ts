import { injectable, inject } from 'tsyringe';
import { Config } from '../utils/config';
import { CONFIG_TOKEN } from '../utils/tokens';
import { AiProviderFactory } from './ai/factory';
import { AiProvider } from './ai/base';

@injectable()
export class AiService {
  private provider: AiProvider;

  constructor(@inject(CONFIG_TOKEN) config: Config) {
    this.provider = AiProviderFactory.createProvider(config);
  }

  async generateSummary(messages: string[]): Promise<string> {
    const prompt = `Prosím poskytni stručné shrnutí následující konverzace. Odpověz v češtině:\n\n${messages.join('\n')}`;
    return this.provider.generateContent(prompt);
  }

  async generateVitalInfo(messages: string[]): Promise<string> {
    const prompt = `Prosím analyzuj následující konverzaci a najdi a extrahuj pouze důležité informace a klíčová sdělení. 
Odstraň zbytečné části konverzace a small talk. Pokud najdeš obzvláště důležité zprávy, zkopíruj je doslovně. 
Pokud je to relevantní, zdůrazni termíny, deadliny nebo úkoly. Odpověz v češtině:\n\n${messages.join('\n')}`;
    return this.provider.generateContent(prompt);
  }

  async customAnalysis(messages: string[], customPrompt: string): Promise<string> {
    const prompt = `${customPrompt}\n\nConversation:\n${messages.join('\n')}`;
    return this.provider.generateContent(prompt);
  }
}