import { Router } from "express";
import { createTweet, deleteTweet, getAllTweets, getUserTweets, getTweetById, trendingTweets } from "../controllers/Tweets/tweet.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const router = Router()
router.use(verifyJWT)

router.route("/create").post(
    upload.fields([
        {
            name: "media",
            maxCount: 1
        }
    ]),
    createTweet
)
router.route("/:userId").get(getUserTweets)
router.route("/tweet/:tweetId").get(getTweetById)
router.route("/").get(getAllTweets)
router.route("/get/tweet/trending").get(trendingTweets)
router.route("/delete/:tweetId").delete(deleteTweet)

export default router