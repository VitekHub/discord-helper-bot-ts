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
    let errorMessage = error instanceof Error ? error.message : '❌ Došlo k neznámé chybě';
    
    // Add user-friendly message for network errors
    if (error instanceof Error && error.message.toLowerCase().includes('network')) {
      errorMessage = '🌐 Chyba připojení k AI službě. Zkontrolujte připojení a zkuste to znovu.';
    }

    try {
      // Always try to delete the deferred reply first if it exists
      if (this.interaction.deferred || this.interaction.replied) {
        try {
          await this.interaction.deleteReply();
        } catch (deleteError) {
          console.error('Failed to delete deferred reply:', deleteError);
        }
      }

      // Send a new error message
      await this.interaction.reply({
        content: errorMessage,
        ephemeral: true,
      });
    } catch (replyError) {
      console.error('Nepodařilo se odeslat chybovou zprávu:', replyError);
      // Last resort - try to follow up if everything else failed
      try {
        await this.interaction.followUp({
          content: errorMessage,
          ephemeral: true,
        });
      } catch (followUpError) {
        console.error('Failed to send follow-up error message:', followUpError);
      }
    }
  }
}

export { BaseCommand }