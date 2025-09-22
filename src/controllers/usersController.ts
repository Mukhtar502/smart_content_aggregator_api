import { Request, Response } from "express";
import User from "../models/user";

/**
 * Creates a new user account in the system
 * Validates username uniqueness and sanitizes input data
 * @param req - Express request object containing username and interests
 * @param res - Express response object
 * @returns JSON response with user creation status and user details
 */
export async function createUser(req: Request, res: Response) {
  try {
    const { username, interests } = req.body;

    // validate required fields
    if (!username || username.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid username",
      });
    }

    // check if username already exists
    const exists = await User.findOne({ username: username.trim() });
    if (exists) {
      return res.status(409).json({
        success: false,
        message:
          "This username is already taken. Please choose a different one.",
      });
    }

    const user = await User.create({
      username: username.trim(),
      interests: Array.isArray(interests) ? interests : [],
    });

    const response = {
      success: true,
      message: "User created successfully! Welcome aboard!",
      user: {
        id: user._id,
        username: user.username,
        interests: user.interests,
        memberSince: new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message:
        "Something went wrong while creating your account. Please try again.",
    });
  }
}
