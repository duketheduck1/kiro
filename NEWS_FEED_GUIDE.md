# 📰 Clippy News Feed - Complete Guide

## 🎉 New Feature: AI-Powered News Aggregator!

Clippy now includes a complete news feed system with RSS aggregation, AI analysis, and source citations!

## 🚀 Quick Start

1. Visit **http://localhost:3000**
2. Click **"News Feed"** from the home page
3. Or go directly to **http://localhost:3000/feed.html**

## ✨ Features

### 📡 News Aggregation
- **Multiple Sources** - TechCrunch, BBC News, The Verge, Hacker News, MIT Tech Review, Ars Technica
- **Live RSS Feeds** - Real-time updates from top news sources
- **Smart Caching** - 15-minute cache for better performance
- **60+ Articles** - Fresh content from 6+ sources

### 🔍 Filtering & Search
- **Category Filter** - Technology, General News, Science & Tech
- **Source Filter** - Filter by specific news outlet
- **Search** - Find articles by keyword
- **Real-time Updates** - Articles sorted by date (newest first)

### 🤖 AI-Powered Features
- **Summarize** - Get instant AI summaries of any article
- **Analyze** - Get TL;DR, topics, and importance scores
- **Clippy Assistance** - Select text for ELI5, definitions, examples
- **Source Citations** - Every summary includes source attribution

### 📊 Article Information
- **Title & Description** - Clear article preview
- **Source Attribution** - Know where content comes from
- **Publication Date** - See how recent the news is
- **Author Information** - Track content creators
- **Category Tags** - Quick topic identification

## 🎯 How to Use

### Browse Articles
1. **Scroll through feed** - See latest articles
2. **Click article card** - Opens original source in new tab
3. **View metadata** - Source, category, date, author

### Filter Content
1. **By Category** - Click category in sidebar
2. **By Source** - Click source name in sidebar
3. **Search** - Type keyword and press Enter
4. **Reset** - Click "All Articles" to see everything

### Get AI Summaries
1. **Click "📝 Summarize"** on any article
2. **View in Clippy widget** - See AI-generated summary
3. **Source included** - Citation shows article source
4. **Key points** - Bullet-point format for quick reading

### Analyze Articles
1. **Click "🔍 Analyze"** on any article
2. **Get AI analysis**:
   - TL;DR summary
   - Topic categories
   - Importance score (0-100)
   - Source citation

### Use Clippy on Articles
1. **Select any text** in article description
2. **Choose AI option**:
   - 📚 ELI5 - Simplify
   - 📝 Summarize - Key points
   - 📖 Define - Terms
   - 🌟 Example - Analogies
   - 💡 Explain - Plain language

## 📡 Available News Sources

### Technology
- **TechCrunch** - Startup and tech news
- **The Verge** - Tech, science, art, culture
- **Hacker News** - Tech community news
- **Ars Technica** - Tech policy and reviews

### Science & Tech
- **MIT Technology Review** - Emerging technology

### General News
- **BBC News** - World news and current events

## 🔗 API Endpoints

### GET /api/feed
Get all articles from all sources
```javascript
fetch('http://localhost:3000/api/feed')
```

### GET /api/feed/categories
Get available categories
```javascript
fetch('http://localhost:3000/api/feed/categories')
```

### GET /api/feed/sources
Get available news sources
```javascript
fetch('http://localhost:3000/api/feed/sources')
```

### GET /api/feed/category/:category
Get articles by category
```javascript
fetch('http://localhost:3000/api/feed/category/Technology')
```

### GET /api/feed/search?q=keyword
Search articles
```javascript
fetch('http://localhost:3000/api/feed/search?q=AI')
```

### GET /api/feed/article/:id
Get article with AI analysis
```javascript
fetch('http://localhost:3000/api/feed/article/abc123')
```

## 💡 Use Cases

### Stay Informed
- Browse latest tech news
- Get quick summaries
- Track multiple sources
- Filter by interest

### Research
- Search specific topics
- Get AI analysis
- Compare sources
- Extract key points

### Learning
- Simplify complex articles
- Get definitions
- See real-world examples
- Understand context

### Content Curation
- Find trending topics
- Analyze importance
- Track categories
- Monitor sources

## 🎨 Interface Overview

### Header
- **Title** - "Clippy News Feed"
- **Search Bar** - Find articles by keyword
- **Home Link** - Return to mode selection

### Sidebar
- **Categories** - Filter by topic
- **Sources** - Filter by outlet
- **Active Filters** - Highlighted selection

### Main Feed
- **Feed Header** - Current view and count
- **Article Cards** - Title, description, metadata
- **Action Buttons** - Summarize and Analyze
- **Click to Open** - View original article

### Clippy Widget
- **Bottom Right** - Always accessible
- **AI Responses** - Summaries and analysis
- **Popup Tips** - Helpful suggestions

## 📊 Article Card Details

Each article shows:
- **📡 Source** - News outlet name (colored)
- **Category Tag** - Topic classification
- **📅 Date** - Publication time (relative)
- **Title** - Article headline
- **Description** - Preview text (300 chars)
- **Author** - Content creator
- **Actions** - Summarize and Analyze buttons

## 🔄 Data Flow

1. **RSS Feeds** → Backend fetches from sources
2. **Parsing** → Extracts title, description, link, date
3. **Caching** → Stores for 15 minutes
4. **Frontend** → Displays in feed
5. **User Action** → Triggers AI analysis
6. **OpenAI** → Generates summary/analysis
7. **Display** → Shows in Clippy widget with citation

## 🎓 Pro Tips

### Efficient Browsing
- **Use filters** - Narrow down to interests
- **Search first** - Find specific topics quickly
- **Check dates** - Focus on recent news
- **Scan summaries** - Get quick overview

### AI Assistance
- **Summarize long articles** - Save reading time
- **Analyze importance** - Prioritize reading
- **Select confusing text** - Get instant help
- **Use ELI5** - Simplify technical content

### Source Verification
- **Check source** - Know where content comes from
- **View original** - Click card to verify
- **Compare sources** - See different perspectives
- **Track authors** - Follow specific writers

## 🔧 Technical Details

### Backend
- **RSS Parser** - Parses XML feeds
- **Feed Service** - Manages sources and caching
- **API Routes** - 6 endpoints for feed operations
- **AI Integration** - OpenAI for analysis

### Frontend
- **Responsive Design** - Works on all devices
- **Real-time Search** - Instant filtering
- **Lazy Loading** - Efficient rendering
- **Citation Tracking** - Source attribution

### Caching
- **15-minute cache** - Reduces API calls
- **In-memory storage** - Fast access
- **Auto-refresh** - Updates when cache expires

## 🚀 Future Enhancements

### Planned Features
- More news sources
- Custom RSS feed URLs
- Bookmark articles
- Reading history
- Personalized recommendations
- Email digests
- Export summaries
- Social sharing

## 📝 Notes

- **Internet required** - Fetches live feeds
- **OpenAI API key needed** - For AI features
- **Cache updates** - Every 15 minutes
- **Source attribution** - Always included
- **Original links** - Click to verify

## 🎉 Enjoy Your News Feed!

Stay informed with AI-powered news aggregation and analysis. Get summaries, insights, and understanding with proper source citations! 📰📎
