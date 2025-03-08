import { Request, Response } from "express";
import { AsyncHandler } from "../utils/Asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import UserModel from "../models/user.model.js";
import redis from "../db/Redis.js";
import { sendVerificationEmail } from "../utils/EmailVerification.js";
import { uploadOnCloudinary } from "../lib/Cloudinary.js";
import { generateAccessToken, generateRefreshToken } from "../lib/jwt.js";
import jwt from "jsonwebtoken";

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

  const accessToken = generateAccessToken(user._id, user.email, user.userName);
  const refreshToken = generateRefreshToken(user._id);

  const updatedUser = await UserModel.findByIdAndUpdate(user._id, {
    refreshToken,
    lastActive: Date.now(),
  });
  if (!updatedUser) throw new ApiError(400, "Problem while updating user");

  const loggedInUser = await UserModel.findById(user._id).select(
    "-password -refreshToken"
  );
  
  // Set the security based on environment
  const isProduction = process.env.NODE_ENV === "production";

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse(
        200, 
        { 
          user: loggedInUser, 
          accessToken,
          refreshToken
        }, 
        "User logged in successfully"
      )
    );
});

const refreshAccessToken = AsyncHandler(async (req: Request, res: Response) => {
  try {
    // Extract the refresh token from cookies or body
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request: No refresh token provided");
    }

    // Verify the token
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
    if (!REFRESH_TOKEN_SECRET) {
      throw new ApiError(500, "Server configuration error: Missing refresh token secret");
    }
    
    const decodedToken = jwt.verify(incomingRefreshToken, REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
    
    // Find the user
    const user = await UserModel.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token: User not found");
    }

    // Validate the token matches the one in database
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or has been used");
    }

    // Generate new tokens
    const accessToken = generateAccessToken(user._id, user.email, user.userName);
    const newRefreshToken = generateRefreshToken(user._id);
    
    // Update the user's refresh token in the database
    await UserModel.findByIdAndUpdate(user._id, {
      refreshToken: newRefreshToken,
      lastActive: Date.now()
    });

    // Set the security based on environment
    const isProduction = process.env.NODE_ENV === "production";
    
    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access token refreshed successfully"
        )
      );
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    } else if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid refresh token format");
    } else if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Refresh token has expired");
    }
    throw new ApiError(500, "Internal server error during token refresh");
  }
});

export { sendMail, verifyOTP, signUp, login, refreshAccessToken };
