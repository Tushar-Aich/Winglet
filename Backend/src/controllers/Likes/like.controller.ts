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

export {likeTweet, dislikeTweet, likeComment, dislikeComment}