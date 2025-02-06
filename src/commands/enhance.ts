import { CommandInteraction } from 'discord.js';
import { injectable, inject } from 'tsyringe';
import { BaseCommand } from './base';
import { MessageService } from '../services/message';
import { AiService } from '../services/ai';
import { Config } from '../utils/config';
import { CONFIG_TOKEN } from '../utils/tokens';

@injectable()
export class EnhanceCommand extends BaseCommand {
  constructor(
    @inject('CommandInteraction') interaction: CommandInteraction,
    @inject(MessageService) messageService: MessageService,
    @inject(AiService) aiService: AiService,
    @inject(CONFIG_TOKEN) config: Config
  ) {
    super(interaction, messageService, aiService, config);
  }

  async execute(): Promise<void> {
    try {
      await this.interaction.deferReply({
        ephemeral: this.config.ephemeralMessages
      });

      const message = this.interaction.options.getString('message', true);
      
      const prompt = `Udělej z tohoto Discord zprávu s nadpisy pomocí ## a s emoji před každým nadpisem, s dalším formátováním pomocí **, odrážkami, a s dalšími emoji apod. Můžeš text i rozvést nebo upravit formulaci. Výstup by měl být včetně formátování jako 'raw' text, který mohu přímo zkopírovat. Zde je zpráva:\n${message}`;

      const enhanced = await this.aiService.provider.generateContent(prompt);

      const response = [
        "🔒 *Tato zpráva je viditelná pouze pro Tebe*\n",
        "📝 **Původní zpráva:**",
        "```",
        message,
        "```\n",
        "👀 **Náhled vylepšené verze:**",
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        enhanced,
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n",
        "✨ **Vylepšená verze ke zkopírování:**",
        "*Pro odeslání zkopíruj text z následujícího bloku:*",
        "```",
        enhanced,
        "```\n",
        "💡 *Tip: Klikni na tlačítko kopírování v pravém horním rohu kódového bloku*"
      ].join('\n');

      await this.reply(response);
    } catch (error) {
      await this.handleError(error);
    }
  }
}