import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ChatbotModel from '../models/chatbot.model';
import { AsyncHandler } from '../utils/Asynchandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import logger from '../logger'; // Assuming logger is configured and available
import { IUser } from '../models/user.model';


const saveChatMessage = async (userId: string, prompt: string, response: string): Promise<void> => {
  try {
    const newChatMessage = new ChatbotModel({
      userId: new mongoose.Types.ObjectId(userId),
      prompt,
      response,
    });
    await newChatMessage.save();
    logger.info(`Chat message saved for userId: ${userId}`);
  } catch (error) {
    logger.error(`Error saving chat message for userId: ${userId}: ${error}`);
    // Not throwing error further as per requirement
  }
};

/**
 * Fetches the chat history for an authenticated user.
 */
const getChatHistory = AsyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as IUser)?._id; // Extract userId if available from auth middleware
  logger.info(`Fetching chat history for userId: ${userId}`);

  if (!userId) {
    throw new ApiError(401, 'User not authenticated');
  }

  const chatHistory = await ChatbotModel.find({ userId: new mongoose.Types.ObjectId(userId) })
    .sort({ timestamp: 1 }) // Sort by timestamp in ascending order
    .exec();

  return res
    .status(200)
    .json(new ApiResponse(200, chatHistory, 'Chat history fetched successfully'));
});

export { saveChatMessage, getChatHistory };
