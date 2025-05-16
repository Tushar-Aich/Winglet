import mongoose from "mongoose"
import CommentModel from "../../models/comment.model"
import LikeModel from "../../models/like.model"
import TweetModel from "../../models/tweet.model"
import UserModel, { IUser } from "../../models/user.model"
import { ApiError } from "../../utils/ApiError"
import { ApiResponse } from "../../utils/ApiResponse"
import { AsyncHandler } from "../../utils/Asynchandler"
import { Request, Response } from 'express'

const likeTweet = AsyncHandler(async (req:Request, res: Response) => {
    const { tweetId } = req.params
    const userId = (req.user as IUser)?._id

    const user = await UserModel.findById(userId).select("-password -refreshToken")
    if(!user) throw new ApiError(404, "User not found");

    const tweet = await TweetModel.findById(tweetId)
    if(!tweet) throw new ApiError(404, "Tweet not found");

    const alreadyLiked = await LikeModel.findOne({
        user: userId,
        tweet: tweetId
    })
    if(alreadyLiked) throw new ApiError(400, "Tweet already liked");

    const newLike = await LikeModel.create({
        user: userId,
        tweet: tweetId
    })
    if(!newLike) throw new ApiError(400, "Something went wrong");
    res.status(200).json(new ApiResponse(200, newLike, "Tweet liked successfully"));
})

const dislikeTweet = AsyncHandler(async(req: Request, res: Response) => {
    const { tweetId } = req.params
    const userId = (req.user as IUser)?._id

    const user = await UserModel.findById(userId).select("-password -refreshToken")
    if(!user) throw new ApiError(404, "User not found");

    const tweet = await TweetModel.findById(tweetId)
    if(!tweet) throw new ApiError(404, "Tweet not found");

    const alreadyLiked = await LikeModel.findOne({
        user: userId,
        tweet: tweetId
    })
    if(!alreadyLiked) throw new ApiError(400, "Tweet is not liked");

    const unLikeTweet = await LikeModel.findOneAndDelete({
        user: userId,
        tweet: tweetId
    })
    if(!unLikeTweet) throw new ApiError(400, "Something Went Wrong");
    res.status(200).json(new ApiResponse(200, {}, "Tweet disliked successfully"));
})

const likeComment = AsyncHandler(async (req:Request, res: Response) => {
    const { commentId } = req.params
    const userId = (req.user as IUser)?._id

    const user = await UserModel.findById(userId).select("-password -refreshToken")
    if(!user) throw new ApiError(404, "User not found");

    const comment = await CommentModel.findById(commentId)
    if(!comment) throw new ApiError(404, "comment not found");

    const alreadyLiked = await LikeModel.findOne({
        user: userId,
        comment: commentId
    })
    if(alreadyLiked) throw new ApiError(400, "comment already liked");

    const newLike = await LikeModel.create({
        user: userId,
        comment: commentId
    })
    if(!newLike) throw new ApiError(400, "Something went wrong");
    res.status(200).json(new ApiResponse(200, newLike, "comment liked successfully"));
})

const dislikeComment = AsyncHandler(async(req: Request, res: Response) => {
    const { commentId } = req.params
    const userId = (req.user as IUser)?._id

    const user = await UserModel.findById(userId).select("-password -refreshToken")
    if(!user) throw new ApiError(404, "User not found");

    const comment = await CommentModel.findById(commentId)
    if(!comment) throw new ApiError(404, "comment not found");

    const alreadyLiked = await LikeModel.findOne({
        user: userId,
        comment: commentId
    })
    if(!alreadyLiked) throw new ApiError(400, "comment is not liked");

    const unLikecomment = await LikeModel.findOneAndDelete({
        user: userId,
        comment: commentId
    })
    if(!unLikecomment) throw new ApiError(400, "Something Went Wrong");
    res.status(200).json(new ApiResponse(200, {}, "comment disliked successfully"));
})

const allLiked = AsyncHandler(async(req: Request, res: Response) => {
    const {userId, page = 1, limit = 10} = req.query

    const user = await UserModel.findById(userId).select("-password -refreshToken")
    if(!user) throw new ApiError(404, "User not found");

    const pageNum = parseInt(page as string); //page number
    const limitNum = parseInt(limit as string); //number of tweets sent at once

    if (!Number.isInteger(pageNum) || !Number.isInteger(limitNum))
      throw new ApiError(400, "Invalid queries passed");

    const skip = (pageNum - 1) * limitNum; //Number of tweets to be skipped
    const likedTweets = await LikeModel.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(user._id)
            }
        },
        {
            $lookup: {
                from: 'tweets',
                localField: 'tweet',
                foreignField: '_id',
                as: 'LikedTweets',
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField : 'owner',
                            foreignField: '_id',
                            as: 'tweetOwner',
                            pipeline: [
                                {
                                    $project: {
                                        avatar: 1,
                                        userName: 1,
                                        _id: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $lookup: {
                            from: 'likes',
                            localField: '_id',
                            foreignField: 'tweet',
                            as: 'LikesOnTweet'
                        }
                    },
                    {
                        $lookup: {
                            from: 'comments',
                            localField: '_id',
                            foreignField: 'tweet',
                            as: 'CommentsOnTweet'
                        }
                    },
                    {
                        $addFields: {
                            tweetOwner: {
                                $first: "$tweetOwner"
                            },
                            likes: {
                                $size: "$LikesOnTweet"
                            },
                            commentCount: {
                                $size: "$CommentsOnTweet"
                            },
                            isLiked: {
                                $cond: {
                                    if: {
                                        $in: [(req.user as IUser)?._id, "$LikesOnTweet.user"]
                                    },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            content: 1,
                            mentions: 1,
                            createdAt: 1,
                            media: 1,
                            tweetOwner: 1,
                            likes: 1,
                            commentCount: 1,
                            isLiked: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                LikedTweet: {
                    $first: "$LikedTweets"
                }
            }
        },
        {
            $project: {
                LikedTweet: 1
            }
        }
    ]).skip(skip).limit(limitNum);

    if(!likedTweets) throw new ApiError(400, "Something went wrong while getting tweets");

    return res.status(200).json(new ApiResponse(200, likedTweets, "Tweets Fetched Successfully"))
})

export {likeTweet, dislikeTweet, likeComment, dislikeComment, allLiked}