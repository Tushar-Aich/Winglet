import { getOrCreateTweetsCollection } from "./vectorDbService";
import TweetModel, { ITweet } from "../models/tweet.model"; // Corrected import name to TweetModel
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import process from "process";
import logger from "../logger";
import dotenv from 'dotenv';

// Load environment variables from .env file in the Backend directory
dotenv.config();

// Initialize Embeddings Model
const geminiEmbeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: "embedding-001",
});

const BATCH_SIZE = 100;

/**
 * Ingests tweet data from MongoDB into ChromaDB with their embeddings.
 */
async function ingestTweets(): Promise<void> {
  logger.info("Starting tweet ingestion process...");

  try {
    const tweetCollection = await getOrCreateTweetsCollection(
      "tweets_collection"
    );
    logger.info("Successfully connected to ChromaDB collection 'tweets_collection'.");

    const allTweets: ITweet[] = await TweetModel.find({}).lean();

    if (!allTweets || allTweets.length === 0) {
      logger.info("No tweets found in MongoDB. Ingestion process stopped.");
      return;
    }

    logger.info(`Found ${allTweets.length} tweets to process.`);

    let totalProcessedCount = 0;
    for (let i = 0; i < allTweets.length; i += BATCH_SIZE) {
      const batch = allTweets.slice(i, i + BATCH_SIZE);
      logger.info(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(allTweets.length / BATCH_SIZE)}, containing ${batch.length} tweets.`);

      const ids: string[] = [];
      const embeddingsArray: number[][] = [];
      const metadatas: any[] = []; // Consider defining a stricter type for metadata
      const documents: string[] = [];

      for (const tweet of batch) {
        const tweetText = tweet.content;

        if (!tweetText || typeof tweetText !== 'string' || tweetText.trim() === "") {
          logger.warn(`Skipping tweet with ID ${tweet._id} due to empty or invalid content.`);
          continue;
        }

        try {
          const embedding = await geminiEmbeddings.embedQuery(tweetText as string); // Cast to string
          ids.push(tweet._id.toString());
          embeddingsArray.push(embedding);
          metadatas.push({
            tweetId: tweet._id.toString(),
            userId: tweet.owner?.toString(), // 'owner' field from the model
            createdAt: tweet.createdAt?.toISOString(), // 'createdAt' from timestamps
          });
          documents.push(tweetText as string); // Cast to string
        } catch (embeddingError) {
          logger.error(
            `Error generating embedding for tweet ID ${tweet._id}:`,
            embeddingError
          );
          // Optionally skip this tweet or handle error differently
        }
      }

      if (ids.length > 0) {
        try {
          await tweetCollection.add({
            ids,
            embeddings: embeddingsArray,
            metadatas,
            documents,
          });
          totalProcessedCount += ids.length;
          logger.info(`Successfully ingested batch ${Math.floor(i / BATCH_SIZE) + 1}. Total processed: ${totalProcessedCount}`);
        } catch (chromaError) {
          logger.error(
            `Error adding batch to ChromaDB (Batch ${Math.floor(i / BATCH_SIZE) + 1}):`,
            chromaError
          );
          // Optionally, decide if the entire process should halt or continue with next batch
        }
      } else {
        logger.info(`Batch ${Math.floor(i / BATCH_SIZE) + 1} had no valid tweets to process.`);
      }
    }

    logger.info(
      `Tweet ingestion process completed. Total tweets processed: ${totalProcessedCount} out of ${allTweets.length}.`
    );
  } catch (error) {
    logger.error("An error occurred during the tweet ingestion process:", error);
    // Re-throw or handle as per application requirements
    throw error;
  }
}

export { ingestTweets };
