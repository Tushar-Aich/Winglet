import dotenv from 'dotenv';
// Assuming .env is in the Backend directory, which is the root for this script's execution context
dotenv.config({ path: './.env' }); // Explicitly point to .env in the current (Backend) directory

import { ingestTweets } from '../services/dataIngestionService';
import connectDB from '../db/MongoConnect'; // Corrected path
import logger from '../logger';

const run = async () => {
  logger.info('Starting MongoDB connection for ingestion script...');
  try {
    await connectDB(); // Ensure DB is connected before ingestion
    logger.info('MongoDB connected. Starting tweet ingestion...');
    await ingestTweets();
    logger.info('Tweet ingestion process finished.');
    // Optionally, you might want to close the MongoDB connection here if it's a standalone script
    // For example, if using mongoose: await mongoose.disconnect();
    process.exit(0); // Exit script after successful completion
  } catch (error) {
    logger.error('Error during ingestion script execution:', error);
    process.exit(1); // Exit with error code
  }
};

run().catch(error => {
  // This catch is a fallback, but errors within run() should be handled there.
  logger.error('Unhandled error running ingestion script:', error);
  process.exit(1);
});
