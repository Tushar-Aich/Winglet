import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { getOrCreateTweetsCollection } from "./vectorDbService";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import process from "process";
import logger from "../logger";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize Models
const geminiEmbeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: "embedding-001",
});

const chatModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.0-flash",
  temperature: 0.7,
});

/**
 * Generates a tweet response based on user prompt and context from ChromaDB.
 * @param userPrompt The user's input prompt.
 * @param userId Optional ID of the user making the request.
 * @returns A promise that resolves to the generated tweet string or null if an error occurs.
 */
async function generateTweetResponse(
  userPrompt: string,
  userId?: string
): Promise<string | null> {
  logger.info(
    `Generating tweet response for prompt: "${userPrompt}"${
      userId ? ` by user ID: ${userId}` : ""
    }`
  );

  try {
    // Retrieve Context from ChromaDB
    logger.info("Fetching tweets collection from ChromaDB...");
    const tweetCollection = await getOrCreateTweetsCollection(
      "tweets_collection"
    );
    logger.info("Successfully fetched tweets collection.");

    logger.info("Generating embedding for user prompt...");
    const queryEmbedding = await geminiEmbeddings.embedQuery(userPrompt);
    logger.info("Successfully generated prompt embedding.");

    logger.info("Querying ChromaDB for relevant documents...");
    const results = await tweetCollection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 2,
    });

    const numResults = results.documents && results.documents[0] ? results.documents[0].length : 0;
    logger.info(`Found ${numResults} relevant documents in ChromaDB.`);

    // Format Context for Prompt
    const contextDocs =
      results.documents && results.documents[0]
        ? results.documents[0].filter((doc): doc is string => doc !== null && doc !== undefined) // Type guard
        : [];
    
    let contextText = "No relevant tweet context found from the database.";
    if (contextDocs.length > 0) {
      contextText = contextDocs.join("\n---\n");
    }
    logger.info(`Prepared context text: "${contextText}"`);

    // Construct Prompt for Gemini
    const systemMessageContent =
      "You are a helpful AI assistant. Your task is to generate a concise and engaging tweet. Use the provided 'Context Tweets' to inform your response to the 'User's Request'. If the context is not relevant, use your general knowledge. The tweet should be suitable for a platform like Twitter/X.";
    
    const messages = [
      new SystemMessage(systemMessageContent),
      new HumanMessage(
        `Context Tweets:\n${contextText}\n\nUser's Request: ${userPrompt}`
      ),
    ];
    logger.info("Constructed messages for Gemini model.");

    // Call Gemini Model
    logger.info("Sending request to Gemini model...");
    const response = await chatModel.invoke(messages);
    
    // Ensure content is a string
    const generatedContent = typeof response.content === 'string' 
      ? response.content 
      : JSON.stringify(response.content);

    logger.info(`Received response from Gemini: "${generatedContent}"`);
    return generatedContent;

  } catch (error) {
    logger.error("Error generating tweet response:", error);
    return null; 
  }
}

export { generateTweetResponse };
