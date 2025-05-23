import { Router } from 'express';
import { getChatHistory } from '../controllers/chatbot.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = Router();

// Define the GET route for chat history
// This route first verifies the JWT, then calls the getChatHistory controller
router.route("/history").get(verifyJWT, getChatHistory);

export default router;
