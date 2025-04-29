import { Router } from "express";
import {comment, allCommentsOnAPost, deleteComment, updateComment} from "../controllers/Comments/comment.controller"
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router()
router.use(verifyJWT)

router.route("/post").post(comment)
router.route("/get").get(allCommentsOnAPost)
router.route("/delete").delete(deleteComment)

export default router