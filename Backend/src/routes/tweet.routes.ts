import { Router } from "express";
import { createTweet, deleteTweet, getAllTweets, getUserTweets, getTweetById, trendingTweets } from "../controllers/Tweets/tweet.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router()
router.use(verifyJWT)

router.route("/create").post(createTweet)
router.route("/:userId").get(getUserTweets)
router.route("/tweet/:tweetId").get(getTweetById)
router.route("/").get(getAllTweets)
router.route("/get/tweet/trending").get(trendingTweets)
router.route("/delete/:tweetId").delete(deleteTweet)

export default router