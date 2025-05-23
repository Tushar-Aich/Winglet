import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { AddAudioForCloning } from "../controllers/Voice/voice.controller";
import { upload } from "../middlewares/multer.middleware";


const router = Router()
router.use(verifyJWT)

router.route('/clone').post(
    upload.fields([
        {
            name: 'voice',
            maxCount: 1
        }
    ]),
    AddAudioForCloning
)

export default router