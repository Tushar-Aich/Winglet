import { Router } from "express";
import { sendMail } from "../controllers/user.controller.js";
import OTPrateLimit from '../middlewares/OTPrateLimit.middleware.js'

const router = Router()

router.route('/sendMail').post(OTPrateLimit, sendMail)

export default router;