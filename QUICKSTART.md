# 🚀 Quick Start Guide

Get Clippy Reader AI running in 3 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure API Key

1. Copy the example environment file:
```bash
copy .env.example .env
```

2. Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-key-here
```

Get your API key from: https://platform.openai.com/api-keys

## Step 3: Start the Server

```bash
npm start
```

You should see:
```
🤖 Clippy Reader AI server running on port 3000
📍 Health check: http://localhost:3000/health
🔧 Environment: development
```

## Step 4: Try It Out!

Open `demo.html` in your web browser.

### Test Clippy:

1. **Select any text** in the article
2. **Click an option** from the menu that appears:
   - 📚 ELI5 - Super simple explanation
   - 📝 Summarize - Key points
   - 📖 Define - Term definitions
   - 🌟 Example - Real examples
   - 💡 Explain - Plain explanation
3. **See the magic!** Clippy shows the AI response

## That's It! 🎉

You now have a working AI reading assistant!

## Next Steps

- Read [USAGE.md](USAGE.md) for detailed usage
- Check [BUILD_SUMMARY.md](BUILD_SUMMARY.md) for what's included
- Integrate into your own website (see USAGE.md)

## Troubleshooting

**Server won't start?**
- Make sure port 3000 is free
- Check your `.env` file has a valid API key

**Widget doesn't appear?**
- Open browser console (F12) to check for errors
- Make sure the server is running

**Need help?**
- Check the console for error messages
- Review USAGE.md for more details
