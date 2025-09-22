import { Router } from "express";

// Import controller functions for handling API endpoints
import {
  createArticle,
  getAllArticles,
  getArticlebyId,
} from "../controllers/articlesController";
import { createUser } from "../controllers/usersController";
import { createInteraction } from "../controllers/interactionsController";
import { getRecommendations } from "../controllers/recommendationsController";

// Create Express router instance for organizing API routes
const router = Router();

/**
 * Article management endpoints
 * Handles creation, retrieval, and listing of articles
 */
router.post("/articles", createArticle); // Create new article
router.get("/articles", getAllArticles); // Get paginated list of all articles
router.get("/articles/:id", getArticlebyId); // Get specific article by ID

/**
 * User management endpoints
 * Handles user account creation and management
 */
router.post("/users", createUser); // Create new user account

/**
 * User interaction endpoints
 * Handles recording of user interactions with articles
 */
router.post("/interactions", createInteraction); // Record user interaction with article

/**
 * Recommendation system endpoints
 * Provides personalized article recommendations based on user preferences
 */
router.get("/recommendations/:user_id", getRecommendations); // Get recommendations for specific user

// Export the configured router for use in the main application
export default router;
