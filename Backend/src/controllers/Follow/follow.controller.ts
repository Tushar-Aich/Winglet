import { Request, Response } from "express";
import { AsyncHandler } from "../../utils/Asynchandler";
import { IUser } from "../../models/user.model";
import FollowModel from "../../models/follow.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import mongoose from "mongoose";


const followUser = AsyncHandler(async(req:Request, res:Response) => {
    const followerId = (req.user as IUser)?._id
    const { followingId } = req.params
    console.log("Following iD: ", followingId)
    
    if(followingId as unknown as mongoose.Types.ObjectId === followerId) throw new ApiError(400, "Can't follow yourself");

    const alreadyFollowing = await FollowModel.findOne({
        follower: followerId,
        following: followingId
    })

    if(alreadyFollowing) throw new ApiError(400, "Already following User");

    const newFollower = await FollowModel.create({
        follower: followerId,
        following: followingId
    })
    if(!newFollower) throw new ApiError(400, "Something went wrong, please try again later");
    res.status(200).json(new ApiResponse(200, newFollower, "User followed successfully"))
})

const unfollowUser = AsyncHandler(async(req:Request, res:Response) => {
    const unfollowerId = (req.user as IUser)?._id
    const { unfollowingId } = req.params
    
    if(unfollowingId as unknown as mongoose.Types.ObjectId === unfollowerId) throw new ApiError(400, "Can't unfollow yourself");

    const alreadyFollowing = await FollowModel.findOne({
        follower: unfollowerId,
        following: unfollowingId
    })

    if(!alreadyFollowing) throw new ApiError(400, "not following User");

    const deleteFollow = await FollowModel.findOneAndDelete({
        follower: unfollowerId,
        following: unfollowingId
    })
    if(!deleteFollow) throw new ApiError(400, "Something went wrong, please try again later");
    res.status(200).json(new ApiResponse(200, {}, "User unfollowed successfully"))
})

export {followUser, unfollowUser}