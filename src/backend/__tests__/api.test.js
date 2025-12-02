import { describe, it, expect } from 'vitest';

describe('Backend API Structure', () => {
  it('should have all required service modules', async () => {
    // Test that all service modules can be imported
    const { getOpenAIClient } = await import('../services/openai-client.js');
    const { getPromptBuilder } = await import('../services/prompt-builder.js');
    const { getELI5Service } = await import('../services/eli5-service.js');
    const { getSummaryService } = await import('../services/summary-service.js');
    const { getDefinitionService } = await import('../services/definition-service.js');
    const { getExampleService } = await import('../services/example-service.js');

    expect(getOpenAIClient).toBeDefined();
    expect(getPromptBuilder).toBeDefined();
    expect(getELI5Service).toBeDefined();
    expect(getSummaryService).toBeDefined();
    expect(getDefinitionService).toBeDefined();
    expect(getExampleService).toBeDefined();
  });

  it('should have validation middleware', async () => {
    const { validateTextInput, validateArticleInput } = await import('../middleware/validation.js');
    
    expect(validateTextInput).toBeDefined();
    expect(validateArticleInput).toBeDefined();
    expect(typeof validateTextInput).toBe('function');
    expect(typeof validateArticleInput).toBe('function');
  });

  it('should have error handling middleware', async () => {
    const { errorHandler, notFoundHandler } = await import('../middleware/errorHandler.js');
    
    expect(errorHandler).toBeDefined();
    expect(notFoundHandler).toBeDefined();
    expect(typeof errorHandler).toBe('function');
    expect(typeof notFoundHandler).toBe('function');
  });
});

describe('Validation Middleware', () => {
  it('should reject empty text input', () => {
    const { validateTextInput } = require('../middleware/validation.js');
    
    const req = { body: { text: '' } };
    const res = {
      status: (code) => ({
        json: (data) => {
          expect(code).toBe(400);
          expect(data.success).toBe(false);
          expect(data.error.code).toBe('VALIDATION_ERROR');
        }
      })
    };
    const next = () => {};

    validateTextInput(req, res, next);
  });

  it('should reject whitespace-only text input', () => {
    const { validateTextInput } = require('../middleware/validation.js');
    
    const req = { body: { text: '   ' } };
    const res = {
      status: (code) => ({
        json: (data) => {
          expect(code).toBe(400);
          expect(data.success).toBe(false);
        }
      })
    };
    const next = () => {};

    validateTextInput(req, res, next);
  });

  it('should accept valid text input', () => {
    const { validateTextInput } = require('../middleware/validation.js');
    
    const req = { body: { text: 'This is valid text' } };
    const res = {};
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    validateTextInput(req, res, next);
    expect(nextCalled).toBe(true);
  });
});
