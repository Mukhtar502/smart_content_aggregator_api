import { Request, Response } from "express";
import Article from "../models/article";

/**
 * Creates a new article in the database
 * Validates required fields (title, content, author) before creation
 * @param req Express request object containing article data in body
 * @param res Express response object for sending back created article
 */
export async function createArticle(req: Request, res: Response) {
  // Extract article data from request body
  const { title, content, author, summary, tags } = req.body;

  // Validate that all required fields are provided
  if (!title || !content || !author) {
    return res.status(400).json({
      message:
        "title, content and author are required field and must be provided",
    });
  }

  // Create new article with provided data
  // Set summary to null if not provided, ensure tags is an array
  const article = await Article.create({
    title,
    content,
    author,
    summary: summary ?? null, // Use null if summary not provided
    tags: Array.isArray(tags) ? tags : [], // Ensure tags is always an array
  });

  // Return the newly created article with 201 status
  res.status(201).json(article);
}

/**
 * Retrieves a paginated list of all articles
 * Supports limit and offset query parameters for pagination
 * @param req Express request object with optional query parameters (limit, offset)
 * @param res Express response object for sending back articles list and pagination info
 */
export async function getAllArticles(req: Request, res: Response) {
  // Parse pagination parameters from query string
  // Limit: maximum 100 articles per request, default 10
  const limit = Math.min(Number(req.query.limit) || 10, 100);
  // Offset: number of articles to skip, default 0
  const offset = Number(req.query.offset) || 0;

  // Execute both queries in parallel for better performance
  // 1. Get articles with pagination and sort by newest first
  // 2. Get total count of all articles for pagination info
  const [items, total] = await Promise.all([
    Article.find()
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .skip(offset) // Skip articles for pagination
      .limit(limit) // Limit number of results
      .exec(),
    Article.countDocuments(), // Get total count for pagination
  ]);

  // Return articles with pagination metadata
  res.json({ items, total, limit, offset });
}

/**
 * Retrieves a single article by its unique MongoDB ID
 * Returns 404 if article is not found
 * @param req Express request object containing article ID in params
 * @param res Express response object for sending back the article or error
 */
export async function getArticlebyId(req: Request, res: Response) {
  // Extract article ID from URL parameters
  const { id } = req.params;

  // Search for article by MongoDB ObjectId
  const article = await Article.findById(id);

  // Return 404 error if article does not exist
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  // Return the found article
  res.json(article);
}
