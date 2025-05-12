import axios from "axios"

// Send notifications
const likeNotification = async (tweetId: string, senderId: string) => {
    const res = axios.post(`${import.meta.env.VITE_BACKEND_URL}/notifications/like`, { tweetId, senderId }, {withCredentials: true})
    return res
}

const commentNotification = async (tweetId: string, senderId: string, comment: string) => {
    const res = axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/notifications/comment`, 
        { tweetId, senderId, comment }, 
        { withCredentials: true }
    )
    return res
}

const followNotification = async (followedId: string, followerId: string) => {
    const res = axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/notifications/follow`, 
        { followedId, followerId }, 
        { withCredentials: true }
    )
    return res
}

// Get notifications
const getNotifications = async () => {
    const res = axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/notifications`,
        { withCredentials: true }
    )
    return res
}

const getUnreadCount = async () => {
    const res = axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/notifications/unread-count`,
        { withCredentials: true }
    )
    return res
}

const markAsRead = async (notificationIds?: string[]) => {
    const res = axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/notifications/mark-read`,
        { notificationIds },
        { withCredentials: true }
    )
    return res
}

export {
    likeNotification,
    commentNotification,
    followNotification,
    getNotifications,
    getUnreadCount,
    markAsRead
}