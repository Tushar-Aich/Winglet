import { Router } from "express";
import { sendMail, verifyOTP } from "../controllers/user.controller.js";
import OTPrateLimit from '../middlewares/OTPrateLimit.middleware.js'

const router = Router()

router.route('/sendMail').post(OTPrateLimit, sendMail)
router.route('/verifyOTP').post(OTPrateLimit, verifyOTP)

export default router;