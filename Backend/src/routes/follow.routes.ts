import { Router } from "express";
import { followUser, unfollowUser } from "../controllers/Follow/follow.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router()
router.use(verifyJWT)

router.route("/follow/:followingId").post(followUser)
router.route("/unfollow/:unfollowingId").post(unfollowUser)

export default router