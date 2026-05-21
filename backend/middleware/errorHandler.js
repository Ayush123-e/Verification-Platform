/**
 * Global Express Error Handler Middleware
 * Must be registered last in app.js after all routes.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;

  console.error(`[ERROR] ${req.method} ${req.originalUrl} → ${statusCode}: ${err.message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

/**
 * Utility to create custom errors with a status code.
 * Usage: throw createError(404, 'Resource not found')
 */
const createError = (statusCode, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

module.exports = { errorHandler, createError };
