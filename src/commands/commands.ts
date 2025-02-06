import { ApplicationCommandOptionType, Client } from 'discord.js';

export async function registerCommands(client: Client): Promise<void> {
  const commands = [
    {
      name: 'sum',
      description: 'Summarize messages with optional filters',
      options: [
        {
          name: 'count',
          description: 'Number of messages to analyze',
          type: ApplicationCommandOptionType.Integer,
          required: false,
        },
        {
          name: 'user',
          description: 'Filter messages by mentioned user',
          type: ApplicationCommandOptionType.User,
          required: false,
        },
        {
          name: 'after',
          description: 'Include messages after date (YYYY-MM-DD)',
          type: ApplicationCommandOptionType.String,
          required: false,
        },
        {
          name: 'before',
          description: 'Include messages before date (YYYY-MM-DD)',
          type: ApplicationCommandOptionType.String,
          required: false,
        },
      ],
    },
    {
      name: 'sum-links',
      description: 'Summarize messages between two message links',
      options: [
        {
          name: 'first_link',
          description: 'Link to the first message',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: 'last_link',
          description: 'Link to the last message',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: 'sum-ids',
      description: 'Summarize messages between two message IDs',
      options: [
        {
          name: 'first_id',
          description: 'ID of the first message',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: 'last_id',
          description: 'ID of the last message',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: 'vital',
      description: 'Extract vital information in Czech',
      options: [
        {
          name: 'count',
          description: 'Number of messages to analyze',
          type: ApplicationCommandOptionType.Integer,
          required: false,
        },
      ],
    },
    {
      name: 'find',
      description: 'Analyze messages with a custom prompt',
      options: [
        {
          name: 'prompt',
          description: 'Your custom analysis prompt',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: 'count',
          description: 'Number of messages to analyze',
          type: ApplicationCommandOptionType.Integer,
          required: false,
        },
      ],
    },
    {
      name: 'help',
      description: 'Display command help',
    },
    {
      name: 'enhance',
      description: 'Enhance message formatting with headings, emojis and better structure',
      options: [
        {
          name: 'message',
          description: 'Message to enhance',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
  ];

  if (!client.application) {
    throw new Error('Client application is not ready');
  }

  await client.application.commands.set(commands);
}