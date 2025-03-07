import { Request, Response } from "express";
import { AsyncHandler } from "../utils/Asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import UserModel from "../models/user.model.js";
import redis from "../db/Redis.js";
import { sendVerificationEmail } from "../utils/EmailVerification.js";
import { uploadOnCloudinary } from "../lib/Cloudinary.js";
import { generateAccessToken, generateRefreshToken } from "../lib/jwt.js";

const sendMail = AsyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Please provide an email");
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const existingUser = await UserModel.findOne({
    $or: [{ email }],
  });
  if (existingUser) throw new ApiError(400, "Email already exists");

  await redis.setex(`otp:${email}`, 180, otp); //OTP for 3 minutes

  const response = await sendVerificationEmail(email, otp);
  if (!response.success)
    throw new ApiError(response.statusCode, response.message);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { data: response.data, status: "Email sent" },
        "Email sent successfully"
      )
    );
});

const verifyOTP = AsyncHandler(async (req: Request, res: Response) => {
  const { email, code } = req.body;
  if (!code || !email)
    throw new ApiError(400, "Please provide the required fields");

  const cachedOTP = await redis.get(`otp:${email}`);
  if (!cachedOTP) throw new ApiError(400, "OTP expired");

  if (cachedOTP === code) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, { email, status: "OTP matched" }, "User verified")
      );
  } else {
    throw new ApiError(200, "OTP didn't match please try again");
  }
});

const signUp = AsyncHandler(async (req: Request, res: Response) => {
  const { userName, email, password, OGName, bio, birthDate } = req.body;

  if (
    [userName, email, password, OGName].some((value) => value?.trim() === "")
  ) {
    throw new ApiError(400, "userName, email, password, OGName are required");
  }
  const existingUser = await UserModel.findOne({
    $or: [{ email }],
  });
  if (existingUser) throw new ApiError(400, "Email already exists");

  let avatarLocalPath;
  if (req.files && "avatar" in req.files && Array.isArray(req.files.avatar)) {
    avatarLocalPath = req.files.avatar[0].path;
  }

  let coverImageLocalPath;
  if (
    req.files &&
    !Array.isArray(req.files) &&
    "coverImage" in req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : undefined;

  if (!avatar) {
    throw new ApiError(400, "avatar is required");
  }

  const user = await UserModel.create({
    userName,
    email,
    password,
    OGName,
    bio: bio || "",
    avatar: avatar.url,
    coverImage: coverImage ? coverImage.url : undefined,
    birthDate: birthDate ? new Date(birthDate) : undefined,
  });

  const returningUser = await UserModel.findById(user._id).select(
    "-password -refreshToken -__v"
  );
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: returningUser, status: "User created" },
        "User created successfully"
      )
    );
});

const login = AsyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) throw new ApiError(400, "Email is required");
  if (!password) throw new ApiError(400, "Password is required");

  const user = await UserModel.findOne({
    $or: [{ email }],
  });
  if (!user) throw new ApiError(404, "User not found");

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) throw new ApiError(400, "Password is incorrect");

  const AccessToken = generateAccessToken(user._id, user.email, user.userName);
  const refreshToken = generateRefreshToken(user._id);

  const updatedUser = await UserModel.findByIdAndUpdate(user._id, {
    refreshToken,
    lastActive: Date.now(),
  });
  if (!updatedUser) throw new ApiError(400, "Problem while updating user");

  const loggedInUser = await UserModel.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", AccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));
});

export { sendMail, verifyOTP, signUp, login };
