import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user";
import Article from "../models/article";
import Interaction from "../models/interaction";

/**
 * Generates personalized article recommendations for a user using rule-based logic
 * Prioritizes articles matching user interests, then popular articles as fallback
 * Excludes articles the user has already interacted with
 * @param req - Express request object containing user_id parameter
 * @param res - Express response object
 * @returns JSON response with personalized recommendations and metadata
 */
export async function getRecommendations(req: Request, res: Response) {
  try {
    const userId = req.params.user_id;

    // check if user id is provided
    if (!userId || userId.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid user ID",
      });
    }

    // check if user id format is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "The user ID format is not valid. Please check and try again.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "We could not find a user with that ID. Please check the ID and try again.",
      });
    }

    // Get list of articles the user has already interacted with to exclude them
    const viewedArticles = await Interaction.find({ user: userId }).distinct(
      "article"
    );
    const viewedSet = new Set(viewedArticles.map((id) => id.toString()));

    const recommendations = [];

    // Strategy 1: Find articles that match the user's declared interests
    if (user.interests && user.interests.length > 0) {
      const matchingArticles = await Article.find({
        tags: { $in: user.interests },
        _id: { $nin: viewedArticles },
      })
        .sort({ createdAt: -1 })
        .limit(10);
      for (const article of matchingArticles) {
        recommendations.push({
          ...article.toObject(),
          reason: "matches your interests",
        });
      }
    }

    // Strategy 2: If we do not have enough interest-based recommendations, add popular articles
    if (recommendations.length < 10) {
      // Aggregate interaction counts to find most popular articles
      const popularArticles = await Interaction.aggregate([
        { $group: { _id: "$article", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 },
      ]);

      // Filter out articles the user has already seen
      const popularIds = popularArticles
        .map((item) => item._id)
        .filter((id) => !viewedSet.has(id.toString()));

      // Remove articles already added to recommendations to avoid duplicates
      const existingIds = new Set(
        recommendations.map((rec) => (rec as any)._id.toString())
      );
      const neededIds = popularIds
        .filter((id) => !existingIds.has(id.toString()))
        .slice(0, 10 - recommendations.length);

      if (neededIds.length > 0) {
        const articles = await Article.find({ _id: { $in: neededIds } });

        for (const article of articles) {
          recommendations.push({
            ...article.toObject(),
            reason: "popular with other users",
          });
        }
      }
    }

    // Format recommendations with user-friendly data and readable dates
    const formattedRecommendations = recommendations
      .slice(0, 10)
      .map((rec: any) => ({
        id: rec._id,
        title: rec.title,
        author: rec.author,
        summary: rec.summary,
        tags: rec.tags,
        publishedAt: new Date(rec.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        reason: rec.reason,
      }));

    const response = {
      success: true,
      message:
        formattedRecommendations.length > 0
          ? `Found ${formattedRecommendations.length} recommendations for you!`
          : "No recommendations available right now. Try adding more interests or check back later.",
      user: {
        username: user.username,
        interests: user.interests,
      },
      recommendations: formattedRecommendations,
      total: formattedRecommendations.length,
    };

    res.json(response);
  } catch (error) {
    console.error("Error getting recommendations:", error);
    res.status(500).json({
      success: false,
      message:
        "Something went wrong while getting your recommendations. Please try again later.",
    });
  }
}
