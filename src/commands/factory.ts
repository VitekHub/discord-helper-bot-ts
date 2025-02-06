import { CommandInteraction } from 'discord.js';
import { container, DependencyContainer } from 'tsyringe';
import { FilterCommand } from './filter';
import { VitalCommand } from './vital';
import { FindCommand } from './find';
import { HelpCommand } from './help';
import { EnhanceCommand } from './enhance';
import { MessageService } from '../services/message';
import { AiService } from '../services/ai';
import { Config } from '../utils/config';
import { CONFIG_TOKEN } from '../utils/tokens';

export class CommandFactory {
  static createCommand(interaction: CommandInteraction) {
    // Create a child container for the command's scope
    const childContainer = container.createChildContainer();
    
    // Register the interaction instance
    childContainer.registerInstance('CommandInteraction', interaction);

    switch (interaction.commandName) {
      case 'sum':
        return childContainer.resolve(FilterCommand);
      case 'vital':
        return childContainer.resolve(VitalCommand);
      case 'find':
        return childContainer.resolve(FindCommand);
      case 'help':
        return childContainer.resolve(HelpCommand);
      case 'enhance':
        return childContainer.resolve(EnhanceCommand);
      default:
        throw new Error('Unknown command');
    }
  }
}