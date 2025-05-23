import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/Asynchandler'; // Adjusted path
import { ApiError } from '../../utils/ApiError'; // Adjusted path
import { ApiResponse } from '../../utils/ApiResponse'; // Adjusted path
import { generateTweetResponse } from '../../services/aiService';
import logger from '../../logger'; // Adjusted path

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

  return res
    .status(200)
    .json(new ApiResponse(200, { tweet: generatedTweet }, 'Tweet generated successfully.'));
});

export { handleGenerateTweet };
