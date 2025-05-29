import { Request, Response } from "express";
import { AsyncHandler } from "../../utils/Asynchandler";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import MessageModel from "../../models/message.model";
import { IUser } from "../../models/user.model";
import mongoose from "mongoose";

// Send a message (HTTP fallback for socket)
const sendMessage = AsyncHandler(async (req: Request, res: Response) => {
    const { recipientId, content, images } = req.body;
    const sender = (req.user as IUser)?._id;
    
    if (!recipientId || !sender) {
        throw new ApiError(400, "Recipient ID and sender ID are required");
    }
    
    const message = await MessageModel.create({
        content: content || "",
        images: images || "",
        sender,
        receipent: new mongoose.Types.ObjectId(recipientId),
        read: false
    });
    
    // Get the created message with sender and recipient populated
    const populatedMessage = await MessageModel.findById(message._id);
    
    return res.status(201).json(
        new ApiResponse(201, populatedMessage, "Message sent successfully")
    );
});

export { sendMessage };
