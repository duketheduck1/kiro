import Parser from 'rss-parser';
import { getArticleService } from './article-service.js';

/**
 * Service for fetching and managing RSS feeds
 */
class FeedService {
  constructor() {
    this.parser = new Parser({
      customFields: {
        item: ['media:content', 'media:thumbnail', 'content:encoded']
      }
    });
    
    // Default news sources
    this.defaultFeeds = [
      {
        name: 'TechCrunch',
        url: 'https://techcrunch.com/feed/',
        category: 'Technology'
      },
      {
        name: 'BBC News',
        url: 'http://feeds.bbci.co.uk/news/rss.xml',
        category: 'General News'
      },
      {
        name: 'The Verge',
        url: 'https://www.theverge.com/rss/index.xml',
        category: 'Technology'
      },
      {
        name: 'Hacker News',
        url: 'https://hnrss.org/frontpage',
        category: 'Technology'
      },
      {
        name: 'MIT Technology Review',
        url: 'https://www.technologyreview.com/feed/',
        category: 'Science & Tech'
      },
      {
        name: 'Ars Technica',
        url: 'https://feeds.arstechnica.com/arstechnica/index',
        category: 'Technology'
      }
    ];
    
    this.cache = new Map();
    this.cacheTimeout = 15 * 60 * 1000; // 15 minutes
  }

  /**
   * Fetch articles from a single RSS feed
   */
  async fetchFeed(feedUrl, feedName, category) {
    try {
      const feed = await this.parser.parseURL(feedUrl);
      
      const articles = feed.items.slice(0, 10).map(item => ({
        id: this.generateId(item.link),
        title: item.title,
        link: item.link,
        description: this.cleanDescription(item.contentSnippet || item.description || ''),
        content: item.content || item['content:encoded'] || item.description || '',
        pubDate: item.pubDate || item.isoDate,
        author: item.creator || item.author || feedName,
        source: feedName,
        category: category,
        image: this.extractImage(item),
        guid: item.guid || item.link
      }));
      
      return articles;
    } catch (error) {
      console.error(`Error fetching feed ${feedName}:`, error.message);
      return [];
    }
  }

  /**
   * Fetch articles from all default feeds
   */
  async fetchAllFeeds() {
    const cacheKey = 'all-feeds';
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }
    
    console.log('Fetching articles from all feeds...');
    
    const feedPromises = this.defaultFeeds.map(feed =>
      this.fetchFeed(feed.url, feed.name, feed.category)
    );
    
    const results = await Promise.allSettled(feedPromises);
    
    const allArticles = results
      .filter(result => result.status === 'fulfilled')
      .flatMap(result => result.value);
    
    // Sort by date (newest first)
    allArticles.sort((a, b) => {
      const dateA = new Date(a.pubDate);
      const dateB = new Date(b.pubDate);
      return dateB - dateA;
    });
    
    // Cache the results
    this.cache.set(cacheKey, {
      data: allArticles,
      timestamp: Date.now()
    });
    
    console.log(`Fetched ${allArticles.length} articles from ${this.defaultFeeds.length} sources`);
    
    return allArticles;
  }

  /**
   * Fetch articles by category
   */
  async fetchByCategory(category) {
    const allArticles = await this.fetchAllFeeds();
    return allArticles.filter(article => article.category === category);
  }

  /**
   * Search articles by keyword
   */
  async searchArticles(query) {
    const allArticles = await this.fetchAllFeeds();
    const lowerQuery = query.toLowerCase();
    
    return allArticles.filter(article =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get article with AI analysis
   */
  async getArticleWithAnalysis(articleId) {
    const allArticles = await this.fetchAllFeeds();
    const article = allArticles.find(a => a.id === articleId);
    
    if (!article) {
      throw new Error('Article not found');
    }
    
    // Generate AI analysis
    try {
      const articleService = getArticleService();
      const analysis = await articleService.analyzeArticle(article.link, article.content);
      
      return {
        ...article,
        analysis: {
          tldr: analysis.tldr,
          topics: analysis.topics,
          importance: analysis.importance
        }
      };
    } catch (error) {
      console.error('Error analyzing article:', error);
      return article;
    }
  }

  /**
   * Generate unique ID from URL
   */
  generateId(url) {
    return Buffer.from(url).toString('base64').substring(0, 16);
  }

  /**
   * Clean HTML from description
   */
  cleanDescription(text) {
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .substring(0, 300);
  }

  /**
   * Extract image from feed item
   */
  extractImage(item) {
    // Try media:content
    if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
      return item['media:content'].$.url;
    }
    
    // Try media:thumbnail
    if (item['media:thumbnail'] && item['media:thumbnail'].$ && item['media:thumbnail'].$.url) {
      return item['media:thumbnail'].$.url;
    }
    
    // Try enclosure
    if (item.enclosure && item.enclosure.url) {
      return item.enclosure.url;
    }
    
    // Try to extract from content
    if (item.content) {
      const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
      if (imgMatch) {
        return imgMatch[1];
      }
    }
    
    return null;
  }

  /**
   * Get available categories
   */
  getCategories() {
    return [...new Set(this.defaultFeeds.map(feed => feed.category))];
  }

  /**
   * Get available sources
   */
  getSources() {
    return this.defaultFeeds.map(feed => ({
      name: feed.name,
      category: feed.category
    }));
  }
}

// Singleton instance
let instance = null;

export function getFeedService() {
  if (!instance) {
    instance = new FeedService();
  }
  return instance;
}

export default FeedService;
