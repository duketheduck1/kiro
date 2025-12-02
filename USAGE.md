# Clippy Reader AI - Usage Guide

## Getting Started

### 1. Installation

```bash
# Install dependencies
npm install

# Create environment file
copy .env.example .env
```

### 2. Configuration

Edit `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-key-here
PORT=3000
NODE_ENV=development
```

### 3. Start the Server

```bash
# Start backend server
npm start

# Or use the batch file (Windows)
start.bat
```

The server will start on `http://localhost:3000`

### 4. Test the Application

Open `demo.html` in your web browser. You should see:
- A sample article about quantum computing
- The Clippy widget in the bottom-right corner

## How to Use Clippy

### Basic Usage

1. **Select Text**: Highlight any text in the article
2. **Choose Action**: A menu will appear with options:
   - 📚 **ELI5** - Explain like you're 5 (simplest explanation)
   - 📝 **Summarize** - Get key points in bullet format
   - 📖 **Define** - Define technical terms
   - 🌟 **Example** - Get real-world examples
   - 💡 **Explain** - Plain language explanation
3. **View Response**: Clippy will show the AI-generated response

### Widget Controls

- **Click header** - Minimize/maximize the widget
- **× button** - Hide the widget
- **− button** - Minimize the widget

## API Endpoints

### POST /api/eli5
Simplify text to child-friendly language

**Request:**
```json
{
  "text": "Quantum entanglement allows qubits to be correlated",
  "context": "Article about quantum computing"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "content": "Imagine you have two magic coins...",
    "metadata": {
      "processingTime": 1234,
      "tokensUsed": 150
    }
  }
}
```

### POST /api/summarize
Generate summaries and key points

**Request:**
```json
{
  "text": "Long article text...",
  "format": "bullets"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "content": "• Point 1\n• Point 2\n• Point 3",
    "keyPoints": ["Point 1", "Point 2", "Point 3"],
    "metadata": { "processingTime": 1500 }
  }
}
```

### POST /api/define
Get definitions for terms

**Request:**
```json
{
  "text": "Quantum superposition and entanglement",
  "terms": ["superposition", "entanglement"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "definitions": [
      {
        "term": "superposition",
        "definition": "The ability of quantum particles..."
      }
    ],
    "metadata": { "processingTime": 1200 }
  }
}
```

### POST /api/explain
Get plain-language explanations

**Request:**
```json
{
  "text": "Quantum decoherence",
  "level": "simple"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "content": "Quantum decoherence is when...",
    "metadata": { "processingTime": 1100 }
  }
}
```

### POST /api/example
Get real-world examples

**Request:**
```json
{
  "text": "Quantum superposition",
  "exampleType": "real-world"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "examples": [
      "Think of a coin spinning in the air...",
      "Like Schrödinger's cat..."
    ],
    "metadata": { "processingTime": 1300 }
  }
}
```

### POST /api/article/analyze
Analyze articles for feed intelligence

**Request:**
```json
{
  "url": "https://example.com/article",
  "content": "Full article text..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tldr": "Article discusses quantum computing advances",
    "topics": ["Technology", "Science", "Computing"],
    "importance": 75,
    "metadata": { "processingTime": 2000 }
  }
}
```

## Integration Guide

### Integrate into Your Website

1. **Include the scripts:**

```html
<script src="path/to/api-client.js"></script>
<script src="path/to/clippy-widget.js"></script>
<script src="path/to/highlight-detector.js"></script>
<script src="path/to/interaction-menu.js"></script>
<script src="path/to/clippy-app.js"></script>
```

2. **Initialize Clippy:**

```javascript
const clippy = new ClippyApp({
  apiBaseUrl: 'http://localhost:3000/api',
  position: 'bottom-right', // or 'bottom-left'
  theme: 'light' // or 'dark'
});
```

3. **That's it!** Clippy will automatically detect text selections.

### Customize Configuration

```javascript
const clippy = new ClippyApp({
  // API endpoint
  apiBaseUrl: 'https://your-api.com/api',
  
  // Widget position
  position: 'bottom-right', // 'bottom-left', 'bottom-right'
  
  // Theme
  theme: 'light', // 'light' or 'dark'
});
```

## Troubleshooting

### Server won't start
- Check that port 3000 is not in use
- Verify your `.env` file has a valid `OPENAI_API_KEY`
- Run `npm install` to ensure dependencies are installed

### Widget doesn't appear
- Check browser console for errors
- Verify the backend server is running
- Check that scripts are loaded in correct order

### API requests fail
- Verify CORS is enabled (it is by default)
- Check network tab in browser dev tools
- Ensure API base URL is correct

### Responses are slow
- OpenAI API calls can take 2-5 seconds
- Check your internet connection
- Consider using GPT-4o-mini for faster responses

## Development

### Run Tests

```bash
npm test
```

### Run in Development Mode

```bash
npm run dev
```

This uses Node's `--watch` flag to auto-restart on file changes.

### Project Structure

```
src/
├── backend/
│   ├── services/        # AI services (ELI5, Summary, etc.)
│   ├── middleware/      # Validation, error handling
│   ├── routes/          # API endpoints
│   └── server.js        # Express server
├── frontend/
│   ├── clippy-widget.js      # Main widget UI
│   ├── highlight-detector.js # Text selection detection
│   ├── interaction-menu.js   # Options menu
│   ├── api-client.js         # API communication
│   └── clippy-app.js         # Main integration
└── shared/
    └── types.js         # Shared type definitions
```

## Tips for Best Results

1. **Select meaningful text** - At least 3 characters, preferably complete sentences
2. **Use ELI5 for complex topics** - Great for technical jargon
3. **Use Summarize for long passages** - Get the key points quickly
4. **Use Define for unfamiliar terms** - Quick definitions without leaving the page
5. **Use Examples for abstract concepts** - Makes ideas more concrete

## Browser Extension (Future)

The architecture supports browser extension deployment. The widget can be packaged as a Chrome/Firefox extension to work across all websites.

## Support

For issues or questions:
- Check the troubleshooting section above
- Review the demo.html for working examples
- Check browser console for error messages
