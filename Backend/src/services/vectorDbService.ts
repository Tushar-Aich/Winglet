import { ChromaClient, Collection } from "chromadb";
import logger from "../logger";

// Initialize ChromaClient
const client = new ChromaClient(); // Default constructor, connects to http://localhost:8000

/**
 * Retrieves an existing collection or creates a new one if it doesn't exist.
 * @param collectionName The name of the collection. Defaults to "tweets_collection".
 * @returns A promise that resolves to the Collection instance.
 */
async function getOrCreateTweetsCollection(
  collectionName: string = "tweets_collection"
): Promise<Collection> {
  try {
    logger.info(
      `Attempting to get or create collection: ${collectionName}`
    );
    const collection = await client.getOrCreateCollection({
      name: collectionName,
    });
    // Unfortunately, chromadb client doesn't directly tell us if it created or retrieved.
    // We might need to query the collection or list collections to infer this,
    // but for now, we'll just log success.
    logger.info(`Successfully got or created collection: ${collectionName}`);
    return collection;
  } catch (error) {
    logger.error(
      `Error getting or creating collection ${collectionName}:`,
      error
    );
    // Re-throw the error or handle it as per application requirements
    throw error;
  }
}

export { client, getOrCreateTweetsCollection };
