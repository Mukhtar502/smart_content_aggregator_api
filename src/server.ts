import "dotenv/config"; // Load environment variables from .env file
import app from "./app";
import { connectDB } from "./db";

/**
 * Server startup configuration and initialization
 * Handles database connection and HTTP server startup for the content aggregator API
 */

// Server port configuration (defaults to 8005 if not specified in environment)
const PORT = process.env.PORT || 8005;

/**
 * Initializes and starts the server with database connection
 * Validates required environment variables before startup
 */
async function startServer() {
  // Validate that MongoDB connection URI is provided
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is required in environment variables");
    process.exit(1);
  }

  // Establish database connection before starting HTTP server
  await connectDB(process.env.MONGO_URI);

  // Start HTTP server on specified port
  app.listen(PORT, () => {
    console.log(`Server is running successfully on: http://localhost:${PORT}`);
  });
}

// Start the server and handle any startup errors gracefully
startServer().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});
