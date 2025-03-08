import { Router } from "express";
import { sendMail, signUp, verifyOTP, login, refreshAccessToken } from "../controllers/user.controller.js";
import OTPrateLimit from '../middlewares/OTPrateLimit.middleware.js'
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route('/sendMail').post(OTPrateLimit, sendMail)
router.route('/verifyOTP').post(OTPrateLimit, verifyOTP)
router.route('/signUp').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    signUp
)
router.route('/login').post(login)
router.route('/refresh-token').post(refreshAccessToken)

export default router;