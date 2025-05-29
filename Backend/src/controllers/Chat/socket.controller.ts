import { Request, Response } from "express";
import { AsyncHandler } from "../../utils/Asynchandler";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import MessageModel from "../../models/message.model";
import { IUser } from "../../models/user.model";
import mongoose from "mongoose";

// Mark all messages between two users as read
const markMessagesAsRead = AsyncHandler(async (req: Request, res: Response) => {
    const { senderId } = req.params;
    const recipientId = (req.user as IUser)?._id;
    
    if (!senderId || !recipientId) {
        throw new ApiError(400, "Sender ID is required");
    }
    
    const result = await MessageModel.updateMany(
        {
            sender: new mongoose.Types.ObjectId(senderId),
            receipent: recipientId,
            read: false
        },
        {
            read: true
        }
    );
    
    return res.status(200).json(
        new ApiResponse(
            200, 
            { modifiedCount: result.modifiedCount },
            "Messages marked as read"
        )
    );
});

// Delete a message (for the user only, not from the database)
const deleteMessage = AsyncHandler(async (req: Request, res: Response) => {
    const { messageId } = req.params;
    const userId = (req.user as IUser)?._id;
    
    if (!messageId) {
        throw new ApiError(400, "Message ID is required");
    }
    
    const message = await MessageModel.findById(messageId);
    
    if (!message) {
        throw new ApiError(404, "Message not found");
    }
    
    // Check if user is the sender of the message
    if (message.sender.toString() !== userId.toString()) {
        throw new ApiError(403, "You don't have permission to delete this message");
    }
    
    await MessageModel.findByIdAndDelete(messageId);
    
    return res.status(200).json(
        new ApiResponse(200, {}, "Message deleted successfully")
    );
});

// Get unread message counts for a user
const getUnreadCounts = AsyncHandler(async (req: Request, res: Response) => {
    const userId = (req.user as IUser)?._id;
    
    const unreadCounts = await MessageModel.aggregate([
        {
            $match: {
                receipent: userId,
                read: false
            }
        },
        {
            $group: {
                _id: "$sender",
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                sender: "$_id",
                count: 1
            }
        }
    ]);
    
    return res.status(200).json(
        new ApiResponse(200, unreadCounts, "Unread counts fetched successfully")
    );
});

export { markMessagesAsRead, deleteMessage, getUnreadCounts };
