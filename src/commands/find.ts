import { CommandInteraction, TextChannel } from 'discord.js';
import { injectable, inject } from 'tsyringe';
import { BaseCommand } from './base';
import { MessageService } from '../services/message';
import { AiService } from '../services/ai';
import { Config } from '../utils/config';
import { CONFIG_TOKEN } from '../utils/tokens';

@injectable()
export class FindCommand extends BaseCommand {
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

      const channel = this.interaction.channel as TextChannel;
      if (!channel) {
        throw new Error('Command must be used in a text channel');
      }

      const prompt = this.interaction.options.getString('prompt', true);
      const count = this.interaction.options.getInteger('count') ?? 100;
      
      const messages = await this.messageService.fetchMessages(channel, { limit: count });
      const analysis = await this.aiService.customAnalysis(
        messages.map(m => `${m.author.username}: ${m.content}`),
        prompt
      );

      await this.reply(analysis);
    } catch (error) {
      await this.handleError(error);
    }
  }
}