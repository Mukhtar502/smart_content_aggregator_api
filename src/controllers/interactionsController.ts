import { Request, Response } from "express";
import Interaction from "../models/interaction";
import User from "../models/user";
import Article from "../models/article";

/**
 * Creates a new user interaction with an article (like, share, comment, etc.)
 * Validates that both user and article exist before recording interaction
 * @param req - Express request object containing user_id, article_id, and interaction_type
 * @param res - Express response object
 * @returns JSON response with interaction creation status and details
 */
export async function createInteraction(req: Request, res: Response) {
  try {
    // Extract interaction data from request body
    const { user_id, article_id, interaction_type } = req.body;

    // Validate that all required fields are provided
    if (!user_id || !article_id || !interaction_type) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide user ID, article ID, and interaction type. All fields are required.",
      });
    }

    // Verify that the user and article exist in the database
    const user = await User.findById(user_id);
    const article = await Article.findById(article_id);

    if (!user || !article) {
      return res.status(404).json({
        success: false,
        message:
          "The specified user or article was not found. Please check your IDs.",
      });
    }

    // Create the interaction record
    const interaction = await Interaction.create({
      user: user._id,
      article: article._id,
      interactionType: interaction_type,
    });

    // Return successful response with interaction details
    const response = {
      success: true,
      message: "Interaction recorded successfully!",
      interaction: {
        id: interaction._id,
        user: user.username,
        article: article.title,
        type: interaction.interactionType,
        timestamp: new Date(interaction.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating interaction:", error);
    res.status(500).json({
      success: false,
      message:
        "Something went wrong while recording your interaction. Please try again.",
    });
  }
}
