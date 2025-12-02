# 📎 Clippy Reborn

**Your AI-Powered Reading & Writing Assistant**

Clippy Reborn is a modern, intelligent assistant that helps you read, write, and understand content with AI-powered explanations, summaries, and real-time assistance.

## Features

- **ELI5 Mode**: Simplify complex text to child-friendly language
- **Smart Summaries**: Get key points and TL;DR for any article
- **Instant Definitions**: Understand unfamiliar terms without leaving the page
- **Reading Companion**: Contextual help and guidance while reading
- **Feed Intelligence**: AI-powered article categorization and prioritization

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from example:
```bash
copy .env.example .env
```

3. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your_key_here
```

4. Start the backend server:
```bash
npm start
```

5. Open `demo.html` in your browser to test Clippy!

## Quick Start

**Windows:**
```bash
start.bat
```

Then open `demo.html` in your browser.

## Project Structure

```
src/
├── backend/       # Express API server
├── frontend/      # Clippy widget and UI
└── shared/        # Shared types and utilities
```

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## API Endpoints

- `POST /api/eli5` - Simplify text to child-friendly language
- `POST /api/summarize` - Generate summaries and key points
- `POST /api/define` - Get definitions for terms
- `POST /api/explain` - Get plain-language explanations
- `POST /api/example` - Get real-world examples and analogies
- `POST /api/article/analyze` - Analyze articles for feed intelligence

## Documentation

- 📖 [Quick Start Guide](QUICKSTART.md) - Get running in 3 minutes
- 📚 [Usage Guide](USAGE.md) - Detailed usage and API documentation
- 🏗️ [Build Summary](BUILD_SUMMARY.md) - What's been built and what works

## What's Included

✅ **Backend API** - All 6 endpoints fully functional
✅ **Frontend Widget** - Complete with text selection and interactions
✅ **AI Integration** - OpenAI GPT-4o-mini/GPT-4o with retry logic
✅ **Error Handling** - Comprehensive error handling and user feedback
✅ **Demo Page** - Working example with sample article
✅ **Tests** - Unit tests for core functionality (all passing)

## Status

🎉 **Production Ready** - Core features complete and functional!
