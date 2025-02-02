import { injectable } from 'tsyringe';
import { Message, TextChannel } from 'discord.js';

export interface FilterOptions {
  limit?: number;
  after?: Date;
  before?: Date;
  mentionedUser?: string;
}

@injectable()
export class MessageService {
  async fetchMessages(
    channel: TextChannel,
    options: FilterOptions = {}
  ): Promise<Message[]> {
    const { limit = 100, after, before, mentionedUser } = options;
    
    let messages = await channel.messages.fetch({ limit });
    
    // Apply filters
    messages = messages.filter(msg => {
      if (after && msg.createdAt < after) return false;
      if (before && msg.createdAt > before) return false;
      if (mentionedUser && !msg.mentions.users.has(mentionedUser)) return false;
      return true;
    });

    return Array.from(messages.values());
  }

  async fetchMessagesBetweenIds(
    channel: TextChannel,
    firstId: string,
    lastId: string
  ): Promise<Message[]> {
    const messages = await channel.messages.fetch({
      after: firstId,
      before: lastId,
    });

    return Array.from(messages.values());
  }

  async fetchMessagesBetweenLinks(
    channel: TextChannel,
    firstLink: string,
    lastLink: string
  ): Promise<Message[]> {
    const firstId = this.extractMessageId(firstLink);
    const lastId = this.extractMessageId(lastLink);

    if (!firstId || !lastId) {
      throw new Error('Invalid message links provided');
    }

    return this.fetchMessagesBetweenIds(channel, firstId, lastId);
  }

  private extractMessageId(link: string): string | null {
    const match = link.match(/\/channels\/\d+\/\d+\/(\d+)/);
    return match ? match[1] : null;
  }
}