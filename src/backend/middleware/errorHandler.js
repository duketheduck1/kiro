import { ErrorCodes } from '../../shared/types.js';

/**
 * Centralized error handling middleware
 */
export function errorHandler(err, req, res, next) {
  // Log error for debugging
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Default error response
  let statusCode = 500;
  let errorResponse = {
    success: false,
    error: {
      code: ErrorCodes.INTERNAL_ERROR,
      message: 'An unexpected error occurred. Please try again later.'
    }
  };

  // Handle specific error types
  if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
    statusCode = 503;
    errorResponse.error.code = ErrorCodes.AI_ENGINE_ERROR;
    errorResponse.error.message = 'AI service is temporarily unavailable. Please try again in a moment.';
  } else if (err.name === 'TimeoutError') {
    statusCode = 504;
    errorResponse.error.code = ErrorCodes.TIMEOUT_ERROR;
    errorResponse.error.message = 'Request took too long to process. Please try with shorter text.';
  } else if (err.status === 429) {
    statusCode = 429;
    errorResponse.error.code = ErrorCodes.RATE_LIMIT_ERROR;
    errorResponse.error.message = "You've used Clippy a lot! Please wait a moment before trying again.";
  } else if (err.statusCode && err.statusCode >= 400 && err.statusCode < 500) {
    statusCode = err.statusCode;
    errorResponse.error.message = err.message || 'Invalid request';
  }

  // Include error details in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.details = err.message;
  }

  res.status(statusCode).json(errorResponse);
}

/**
 * 404 handler for undefined routes
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      code: ErrorCodes.VALIDATION_ERROR,
      message: 'Endpoint not found'
    }
  });
}
