import { CommandInteraction, TextChannel } from 'discord.js';
import { MessageService } from '../services/message';
import { AiService } from '../services/ai';
import { Config } from '../utils/config';
import { CONFIG_TOKEN } from '../utils/tokens';
import { inject, injectable } from 'tsyringe';

@injectable()
export abstract class BaseCommand {
  constructor(
    @inject('CommandInteraction') protected interaction: CommandInteraction,
    @inject(MessageService) protected messageService: MessageService,
    @inject(AiService) protected aiService: AiService,
    @inject(CONFIG_TOKEN) protected config: Config
  ) {}

  abstract execute(): Promise<void>;

  protected async reply(content: string): Promise<void> {
    try {
      if (this.interaction.deferred) {
        await this.interaction.editReply(content);
      } else {
        await this.interaction.reply({
          content,
          ephemeral: this.config.ephemeralMessages,
        });
      }
    } catch (error) {
      console.error('Failed to reply to interaction:', error);
      // If the original reply fails, try to follow up
      try {
        await this.interaction.followUp({
          content,
          ephemeral: this.config.ephemeralMessages,
        });
      } catch (followUpError) {
        console.error('Failed to follow up on interaction:', followUpError);
      }
    }
  }

  protected async handleError(error: unknown): Promise<void> {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    try {
      if (this.interaction.deferred) {
        await this.interaction.editReply(`Error: ${errorMessage}`);
      } else {
        await this.interaction.reply({
          content: `Error: ${errorMessage}`,
          ephemeral: true,
        });
      }
    } catch (replyError) {
      console.error('Failed to send error message:', replyError);
    }
  }
}

export { BaseCommand }