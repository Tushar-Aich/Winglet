import dotenv from 'dotenv';

dotenv.config();

import { ingestTweets } from '../services/dataIngestionService';
import logger from '../logger';

const run = async () => {
  logger.info('Starting MongoDB connection for ingestion script...');
  try {
    await ingestTweets();
    logger.info('Tweet ingestion process finished.');
    process.exit(0);
  } catch (error) {
    logger.error('Error during ingestion script execution:', error);
    process.exit(1);
  }
};

run().catch(error => {
  logger.error('Unhandled error running ingestion script:', error);
  process.exit(1);
});
