import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { 
    likeTweetNotification, 
    commentNotification, 
    followNotification, 
    getNotifications, 
    markNotificationsAsRead, 
    getUnreadCount 
} from "../controllers/Notification/notification.controller";


const router = Router()
router.use(verifyJWT)

// Notification creation endpoints
router.route("/like").post(likeTweetNotification)
router.route("/comment").post(commentNotification)
router.route("/follow").post(followNotification)

// Notification retrieval endpoints
router.route("/").get(getNotifications)
router.route("/mark-read").patch(markNotificationsAsRead)
router.route("/unread-count").get(getUnreadCount)

export default router