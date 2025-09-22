import mongoose from "mongoose";

/**
 * Establishes connection to MongoDB database using Mongoose ODM
 * Handles database connection setup for the content aggregator application
 * @param uri - MongoDB connection string (e.g., mongodb://localhost:27017/dbname)
 * @throws Will throw an error if connection fails
 */
export async function connectDB(uri: string) {
  // Attempt to connect to MongoDB using the provided connection URI
  await mongoose.connect(uri);

  // Log successful connection for debugging and monitoring purposes
  console.log("Successfully connected to database");
}
