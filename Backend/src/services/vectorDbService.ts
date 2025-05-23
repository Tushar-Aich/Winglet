import { ChromaClient, Collection } from "chromadb";
import logger from "../logger";

// Initialize ChromaClient
const client = new ChromaClient();

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
