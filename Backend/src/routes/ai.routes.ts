import { Router } from 'express';
import { handleGenerateTweet } from '../controllers/ai/chatbot.controller'; // Adjusted path
import { verifyJWT } from '../middlewares/auth.middleware'; // Adjusted path

const router = Router();

// Secure the endpoint using JWT authentication
router.route('/generate-tweet').post(verifyJWT, handleGenerateTweet);

export default router; // Export as default
