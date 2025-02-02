import 'reflect-metadata';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { container } from 'tsyringe';
import { loadConfig } from './utils/config';
import { CONFIG_TOKEN } from './utils/tokens';
import { CommandFactory } from './commands/factory';
import { registerCommands } from './commands/commands';
import { MessageService } from './services/message';
import { AiService } from './services/ai';

async function main() {
  try {
    const config = loadConfig();
    
    // Register services
    container.registerInstance(CONFIG_TOKEN, config);
    container.registerSingleton(MessageService);
    container.registerSingleton(AiService);

    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    client.once(Events.ClientReady, async (c) => {
      console.log(`Ready! Logged in as ${c.user.tag}`);
      await registerCommands(client);
    });

    client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isCommand()) return;

      let command;
      try {
        command = CommandFactory.createCommand(interaction);
        await command.execute();
      } catch (error) {
        console.error(error);
        try {
          if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
              content: 'There was an error executing this command!',
              ephemeral: true,
            });
          } else if (interaction.deferred) {
            await interaction.editReply('There was an error executing this command!');
          }
        } catch (replyError) {
          console.error('Failed to send error message:', replyError);
        }
      }
    });

    await client.login(config.discordToken);
  } catch (error) {
    console.error('Failed to start the bot:', error);
    process.exit(1);
  }
}

main();