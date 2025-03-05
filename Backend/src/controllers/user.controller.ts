import { Request, Response } from "express";
import { AsyncHandler } from "../utils/Asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { emailSchema, verifySchema } from "../schemas/index.js";
import UserModel from "../models/user.model.js";
import redis from "../db/Redis.js";
import { sendVerificationEmail } from "../utils/EmailVerification.js";

const sendMail = AsyncHandler( async ( req:Request, res: Response ) => {
    const { email } = req.body;
    if(!email) throw new ApiError(400, "Please provide an email");
    const result = emailSchema.safeParse(email);
    if(!result.success) throw new ApiError(400, "Please provide a valid email", result.error.errors);
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    const existingUser = await UserModel.findOne({
        $or: [{email}]
    })
    if(existingUser) throw new ApiError(400, "Email already exists")

    await redis.setex(`otp:${email}`, 180, otp); //OTP for 3 minutes

    const response = await sendVerificationEmail(email, otp);
    if(!response.success) throw new ApiError(response.statusCode, response.message);

    return res.status(200).json(new ApiResponse(200, {data: response.data, status: "Email sent"}, "Email sent successfully"))
} )

const verifyOTP = AsyncHandler( async ( req: Request, res: Response ) => {
    const { email, code } = req.body;
    if(!code || !email) throw new ApiError(400, "Please provide the required fields");

    const result = verifySchema.safeParse({email, code})
    if(!result.success) throw new ApiError(400, result.error.message, result.error.errors);

    const cachedOTP = await redis.get(`otp:${email}`)
    if(!cachedOTP) throw new ApiError(400, "OTP expired");

    if(cachedOTP === code) {
        return res.status(200).json(new ApiResponse(200, {email, status: "OTP matched"}, "User verified"))
    } else {
        throw new ApiError(200, "OTP didn't match please try again")
    }
} )

export {
    sendMail,
    verifyOTP
}