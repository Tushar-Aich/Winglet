import { Request, Response } from "express";
import { AsyncHandler } from "../../utils/Asynchandler";
import UserModel, { IUser } from "../../models/user.model";
import { ApiError } from "../../utils/ApiError";
import { voiceCloneAdd } from "../../lib/elevenLabs";
import { ApiResponse } from "../../utils/ApiResponse";



const AddAudioForCloning = AsyncHandler(async(req: Request, res: Response) => {
    const user = (req.user as IUser)
    if(!user) throw new ApiError(404, "User not found");

    let VoiceLocalPath;
    if (
      req.files &&
      !Array.isArray(req.files) &&
      "voice" in req.files &&
      Array.isArray(req.files.voice) &&
      req.files.voice.length > 0
    ) {
      VoiceLocalPath = req.files.voice[0].path;
    }

    const ClonedVoice = VoiceLocalPath ? await voiceCloneAdd(VoiceLocalPath) : undefined;

    if(!ClonedVoice) throw new ApiError(400, "Error while cloning voice");

    const updatedUser = await UserModel.findByIdAndUpdate(user?._id, {
      $set: {
        voiceId: ClonedVoice.voice_id
      }
    }, {
      new: true
    }).select("-password -refreshToken")

    if(!updatedUser) throw new ApiError(500, "Internal server Error");

    return res.status(200).json(new ApiResponse(200, updatedUser, "Voice Id added successfully"));
})

export { AddAudioForCloning }