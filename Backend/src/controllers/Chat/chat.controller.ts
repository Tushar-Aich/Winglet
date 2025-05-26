import { Request, Response } from "express";
import { AsyncHandler } from "../../utils/Asynchandler";
import FollowModel from "../../models/follow.model";
import { IUser } from "../../models/user.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import MessageModel from "../../models/message.model";


const getUsers = AsyncHandler(async (req: Request, res: Response) => {

    const filteredUsers = await FollowModel.aggregate([
        {
            $match: {
                $or: [
                    { following: (req.user as IUser)?._id },
                    { follower: (req.user as IUser)?._id }
                ]
            }
        },
        {
            $project: {
                user: {
                    $cond: {
                        if: { $eq: ["$follower", (req.user as IUser)?._id] },
                        then: "$following",
                        else: "$follower"
                    }
                }
            }
        },
        {
            $group: {
                _id: "$user"
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $lookup: {
                from: 'messages',
                let: { otherUser: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $or: [
                                    {
                                        $and: [
                                            {$eq: ["$sender", (req.user as IUser)?._id]},
                                            {$eq: ["$receipent", "$$otherUser"]}
                                        ]
                                    },
                                    {
                                        $and: [
                                            {$eq: ["$receipent", (req.user as IUser)?._id]},
                                            {$eq: ["$sender", "$$otherUser"]}
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    {$sort: {createdAt: -1}},
                    {$limit: 1}
                ],
                as: 'lastmessage'
            }
        },
        {
            $lookup: {
                from: 'messages',
                let: {otherUser: "$_id"},
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {$eq: ["$sender", "$$otherUser"]},
                                    {$eq: ["$receipent", (req.user as IUser)?._id]},
                                    {$eq: ["$read", false]}
                                ]
                            }
                        }
                    },
                    {$count: "unreadCount"}
                ],
                as: "unreadInfo"
            }
        },
        {
            $addFields: {
                lastMessageAt: {
                    $ifNull: [{ $arrayElemAt: ["$lastmessage.createdAt", 0]}, new Date(0)]
                },
                lastMessage: {
                    $cond: {
                        if: {$gt: [{$size: "$lastmessage"}, 0]},
                        then: {$first: "$lastmessage"},
                        else: null
                    }
                },
                unreadCount: {
                    $ifNull: [{$arrayElemAt: ["$unreadInfo.unreadCount", 0]}, 0]
                }
            }
        },
        {
            $project: {
                _id: "$user._id",
                name: "$user.OGName",
                avatar: "$user.avatar",
                lastMessage: {
                    text: "$lastmessage.text",
                    sender: "$lastmessage.sender"
                },
                unreadCount: 1,
                lastMessageAt: 1
            }
        },
        {
            $sort: {
                lastMessageAt: -1
            }
        }
    ])

    if(!filteredUsers) throw new ApiError(400, "User fetching unsuccessful");

    return res.status(200).json(new ApiResponse(200, filteredUsers, "Users fetched successfully for sidebar"))
})

export { getUsers }