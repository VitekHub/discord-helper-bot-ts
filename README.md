# Discord AI Summarizer Bot

A powerful Discord bot that leverages Google's Gemini Pro AI or Ollama to summarize and analyze channel conversations. Built with TypeScript and modern dependency injection patterns.

## Features

Core Features:
- 🤖 Dual AI Support: Choose between Google's Gemini Pro or Ollama
- 📝 Message Summarization: Get concise summaries of conversations
- 🔍 Information Extraction: Find key points and vital information
- ✨ Message Enhancement: Improve formatting and readability

Technical Features:
- ⚡ Slash Commands: Easy-to-use interface with parameter hints
- 🔧 Flexible Configuration: Customizable message limits and filters
- 📅 Advanced Filtering: Filter by date range and users
- 🏗️ Modular Architecture: Clean code structure with dependency injection

## Setup

1. Install Node.js:
   - Download and install Node.js 20 or higher from [nodejs.org](https://nodejs.org)
   - Verify installation by running:
     ```bash
     node --version
     npm --version
     ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Discord bot and get your token:
   - Go to https://discord.com/developers/applications
   - Create a new application
   - Go to the Bot section
   - Create a bot and copy its token
   - Enable Message Content Intent in the Bot section
   - Under OAuth2 > URL Generator, select:
     - `bot` scope
     - `applications.commands` scope (required for slash commands)
     - Required bot permissions
   - Use the generated URL to invite the bot to your server

4. Configure AI provider:
   
   Option A) Google AI (default):
   - Go to https://makersuite.google.com/app/apikey
   - Create a new API key
   - Set `AI_PROVIDER=google` in `.env`
   - Add your Google API key to `.env` as `GOOGLE_API_KEY`
   
   Option B) Ollama:
   - Install and run Ollama locally
   - Set `AI_PROVIDER=ollama` in `.env`
   - Configure `OLLAMA_HOST` and `OLLAMA_MODEL` in `.env`

5. Configure the bot:
   - Copy `.env.example` to `.env`
   - Add your Discord bot token
   - Configure your chosen AI provider

6. Run the bot:
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

## Project Structure

The project follows a clean, modular architecture using dependency injection for maintainability and testability:

```
src/
├── commands/              # Command handlers
│   ├── base.ts           # Base command class with shared functionality
│   ├── commands.ts       # Command registration and routing
│   ├── factory.ts        # Command factory using dependency injection
│   ├── filter.ts         # Message filtering and summarization
│   ├── help.ts           # Help documentation
│   ├── find.ts           # Custom prompt analysis
│   ├── vital.ts          # Vital information extraction
│   └── enhance.ts        # Message formatting enhancement
├── services/             # Core services
│   ├── ai.ts            # AI service orchestration
│   ├── message.ts       # Discord message handling
│   └── ai/              # AI provider implementations
│       ├── base.ts      # Base AI provider interface
│       ├── factory.ts   # Provider factory pattern
│       ├── google.ts    # Google AI implementation
│       └── ollama.ts    # Ollama implementation
└── utils/               # Utility functions
    ├── config.ts        # Environment configuration with Zod
    └── tokens.ts        # Dependency injection tokens
```

### Key Components

- **Commands**: Each command is implemented as a separate class, inheriting from `BaseCommand`
- **Services**: Core functionality separated into services with dependency injection
- **AI Providers**: Modular AI integration supporting multiple providers
- **Utils**: Configuration and dependency injection utilities

### Design Principles

- **Dependency Injection**: Using tsyringe for clean service management
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Clean Architecture**: Clear separation of concerns
- **SOLID Principles**: Following object-oriented design best practices

## Commands

### Basic Commands

- `/sum [count] [@user] [--after date] [--before date]` - Summarize messages with filters
- `/help` - Show help information
- `/sum-links [first_message_link] [last_message_link]` - Summarize messages between two message links
- `/sum-ids [first_message_id] [last_message_id]` - Summarize messages between two message IDs
- `/vital [count]` - Extract vital information in Czech
- `/find [prompt] [count]` - Analyze messages using a custom prompt
- `/enhance [message]` - Enhance message formatting using AI

## Examples

```bash
# Basic usage
/sum count:50                    # Last 50 messages

# User-specific summaries
/sum user:@username             # Messages mentioning user

# Date range summaries
/sum after:2024-02-01 before:2024-02-28    # Messages between dates

# Message link range summary
/sum-links first_link:https://discord.com/.../message1_id last_link:https://discord.com/.../message2_id

# Message ID range summary
/sum-ids first_id:1234567890 last_id:1234567891

# Vital information extraction
/vital count:50                 # Extract key points from last 50 messages

# Custom prompt analysis
/find prompt:"Find all meeting dates" count:100        # Search in last 100 messages
/find prompt:"What technical decisions were made?"     # Default: last 100 messages

# Message enhancement
/enhance message:"Meeting tomorrow at 2pm to discuss project status"   # Enhance message formatting
/enhance message:"New feature: Added user authentication"              # Format feature announcement
```