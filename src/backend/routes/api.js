import express from 'express';
import { validateTextInput, validateArticleInput } from '../middleware/validation.js';
import { getELI5Service } from '../services/eli5-service.js';
import { getSummaryService } from '../services/summary-service.js';
import { getDefinitionService } from '../services/definition-service.js';
import { getExampleService } from '../services/example-service.js';
import { getArticleService } from '../services/article-service.js';
import { getFeedService } from '../services/feed-service.js';

const router = express.Router();

/**
 * POST /api/eli5
 * Simplify text to child-friendly language
 */
router.post('/eli5', validateTextInput, async (req, res, next) => {
  try {
    const { text, context } = req.body;
    const eli5Service = getELI5Service();
    
    const result = await eli5Service.simplify(text, context);
    
    res.json({
      success: true,
      data: {
        content: result.explanation,
        metadata: result.metadata
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/summarize
 * Generate summaries and key points
 */
router.post('/summarize', validateTextInput, async (req, res, next) => {
  try {
    const { text, format = 'bullets' } = req.body;
    const summaryService = getSummaryService();
    
    const result = await summaryService.summarize(text, format);
    
    res.json({
      success: true,
      data: {
        content: result.summary,
        keyPoints: result.keyPoints,
        metadata: result.metadata
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/define
 * Get definitions for terms
 */
router.post('/define', validateTextInput, async (req, res, next) => {
  try {
    const { text, terms } = req.body;
    const definitionService = getDefinitionService();
    
    const result = await definitionService.define(text, terms);
    
    res.json({
      success: true,
      data: {
        definitions: result.definitions,
        metadata: result.metadata
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/explain
 * Get plain-language explanations
 */
router.post('/explain', validateTextInput, async (req, res, next) => {
  try {
    const { text, level = 'simple' } = req.body;
    const definitionService = getDefinitionService();
    
    const result = await definitionService.explain(text, level);
    
    res.json({
      success: true,
      data: {
        content: result.explanation,
        metadata: result.metadata
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/example
 * Get real-world examples and analogies
 */
router.post('/example', validateTextInput, async (req, res, next) => {
  try {
    const { text, exampleType = 'real-world' } = req.body;
    const exampleService = getExampleService();
    
    const result = await exampleService.generateExamples(text, exampleType);
    
    res.json({
      success: true,
      data: {
        examples: result.examples,
        metadata: result.metadata
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/article/analyze
 * Analyze articles for feed intelligence
 */
router.post('/article/analyze', validateArticleInput, async (req, res, next) => {
  try {
    const { url, content } = req.body;
    const articleService = getArticleService();
    
    const result = await articleService.analyzeArticle(url, content);
    
    res.json({
      success: true,
      data: {
        tldr: result.tldr,
        topics: result.topics,
        importance: result.importance,
        metadata: result.metadata
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/feed
 * Get all news articles from RSS feeds
 */
router.get('/feed', async (req, res, next) => {
  try {
    const feedService = getFeedService();
    const articles = await feedService.fetchAllFeeds();
    
    res.json({
      success: true,
      data: {
        articles,
        count: articles.length
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/feed/categories
 * Get available feed categories
 */
router.get('/feed/categories', async (req, res, next) => {
  try {
    const feedService = getFeedService();
    const categories = feedService.getCategories();
    
    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/feed/sources
 * Get available news sources
 */
router.get('/feed/sources', async (req, res, next) => {
  try {
    const feedService = getFeedService();
    const sources = feedService.getSources();
    
    res.json({
      success: true,
      data: { sources }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/feed/category/:category
 * Get articles by category
 */
router.get('/feed/category/:category', async (req, res, next) => {
  try {
    const { category } = req.params;
    const feedService = getFeedService();
    const articles = await feedService.fetchByCategory(category);
    
    res.json({
      success: true,
      data: {
        articles,
        category,
        count: articles.length
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/feed/search
 * Search articles by keyword
 */
router.get('/feed/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Search query is required'
        }
      });
    }
    
    const feedService = getFeedService();
    const articles = await feedService.searchArticles(q);
    
    res.json({
      success: true,
      data: {
        articles,
        query: q,
        count: articles.length
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/feed/article/:id
 * Get single article with AI analysis
 */
router.get('/feed/article/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const feedService = getFeedService();
    const article = await feedService.getArticleWithAnalysis(id);
    
    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/debug/env
 * Debug endpoint to check environment variables (remove in production!)
 */
router.get('/debug/env', async (req, res) => {
  res.json({
    success: true,
    data: {
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      keyPrefix: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 7) + '...' : 'NOT SET',
      nodeEnv: process.env.NODE_ENV,
      isVercel: process.env.VERCEL === '1'
    }
  });
});

export default router;
