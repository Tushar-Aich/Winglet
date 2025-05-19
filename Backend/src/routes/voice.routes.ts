import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { AddAudioForCloning } from "../controllers/Voice/voice.controller";


const router = Router()
router.use(verifyJWT)

router.route('/clone').post(AddAudioForCloning)

export default router