import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/Asynchandler'; // Adjusted path
import { ApiError } from '../../utils/ApiError'; // Adjusted path
import { ApiResponse } from '../../utils/ApiResponse'; // Adjusted path
import { generateTweetResponse } from '../../services/aiService';
import logger from '../../logger'; // Adjusted path
import { saveChatMessage } from '../chatbot.controller'; // Import saveChatMessage

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string; // Assuming user object has _id
  };
}

const handleGenerateTweet = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { prompt } = req.body;
  const userId = req.user?._id; // Extract userId if available from auth middleware

  logger.info(`Received request for tweet generation. Prompt: "${prompt}", UserId: ${userId || 'N/A'}`);

  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    throw new ApiError(400, 'Prompt is required and must be a non-empty string.');
  }

  const generatedTweet = await generateTweetResponse(prompt.trim(), userId);

  if (!generatedTweet) {
    throw new ApiError(500, 'Failed to generate tweet content at this time. Please try again later.');
  }

  if (userId && generatedTweet) {
    try {
      await saveChatMessage(userId, prompt.trim(), generatedTweet);
      logger.info(`Chat history saved successfully for userId: ${userId} in handleGenerateTweet`);
    } catch (error) {
      // Log the error, but don't let it interrupt the response to the user
      logger.error(`Failed to save chat history for userId: ${userId} in handleGenerateTweet`, error);
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { tweet: generatedTweet }, 'Tweet generated successfully.'));
});

export { handleGenerateTweet };
