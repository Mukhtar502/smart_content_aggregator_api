import express from "express";
import route from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

/**
 * Express application setup and configuration
 * Configures middleware, routes, and error handling for the content aggregator API
 */
const app = express();

// Parse incoming JSON requests and make data available in req.body
app.use(express.json());

// Mount all API routes under /api prefix (e.g., /api/articles, /api/users)
app.use("/api", route);

// Health check endpoint for monitoring and load balancer status checks
app.get("/health", (_, res) => res.json({ ok: true }));

// Global error handling middleware (must be registered last)
app.use(errorHandler);

// Export the configured Express application for use in server startup
export default app;
