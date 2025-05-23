import { Request, Response } from "express";
import { AsyncHandler } from "../../utils/Asynchandler";
import UserModel, { IUser } from "../../models/user.model";
import { ApiError } from "../../utils/ApiError";
import { voiceCloneAdd } from "../../lib/elevenLabs";
import { ApiResponse } from "../../utils/ApiResponse";
import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'



const AddAudioForCloning = AsyncHandler(async(req: Request, res: Response) => {
    const user = (req.user as IUser)
    if(!user) throw new ApiError(404, "User not found");

    let VoiceLocalPath: any;
    if (
      req.files &&
      !Array.isArray(req.files) &&
      "voice" in req.files &&
      Array.isArray(req.files.voice) &&
      req.files.voice.length > 0
    ) {
      VoiceLocalPath = req.files.voice[0].path;
    }

    const enhancedPath = `./public/processed/${user?._id}_enhanced.wav`

    if(!fs.existsSync('./public/processed')) fs.mkdirSync('./public/processed');

    const enhancedAudio = await new Promise<void>((resolve, reject) => {
      ffmpeg(VoiceLocalPath).audioFilters([
        'highpass=f=200',
        'lowpass=f=3000',
        'dynaudnorm'
      ]).save(enhancedPath).on('end', () => resolve()).on('error', err => {
        console.log("error in ffmpeg", err)
        reject(err)
      })
    })

    console.log(enhancedAudio)

    const ClonedVoice = enhancedPath ? await voiceCloneAdd(enhancedPath) : undefined;

    if(!ClonedVoice) throw new ApiError(400, "Error while cloning voice");

    console.log(ClonedVoice)

    const updatedUser = await UserModel.findByIdAndUpdate(user?._id, {
      $set: {
        voiceId: ClonedVoice.voice_id
      }
    }, {
      new: true
    }).select("-password -refreshToken")

    if(!updatedUser) throw new ApiError(500, "Internal server Error from voice");

    fs.unlinkSync(VoiceLocalPath)  //everything done so removing file from server

    return res.status(200).json(new ApiResponse(200, updatedUser, "Voice Id added successfully"));
})

export { AddAudioForCloning }