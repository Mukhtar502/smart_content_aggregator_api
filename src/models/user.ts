import mongoose, { Document, Schema } from "mongoose";

/**
 * User interface defining the structure of user documents in the database
 * Represents system users who can interact with articles and receive recommendations
 */
export interface User extends Document {
  username: string; // Unique identifier for the user account
  interests: string[]; // Array of topics the user is interested in (used for recommendations)
  createdAt: Date; // Automatically managed timestamp for account creation
  updatedAt: Date; // Automatically managed timestamp for last profile update
}

/**
 * MongoDB schema definition for User collection
 * Enforces data validation and structure for user documents
 */
const UserSchema = new Schema<User>(
  {
    username: { type: String, required: true, unique: true }, // Must be unique across all users
    interests: { type: [String], default: [] }, // Optional array of interest topics
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Export the User model for use in controllers and other modules
export default mongoose.model<User>("User", UserSchema);
