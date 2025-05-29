import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { getMessages, getUsers } from "../controllers/Chat/chat.controller";
import { markMessagesAsRead, deleteMessage, getUnreadCounts } from "../controllers/Chat/socket.controller";
import { sendMessage } from "../controllers/Chat/message.controller";

const router = Router()
router.use(verifyJWT)

router.route("/users").get(getUsers)
router.route("/messages").get(getMessages)
router.route("/messages").post(sendMessage)
router.route("/messages/read/:senderId").patch(markMessagesAsRead)
router.route("/messages/:messageId").delete(deleteMessage)
router.route("/messages/unread").get(getUnreadCounts)

export default router