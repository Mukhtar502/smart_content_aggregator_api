import mongoose, { Document, Schema } from "mongoose";

/**
 * Type definition for supported interaction types
 * Currently supports view and like interactions between users and articles
 */
export type InteractionType = "view" | "like";

/**
 * Interaction interface defining the structure of interaction documents in the database
 * Represents user engagement with articles (views, likes, etc.)
 */
export interface Interaction extends Document {
  user: mongoose.Types.ObjectId; // Reference to the User who made the interaction
  article: mongoose.Types.ObjectId; // Reference to the Article being interacted with
  interactionType: InteractionType; // Type of interaction (view, like, etc.)
  createdAt: Date; // Automatically managed timestamp for when interaction occurred
}

/**
 * MongoDB schema definition for Interaction collection
 * Enforces data validation and structure for interaction documents
 */
const InteractionSchema = new Schema<Interaction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Foreign key to User collection
    article: { type: Schema.Types.ObjectId, ref: "Article", required: true }, // Foreign key to Article collection
    interactionType: { type: String, enum: ["view", "like"], required: true }, // Must be one of the allowed types
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create database index on article field to optimize popularity aggregation queries
InteractionSchema.index({ article: 1 });

// Create compound index on user and article for efficient user history lookups
InteractionSchema.index({ user: 1, article: 1 }, { unique: false });

// Export the Interaction model for use in controllers and other modules
export default mongoose.model<Interaction>("Interaction", InteractionSchema);
