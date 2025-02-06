import { CommandInteraction } from 'discord.js';
import { injectable, inject } from 'tsyringe';
import { BaseCommand } from './base';
import { MessageService } from '../services/message';
import { AiService } from '../services/ai';
import { Config } from '../utils/config';
import { CONFIG_TOKEN } from '../utils/tokens';

@injectable()
export class HelpCommand extends BaseCommand {
  constructor(
    @inject('CommandInteraction') interaction: CommandInteraction,
    @inject(MessageService) messageService: MessageService,
    @inject(AiService) aiService: AiService,
    @inject(CONFIG_TOKEN) config: Config
  ) {
    super(interaction, messageService, aiService, config);
  }

  async execute(): Promise<void> {
    const helpText = `
**Available Commands:**

**/sum [count] [user] [--after date] [--before date]**
Summarize messages with optional filters
- count: Number of messages to analyze (default: 100)
- user: Filter messages by mentioned user
- after: Include messages after date
- before: Include messages before date

**/sum-links [first_link] [last_link]**
Summarize messages between two message links

**/sum-ids [first_id] [last_id]**
Summarize messages between two message IDs

**/vital [count]**
Extract vital information
- count: Number of messages to analyze (default: 100)

**/find [prompt] [count]**
Analyze messages with a custom prompt
- prompt: Your custom analysis prompt
- count: Number of messages to analyze (default: 100)

**/enhance [message]**
Enhance message formatting with headings, emojis and better structure
- message: Text to enhance

**/help**
Display this help message
    `.trim();

    await this.reply(helpText);
  }
}