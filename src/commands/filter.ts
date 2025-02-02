import { CommandInteraction, TextChannel } from 'discord.js';
import { injectable, inject } from 'tsyringe';
import { BaseCommand } from './base';
import { MessageService } from '../services/message';
import { AiService } from '../services/ai';
import { Config } from '../utils/config';
import { CONFIG_TOKEN } from '../utils/tokens';

@injectable()
export class FilterCommand extends BaseCommand {
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

      const count = this.interaction.options.getInteger('count') ?? 100;
      const user = this.interaction.options.getUser('user');
      const afterDate = this.interaction.options.getString('after');
      const beforeDate = this.interaction.options.getString('before');

      const messages = await this.messageService.fetchMessages(channel, {
        limit: count,
        mentionedUser: user?.id,
        after: afterDate ? new Date(afterDate) : undefined,
        before: beforeDate ? new Date(beforeDate) : undefined,
      });

      const summary = await this.aiService.generateSummary(
        messages.map(m => `${m.author.username}: ${m.content}`)
      );

      await this.reply(summary);
    } catch (error) {
      await this.handleError(error);
    }
  }
}