import { Request, Response, NextFunction } from "express";

/**
 * Global error handling middleware for Express application
 * Catches and processes unhandled errors from controllers and other middleware
 * Provides consistent error response format across the API
 * @param err - Error object containing error details
 * @param _req - Express request object (unused, prefixed with underscore)
 * @param res - Express response object for sending error response
 * @param _next - Express next function (unused, prefixed with underscore)
 */
export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Log the error details to console for debugging purposes
  console.error(err);

  // Extract status code from error or default to 500 (Internal Server Error)
  const status = err.status || 500;

  // Send standardized error response to client
  res.status(status).json({
    message: err.message || "Internal Server Error",
  });
}
