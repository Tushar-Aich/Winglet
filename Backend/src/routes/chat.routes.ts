import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { getUsers } from "../controllers/Chat/chat.controller";

const router = Router()
router.use(verifyJWT)

router.route("/users").get(getUsers)

export default router