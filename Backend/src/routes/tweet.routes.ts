import { Router } from "express";
import { createTweet, deleteTweet, getAllTweets, getUserTweets } from "../controllers/Tweets/tweet.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router()
router.use(verifyJWT)

router.route("/create").post(createTweet)
router.route("/:userId").get(getUserTweets)
router.route("/").get(getAllTweets)
router.route("/delete/:tweetId").delete(deleteTweet)

export default router