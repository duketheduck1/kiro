# 📎 Clippy Reborn

A modern reading and writing assistant that helps you understand articles, write better content, and stay informed with curated news feeds.

## What is this?

Clippy Reborn is a web app I built to make reading and writing easier. Select any text on the page and get instant help - whether you need a simple explanation, a quick summary, or examples to understand complex topics.

## Features

### 📖 Reader Mode
Read articles with instant assistance. Just highlight any text and choose what you need:
- **ELI5** - Get simple explanations anyone can understand
- **Summarize** - Quick summaries of long paragraphs
- **Define** - Clear definitions of technical terms
- **Example** - Real-world examples to make concepts click
- **Explain** - Plain language explanations

### ✍️ Writer Mode
Rich text editor with helpful features:
- Format your text (bold, italic, headings, lists)
- Get writing suggestions
- Check grammar and clarity
- Summarize your document
- Real-time word count

### 📰 News Feed
Stay updated with curated news from top sources:
- TechCrunch, BBC News, The Verge, and more
- Beautiful card layout with images
- Search and filter by category
- Clean, distraction-free reading

### 🔖 Bookmarklet
Use Clippy on ANY website! Drag the bookmarklet to your bookmarks bar and activate it on Wikipedia, Medium, or any article site.

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js, Express
- **RSS Parsing**: rss-parser
- **Rich Text Editor**: Quill.js
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- OpenAI API key

### Installation

1. Clone the repo:
```bash
git clone https://github.com/yourusername/clippy-reborn.git
cd clippy-reborn
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
OPENAI_API_KEY=your_api_key_here
PORT=3000
NODE_ENV=development
```

4. Start the server:
```bash
npm start
```

5. Open http://localhost:3000

## Project Structure

```
clippy-reborn/
├── public/              # Frontend HTML pages
│   ├── reborn.html     # Home page
│   ├── index.html      # Reader mode
│   ├── editor.html     # Writer mode
│   ├── feed-reborn.html # News feed
│   └── bookmarklet.html # Bookmarklet setup
├── src/
│   ├── frontend/       # Client-side JavaScript
│   │   ├── clippy-app.js
│   │   ├── clippy-widget.js
│   │   └── api-client.js
│   └── backend/        # Server-side code
│       ├── server.js
│       ├── routes/
│       └── services/
└── api/                # Vercel serverless functions
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Import your repo on [Vercel](https://vercel.com)

3. Add environment variable:
   - `OPENAI_API_KEY` = your OpenAI API key

4. Deploy!

## Usage

### Reader Mode
1. Visit the reader mode page
2. Select any text in the article
3. Choose an action from the popup menu
4. See the result in the purple widget

### Writer Mode
1. Open the writer mode
2. Start typing your content
3. Use the toolbar to format text
4. Select text for instant help
5. Use quick actions to improve your writing

### News Feed
1. Browse the latest articles
2. Click on any card to read more
3. Use the search bar to find specific topics
4. Filter by category

## Contributing

Feel free to open issues or submit pull requests. This is a personal project, but I'm happy to review contributions!

## License

MIT License - feel free to use this however you want.

## Acknowledgments

- Inspired by the classic Microsoft Clippy
- Built with modern web technologies
- Powered by OpenAI's GPT models

---
