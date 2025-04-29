import { Request, Response } from "express";
import { AsyncHandler } from "../../utils/Asynchandler";
import UserModel, { IUser } from "../../models/user.model";
import { ApiError } from "../../utils/ApiError";
import TweetModel from "../../models/tweet.model";
import CommentModel from "../../models/comment.model";
import { ApiResponse } from "../../utils/ApiResponse";
import mongoose from "mongoose";

const comment = AsyncHandler(async (req: Request, res: Response) => {
  const { tweetId } = req.query;
  const { content } = req.body;

  if (!content) throw new ApiError(400, "Content is required");

  const userId = (req.user as IUser)?._id;

  const user = await UserModel.findById(userId).select(
    "-password -refreshToken"
  );
  if (!user) throw new ApiError(404, "User not found");

  const tweet = await TweetModel.findById(tweetId);
  if (!tweet) throw new ApiError(404, "Tweet not found");

  const alreadyCommented = await CommentModel.findOne({
    author: userId,
    tweet: tweetId,
  });
  if (alreadyCommented)
    throw new ApiError(400, "Already commented on this tweet");

  const newComment = await CommentModel.create({
    content,
    author: userId,
    tweet: tweetId,
  });
  if (!newComment) throw new ApiError(400, "Something went wrong");
  res
    .status(200)
    .json(new ApiResponse(200, newComment, "Commented on post successfully"));
});

const allCommentsOnAPost = AsyncHandler(async (req: Request, res: Response) => {
  const { tweetId } = req.query;
  const userId = (req.user as IUser)?._id;

  const user = await UserModel.findById(userId).select(
    "-password -refreshToken"
  );
  if (!user) throw new ApiError(404, "User not found");

  const tweet = await TweetModel.findById(tweetId);
  if (!tweet) throw new ApiError(404, "Tweet not found");

  const comment = await CommentModel.aggregate([
    {
      $match: {
        tweet: new mongoose.Types.ObjectId(tweet._id as string),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
        as: "Likes",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              _id: 1,
              avatar: 1,
              userName: 1
            }
          }
        ]
      },
    },
    {
      $lookup: {
        from: "tweets",
        localField: "tweet",
        foreignField: "_id",
        as: "Tweet",
      },
    },
    {
      $addFields: {
        likes: {
          $size: "$Likes",
        },
        owner: "$owner",
        tweetDetails: "$Tweet",
        isLiked: {
          $cond: {
            if: {
              $in: [(req.user as IUser)?._id, "$Likes.user"]
            },
            then: true,
            else: false
          }
        }
      },
    },
    {
      $project: {
        content: 1,
        owner: 1,
        tweetDetails: 1,
        likes: 1,
        createdAt: 1,
        isLiked: 1
      },
    },
  ]).sort("-1");

  if (!comment) throw new ApiError(404, "Comment not found");

  res
    .status(200)
    .json(new ApiResponse(200, comment, "Comments fetched successfully"));
});

const deleteComment = AsyncHandler(async (req: Request, res: Response) => {
  const { commentId } = req.query;
  const user = await UserModel.findById((req.user as IUser)._id);
  if (!user) throw new ApiError(400, "Only owner can delete the comment");

  const comment = await CommentModel.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");

  if (user?._id.toString() !== comment?.author.toString())
    throw new ApiError(400, "Only owner can delete the comment");

  const deleteComment = await CommentModel.findByIdAndDelete(comment._id);
  if (!deleteComment) throw new ApiError(400, "Something went wrong");

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

const updateComment = AsyncHandler(async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const { newContent } = req.body;
  if (!newContent) throw new ApiError(400, "New COntent is required");
  const user = await UserModel.findById((req.user as IUser)._id);
  if (!user) throw new ApiError(400, "Only owner can update the comment");

  const comment = await CommentModel.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");

  if (user._id.toString() !== comment.author.toString())
    throw new ApiError(400, "Only owner can update the comment");

  const updatedContent = await CommentModel.findByIdAndUpdate(comment._id, {
    content: newContent,
  });
  if (!updatedContent) throw new ApiError(400, "Something went wrong");

  res
    .status(200)
    .json(new ApiResponse(200, updatedContent, "Comment deleted successfully"));
});

export { comment, allCommentsOnAPost, deleteComment, updateComment };
