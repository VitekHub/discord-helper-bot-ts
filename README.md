# Discord AI Summarizer Bot

A Discord bot that uses AI (Google's Gemini Pro or Ollama) to summarize and analyze channel conversations.

## Features

- 🤖 Multiple AI providers support (Google Gemini Pro and Ollama)
- 💬 Message summarization with flexible filters
- 🔍 Custom analysis prompts
- 🇨🇿 Czech language support for vital information extraction
- 🔗 Summarize messages between links or IDs
- 🛡️ Configurable ephemeral responses

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and configure your environment:
   ```env
   DISCORD_TOKEN=your_discord_token_here
   GOOGLE_API_KEY=your_google_api_key_here
   OLLAMA_HOST=http://localhost:11434
   OLLAMA_MODEL=llama2
   AI_PROVIDER=google
   EPHEMERAL_MESSAGES=true
   ```

   - `DISCORD_TOKEN`: Your Discord bot token
   - `GOOGLE_API_KEY`: Required if using Google's Gemini Pro
   - `OLLAMA_HOST` and `OLLAMA_MODEL`: Required if using Ollama
   - `AI_PROVIDER`: Either 'google' or 'ollama'
   - `EPHEMERAL_MESSAGES`: Set to 'true' for private responses

4. Start the bot:
   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   npm start
   ```

### Docker Setup

1. Build the image:
   ```bash
   docker build -t discord-ai-summarizer .
   ```

2. Run the container:
   ```bash
   docker run -d --env-file .env discord-ai-summarizer
   ```

## Available Commands

### /sum
Summarize messages with optional filters
```
/sum [count] [user] [--after date] [--before date]
```
- `count`: Number of messages to analyze (default: 100)
- `user`: Filter messages by mentioned user
- `after`: Include messages after date (YYYY-MM-DD)
- `before`: Include messages before date (YYYY-MM-DD)

### /sum-links
Summarize messages between two message links
```
/sum-links [first_link] [last_link]
```
- `first_link`: Link to the first message
- `last_link`: Link to the last message

### /sum-ids
Summarize messages between two message IDs
```
/sum-ids [first_id] [last_id]
```
- `first_id`: ID of the first message
- `last_id`: ID of the last message

### /vital
Extract vital information in Czech
```
/vital [count]
```
- `count`: Number of messages to analyze (default: 100)

### /find
Analyze messages with a custom prompt
```
/find [prompt] [count]
```
- `prompt`: Your custom analysis prompt
- `count`: Number of messages to analyze (default: 100)

### /help
Display command help and usage information

## Examples

1. Summarize last 50 messages:
   ```
   /sum count:50
   ```

2. Summarize messages from a specific user in the last 100 messages:
   ```
   /sum user:@username
   ```

3. Summarize messages between dates:
   ```
   /sum after:2024-01-01 before:2024-01-31
   ```

4. Extract vital information from last 200 messages in Czech:
   ```
   /vital count:200
   ```

5. Custom analysis:
   ```
   /find prompt:"List all questions asked in the conversation" count:100
   ```

## Development

- Written in TypeScript
- Uses Discord.js for Discord API integration
- Dependency injection with tsyringe
- Environment validation with Zod
- ESLint for code quality
- Vitest for testing

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request