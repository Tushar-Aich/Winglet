import { Request, Response } from "express";
import { AsyncHandler } from "../../utils/Asynchandler";
import TweetModel from "../../models/tweet.model";
import { ApiError } from "../../utils/ApiError";
import UserModel, { IUser } from "../../models/user.model";
import NotificationModel from "../../models/notification.model";
import admin from "../../lib/firebaseAdmin";
import { ApiResponse } from "../../utils/ApiResponse";
import mongoose from "mongoose";



const likeTweetNotification = AsyncHandler(async (req: Request, res: Response) => {
    const { tweetId, senderId } = req.body

    console.log(tweetId, senderId)

    const tweet = await TweetModel.findById(tweetId)
    if(!tweet) throw new ApiError(404, "Tweet not found");

    const receipent = await UserModel.findById(tweet.owner)
    if(!receipent) throw new ApiError(404, "Receiver not found");

    const sender = await UserModel.findById(senderId)
    if(!sender) throw new ApiError(404, "Sender not found");

    const content = `${sender.userName} liked your post`

    const newNotification = await NotificationModel.create({
        sender: sender._id,
        receipent: receipent._id,
        type: 'like',
        tweet: tweet._id,
        content: content,
    })

    if(receipent.FCMtoken) {
        console.log("Hi")
        await admin.messaging().send({
            token: receipent.FCMtoken as string,
            notification: {
                title: "New Like",
                body: content
            },
            webpush: {
                notification: {
                    icon: "../../../public/Transparent-logo.jpg",
                    click_action: `${process.env.FRONTEND_URL}/home/tweets/${tweet._id}`
                }
            }
        })
    }

    return res.status(200).json(new ApiResponse(200, newNotification, "Notification created successsfully"));
})

// Add notification for comments on tweets
const commentNotification = AsyncHandler(async (req: Request, res: Response) => {
    const { tweetId, senderId, comment } = req.body

    const tweet = await TweetModel.findById(tweetId)
    if(!tweet) throw new ApiError(404, "Tweet not found");

    const receipent = await UserModel.findById(tweet.owner)
    if(!receipent) throw new ApiError(404, "Receiver not found");

    const sender = await UserModel.findById(senderId)
    if(!sender) throw new ApiError(404, "Sender not found");

    // Don't notify if the sender is the same as the receiver
    if(sender._id.toString() === receipent._id.toString()) {
        return res.status(200).json(new ApiResponse(200, {}, "Self-action, no notification needed"));
    }

    const content = `${sender.userName} commented on your post: "${comment.substring(0, 30)}${comment.length > 30 ? '...' : ''}"`

    const newNotification = await NotificationModel.create({
        sender: sender._id,
        receipent: receipent._id,
        type: 'reply',
        tweet: tweet._id,
        content: content,
    })

    if(receipent.FCMtoken) {
        try {
            await admin.messaging().send({
                token: receipent.FCMtoken as string,
                notification: {
                    title: "New Comment",
                    body: content
                },
                webpush: {
                    notification: {
                        icon: "../../../public/Transparent-logo.jpg",
                        click_action: `${process.env.FRONTEND_URL}/home/tweets/${tweet._id}`
                    }
                }
            })
        } catch (error) {
            console.error("Error sending push notification:", error);
            // Continue execution even if push notification fails
        }
    }

    return res.status(200).json(new ApiResponse(200, newNotification, "Notification created successfully"));
})

// Add notification for follows
const followNotification = AsyncHandler(async (req: Request, res: Response) => {
    const { followedId, followerId } = req.body

    const receipent = await UserModel.findById(followedId)
    if(!receipent) throw new ApiError(404, "Receiver not found");

    const sender = await UserModel.findById(followerId)
    if(!sender) throw new ApiError(404, "Sender not found");

    // Don't notify if the sender is the same as the receiver
    if(sender._id.toString() === receipent._id.toString()) {
        return res.status(200).json(new ApiResponse(200, {}, "Self-action, no notification needed"));
    }

    const content = `${sender.userName} started following you`

    const newNotification = await NotificationModel.create({
        sender: sender._id,
        receipent: receipent._id,
        type: 'follow',
        content: content,
    })

    if(receipent.FCMtoken) {
        try {
            await admin.messaging().send({
                token: receipent.FCMtoken as string,
                notification: {
                    title: "New Follower",
                    body: content
                },
                webpush: {
                    notification: {
                        icon: "../../../public/Transparent-logo.jpg",
                        click_action: `${process.env.FRONTEND_URL}/home/profile/${sender._id}`
                    }
                }
            })
        } catch (error) {
            console.error("Error sending push notification:", error);
            // Continue execution even if push notification fails
        }
    }

    return res.status(200).json(new ApiResponse(200, newNotification, "Notification created successfully"));
})

// Get all notifications for the logged-in user
const getNotifications = AsyncHandler(async (req: Request, res: Response) => {
    const userId = (req.user as IUser)._id;
    
    const notifications = await NotificationModel.find({ receipent: userId })
        .sort({ createdAt: -1 })
        .populate("sender", "userName OGName avatar")
        .populate("tweet")
        .limit(50);
    
    return res.status(200).json(new ApiResponse(200, notifications, "Notifications fetched successfully"));
})

// Mark notifications as read
const markNotificationsAsRead = AsyncHandler(async (req: Request, res: Response) => {
    const userId = (req.user as IUser)._id;
    const { notificationIds } = req.body;
    
    let filter: { receipent: mongoose.Types.ObjectId; _id?: { $in: mongoose.Types.ObjectId[] } } = { receipent: userId };
    
    // If specific notification IDs are provided, only mark those as read
    if (notificationIds && notificationIds.length > 0) {
        filter = { 
            ...filter, 
            _id: { $in: notificationIds.map((id: string) => new mongoose.Types.ObjectId(id)) }
        };
    }
    
    const result = await NotificationModel.updateMany(
        filter,
        { $set: { isRead: true } }
    );
    
    return res.status(200).json(
        new ApiResponse(
            200, 
            { modifiedCount: result.modifiedCount }, 
            "Notifications marked as read"
        )
    );
})

// Get unread notification count
const getUnreadCount = AsyncHandler(async (req: Request, res: Response) => {
    const userId = (req.user as IUser)._id;
    
    const count = await NotificationModel.countDocuments({ 
        receipent: userId,
        isRead: false
    });
    
    return res.status(200).json(
        new ApiResponse(200, { count }, "Unread notification count fetched")
    );
})

export {
    likeTweetNotification,
    commentNotification,
    followNotification,
    getNotifications,
    markNotificationsAsRead,
    getUnreadCount
}