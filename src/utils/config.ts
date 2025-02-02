import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const configSchema = z.object({
  discordToken: z.string().min(1),
  aiProvider: z.enum(['google', 'ollama']),
  googleApiKey: z.string().optional(),
  ollamaHost: z.string().url().optional(),
  ollamaModel: z.string().optional(),
  ephemeralMessages: z.coerce.boolean().default(true),
});

export type Config = z.infer<typeof configSchema>;

export function loadConfig(): Config {
  const config = configSchema.parse({
    discordToken: process.env.DISCORD_TOKEN,
    aiProvider: process.env.AI_PROVIDER,
    googleApiKey: process.env.GOOGLE_API_KEY,
    ollamaHost: process.env.OLLAMA_HOST,
    ollamaModel: process.env.OLLAMA_MODEL,
    ephemeralMessages: process.env.EPHEMERAL_MESSAGES,
  });

  // Validate provider-specific configuration
  if (config.aiProvider === 'google' && !config.googleApiKey) {
    throw new Error('Google API key is required when using Google AI provider');
  }

  if (config.aiProvider === 'ollama' && (!config.ollamaHost || !config.ollamaModel)) {
    throw new Error('Ollama host and model are required when using Ollama provider');
  }

  return config;
}