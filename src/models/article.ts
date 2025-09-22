import mongoose, { Document, Schema } from "mongoose";

/**
 * Article interface defining the structure of article documents in the database
 * Represents content pieces that users can interact with and receive as recommendations
 */
export interface Article extends Document {
  title: string; // The headline or title of the article
  content: string; // Full text content of the article
  author: string; // Name of the person who wrote the article
  summary?: string | null; // Optional brief description or excerpt
  tags?: string[]; // Optional array of topic tags for categorization and recommendations
  createdAt: Date; // Automatically managed timestamp for article creation
  updatedAt: Date; // Automatically managed timestamp for last article update
}

/**
 * MongoDB schema definition for Article collection
 * Enforces data validation and structure for article documents
 */
const ArticleSchema = new Schema<Article>(
  {
    title: { type: String, required: true }, // Article title is mandatory
    content: { type: String, required: true }, // Article content is mandatory
    author: { type: String, required: true }, // Author name is mandatory
    summary: { type: String, default: null }, // Optional summary field
    tags: { type: [String], default: [] }, // Optional tags array for categorization
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create database index on tags field to optimize recommendation queries
ArticleSchema.index({ tags: 1 });

// Export the Article model for use in controllers and other modules
export default mongoose.model<Article>("Article", ArticleSchema);
