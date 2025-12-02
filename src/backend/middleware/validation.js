import { ErrorCodes } from '../../shared/types.js';

/**
 * Validates text input for API requests
 */
export function validateTextInput(req, res, next) {
  const { text } = req.body;

  // Check if text exists
  if (!text) {
    return res.status(400).json({
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Text input is required'
      }
    });
  }

  // Check if text is a string
  if (typeof text !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Text input must be a string'
      }
    });
  }

  // Check if text is not just whitespace
  if (text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Text input cannot be empty or only whitespace'
      }
    });
  }

  // Check minimum length (3 characters)
  if (text.trim().length < 3) {
    return res.status(400).json({
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Text input must be at least 3 characters long'
      }
    });
  }

  // Check maximum length (5000 characters)
  if (text.length > 5000) {
    return res.status(400).json({
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Text input must be less than 5000 characters'
      }
    });
  }

  next();
}

/**
 * Validates article analysis input
 */
export function validateArticleInput(req, res, next) {
  const { url, content } = req.body;

  if (!url && !content) {
    return res.status(400).json({
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Either URL or content is required'
      }
    });
  }

  if (content && typeof content !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Content must be a string'
      }
    });
  }

  next();
}
