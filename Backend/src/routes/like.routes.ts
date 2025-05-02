import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { likeTweet, likeComment, dislikeTweet, dislikeComment, allLiked } from "../controllers/Likes/like.controller";

const router = Router()
router.use(verifyJWT)

router.route('/:tweetId').post(likeTweet)
router.route('/dislike/:tweetId').post(dislikeTweet)
router.route('/comment/:commentId').post(likeComment)
router.route('/comment/dislike/:commentId').post(dislikeComment)
router.route('/likedTweets').get(allLiked)

export default router