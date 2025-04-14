import { Request, Response } from "express";
import { AsyncHandler } from "../../utils/Asynchandler";
import { ApiError } from "../../utils/ApiError";
import { uploadOnCloudinary } from "../../lib/Cloudinary";
import TweetModel from "../../models/tweet.model";
import UserModel, { IUser } from "../../models/user.model";
import { ApiResponse } from "../../utils/ApiResponse";
import mongoose, { ObjectId } from "mongoose";


const createTweet = AsyncHandler(async(req:Request, res:Response) => {
    const {content} = req.body
    if(!content) throw new ApiError(400, "Content is required");
    const mentions: Array<string> = content.match(/(^|\W)@\b([-a-zA-Z0-9._]{3,25})\b/g) || []
    const users: Array<IUser> = []

    if(mentions.length !== 0) {
        await Promise.all(
            mentions.map(async (tags: string) => {
                const userName = tags.split('@')[1]
                const user = await UserModel.findOne(
                    {
                        $or: [{userName}]
                    }
                ).select("-password -refreshToken")
                if(!user) throw new ApiError(400, "Mention doesnot exist");
                users.push(user)
            })
        )
    }

    let mediaLocalPath;
    if (
        req.files &&
        !Array.isArray(req.files) &&
        "media" in req.files &&
        Array.isArray(req.files.media) &&
        req.files.media.length > 0
    ) {
      mediaLocalPath = req.files.media[0].path;
    }

    const media = mediaLocalPath
    ? await uploadOnCloudinary(mediaLocalPath)
    : undefined;

    const tweet = await TweetModel.create({
        content,
        owner: (req.user as IUser)._id,
        mentions: users,
        media: media ? media.secure_url : undefined,
    })
    res.status(200).json(new ApiResponse(200, tweet, "Tweet created sucessfully"));
})

const getAllTweets = AsyncHandler(async(req:Request, res: Response) => {
    const { page = 1, limit = 10, query, userId }  = req.query

    const pageNum = parseInt(page as string)  //page number
    const limitNum = parseInt(limit as string)  //number of tweets sent at once

    if(!Number.isInteger(pageNum) || !Number.isInteger(limitNum)) throw new ApiError(400, "Invalid queries passed");

    const skip = (pageNum - 1) * limitNum  //Number of tweets to be skipped

    const tweets = TweetModel.aggregate([
        {
            $match: {
                $or: [
                    {
                        title: {
                            $regex: query, // for finding videos according to the queries
                            $options: "i"  // formatching upper and lower case characters
                        },
                    },
                    {
                        owner: new mongoose.Types.ObjectId(userId as string)
                    },
                    {}
                ]
            }
        },
        {
            $project: {
                content: 1,
                User: 1,
                mentions: 1,
                createdAt: 1
            }
        }
    ])
    .skip(skip)
    .limit(limitNum)
    .sort("-1")

    if(!tweets) throw new ApiError(400, "No tweets found");

    return res
    .status(200)
    .json(
        new ApiResponse(200, tweets, "All tweets fetched successfully")
    )
})

const getMyTweets = AsyncHandler(async(req:Request, res:Response) => {
    const userId = (req.user as IUser)?._id
    const user = await UserModel.findById(userId)
    if(!user) throw new ApiError(404, "User not found");

    const Tweets = await TweetModel.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "User",
                pipeline: [
                    {
                        $project: {
                            avatar: 1,
                            userName: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                User: {
                    $first: "$User"
                }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                content: 1,
                User: 1,
                mentions: 1,
                createdAt: 1
            }
        }
    ])
    if(!Tweets) throw new ApiError(400, "Something went wrong while fetching all tweets");

    res.status(200).json(new ApiResponse(200, Tweets, "User Tweets fetched successfully"));
})

const getUserTweets = AsyncHandler(async(req:Request, res:Response) => {
    const {userId} = req.params
    const user = await UserModel.findById(userId)
    if(!user) throw new ApiError(404, "User not found");

    const Tweets = await TweetModel.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "User",
                pipeline: [
                    {
                        $project: {
                            avatar: 1,
                            userName: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                User: {
                    $first: "$User"
                }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                content: 1,
                User: 1,
                mentions: 1,
                createdAt: 1
            }
        }
    ])
    if(!Tweets) throw new ApiError(400, "Something went wrong while fetching all tweets");

    res.status(200).json(new ApiResponse(200, Tweets, "User Tweets fetched successfully"));
})

const deleteTweet = AsyncHandler(async(req: Request, res: Response) => {
    const {tweetId} = req.params
    if(!tweetId) throw new ApiError(400, "Tweet Id is required");

    const user = await UserModel.findById((req.user as IUser)._id)
    if(!user) throw new ApiError(404, "User not found");
    
    const tweet = await TweetModel.findById(tweetId);
    if(!tweet) throw new ApiError(404, "Tweet not found");

    if(tweet.owner !== user._id) throw new ApiError(400, "Only owner can delete the tweet");

    const deleteTweet = await TweetModel.findByIdAndDelete(tweetId)
    if(!deleteTweet) throw new ApiError(400, "Tweet deletion unsuccesful");

    res.status(200).json(new ApiResponse(200, {}, "Tweet deleted successfully"))

})

export {createTweet, getMyTweets, deleteTweet, getUserTweets, getAllTweets}