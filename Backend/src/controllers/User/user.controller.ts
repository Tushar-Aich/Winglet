import { Request, Response } from "express";
import { AsyncHandler } from "../../utils/Asynchandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import UserModel, { IUser } from "../../models/user.model.js";
import redis from "../../db/Redis.js";
import {
  sendVerificationEmail,
  sendForgotPasswordEmail,
} from "../../utils/EmailVerification.js";
import { uploadOnCloudinary, deleteFile } from "../../lib/Cloudinary.js";
import { generateAccessToken, generateRefreshToken } from "../../lib/jwt.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

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

  console.log(req.files);
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

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 24 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const refreshAccessToken = AsyncHandler(async (req: Request, res: Response) => {
  try {
    // Extract the refresh token from cookies or body
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(
        401,
        "Unauthorized request: No refresh token provided"
      );
    }

    // Verify the token
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
    if (!REFRESH_TOKEN_SECRET) {
      throw new ApiError(
        500,
        "Server configuration error: Missing refresh token secret"
      );
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      REFRESH_TOKEN_SECRET
    ) as jwt.JwtPayload;

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
    const accessToken = generateAccessToken(
      user._id,
      user.email,
      user.userName
    );
    const newRefreshToken = generateRefreshToken(user._id);

    // Update the user's refresh token in the database
    await UserModel.findByIdAndUpdate(user._id, {
      refreshToken: newRefreshToken,
      lastActive: Date.now(),
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

const logout = AsyncHandler(async (req: Request, res: Response) => {
  await UserModel.findByIdAndUpdate(
    (req.user as IUser)._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const isProduction = process.env.NODE_ENV === "production";

  return res
    .status(200)
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
    })
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const forgotPasswordEmail = AsyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) throw new ApiError(400, "Email is required");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    const user = await UserModel.findOne({
      $or: [{ email }],
    });

    if (!user) throw new ApiError(400, "Invalid email");

    await redis.setex(`forgotPasswordOtp:${user?._id}`, 180, hashedOtp); //OTP for 3 minutes

    const response = await sendForgotPasswordEmail(user?.email as string, otp);
    if (!response.success)
      throw new ApiError(response.statusCode, response.message);

    return res
      .status(response.statusCode)
      .json(
        new ApiResponse(response.statusCode, response.data, response.message)
      );
  }
);

const forgotPasswordOtpVerification = AsyncHandler(
  async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    if (!email) throw new ApiError(400, "Email is needed");
    if (!otp) throw new ApiError(400, "OTP is needed");

    const user = await UserModel.findOne({
      $or: [{ email }],
    });

    if (!user) throw new ApiError(400, "Invalid email");

    const cachedOTP = await redis.get(`forgotPasswordOtp:${user?._id}`);
    if (!cachedOTP) throw new ApiError(400, "OTP expired");

    const isOtpCorrect = await bcrypt.compare(otp, cachedOTP);
    if (!isOtpCorrect) throw new ApiError(400, "Incorrect OTP");

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Verified User for password Change"));
  }
);

const changePassword = AsyncHandler(async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  if (!newPassword) throw new ApiError(400, "New Password is required");
  if (!email) throw new ApiError(400, "Email is required");

  const user = await UserModel.findOne({
    $or: [{ email }],
  });
  if (!user) throw new ApiError(400, "User not found please try again");

  const isPasswordSame = await bcrypt.compare(
    newPassword,
    user?.password as string
  );
  if (isPasswordSame)
    throw new ApiError(400, "Same passwords aren't acceptable");

  user.password = newPassword;
  await user.save();

  const updatedUser = await UserModel.findOne(user?._id).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Password successfully changed"));
});

const getCurrentUser = AsyncHandler(async (req: Request, res: Response) => {
  console.log(req.user as IUser);
  return res
    .status(200)
    .json(new ApiResponse(200, req.user as IUser, "User Fetched successfully"));
});

const updateAvatar = AsyncHandler(async (req: Request, res: Response) => {
  const url = (req.user as IUser)?.avatar;
  if (!url) throw new ApiError(500, "Internal server Error");

  let avatarLocalPath;
  if (req.files && "avatar" in req.files && Array.isArray(req.files.avatar)) {
    avatarLocalPath = req.files.avatar[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar)
    throw new ApiError(400, "Error while uploading file in cloudinary");

  const updatedUser = await UserModel.findByIdAndUpdate(
    (req.user as IUser)?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }
  ).select("-password, -refreshToken");

  if (!updatedUser)
    throw new ApiError(400, "Updating avatar in database failed");

  await deleteFile(url as string);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar updated Successfully"));
});

const updateCoverImage = AsyncHandler(async (req: Request, res: Response) => {
  const url = (req.user as IUser)?.coverImage;
  if (!url) throw new ApiError(500, "Internal server Error");

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

  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : undefined;

  if (!coverImage)
    throw new ApiError(400, "Error while uploading to cloudinary");

  const updatedUser = await UserModel.findByIdAndUpdate(
    (req.user as IUser)?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  if (!updatedUser)
    throw new ApiError(400, "Updating avatar in database failed");

  await deleteFile(url as string);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar updated Successfully"));
});

const addBio = AsyncHandler(async (req: Request, res: Response) => {
  const { bio } = req.body;
  if (!bio) throw new ApiError(400, "Bio is required");

  if ((req.user as IUser).bio) {
    const updatedUser = await UserModel.findByIdAndUpdate(
      (req.user as IUser)._id,
      {
        $set: {
          bio,
        },
      },
      {
        new: true,
      }
    ).select("-password -refreshToken");
    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "Bio added Successfully"));
  } else {
    const user = await UserModel.findById((req.user as IUser)._id);
    if (!user) throw new ApiError(500, "internal server error");
    user.bio = bio;
    await user.save();

    const updatedUser = await UserModel.findById(
      (req.user as IUser)._id
    ).select("-password -refreshToken");
    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "Bio added Successfully"));
  }
});

const addBirthDate = AsyncHandler(async (req: Request, res: Response) => {
  const { birthDate } = req.body;
  if (!birthDate) throw new ApiError(400, "Birth Date is required");

  if ((req.user as IUser).birthDate) {
    const updatedUser = await UserModel.findByIdAndUpdate(
      (req.user as IUser)._id,
      {
        $set: {
          birthDate,
        },
      },
      {
        new: true,
      }
    ).select("-password -refreshToken");
    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "Birth Date added Successfully"));
  } else {
    const user = await UserModel.findById((req.user as IUser)._id);
    if (!user) throw new ApiError(500, "internal server error");
    user.birthDate = birthDate;
    await user.save();

    const updatedUser = await UserModel.findById(
      (req.user as IUser)._id
    ).select("-password -refreshToken");
    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "Birth Date added Successfully"));
  }
});

const deleteAcc = AsyncHandler(async (req: Request, res: Response) => {
  const deletedUser = await UserModel.findByIdAndDelete(
    (req.user as IUser)._id
  );
  if (!deletedUser) throw new ApiError(404, "User not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User deleted successfully"));
});

const userDetails = AsyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = await UserModel.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const userDetails = await UserModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(user._id),
      },
    },
    {
      $lookup: {
        from: "tweets",
        localField: "_id",
        foreignField: "owner",
        as: "userTweets",
        pipeline: [
          {
            $lookup: {
              from: 'likes',
              localField: '_id',
              foreignField: 'tweet',
              as: 'likesOnTweet'
            }
          },
          {
            $lookup: {
              from: 'comments',
              localField: '_id',
              foreignField: 'tweet',
              as: 'commentsOnTweet'
            }
          },
          {
            $addFields: {
              likes: {
                $size: '$likesOnTweet'
              },
              comments: {
                $size: "$commentsOnTweet"
              }
            }
          }
        ]
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "author",
        as: "userComments",
        pipeline: [
          {
            $lookup: {
              from: 'tweets',
              localField: 'tweet',
              foreignField: '_id',
              as: 'TweetComments'
            }
          },
          {
            $lookup: {
              from: 'likes',
              localField: '_id',
              foreignField: 'comment',
              as: 'likeOnComment'
            }
          },
          {
            $addFields: {
              comments: '$TweetComments',
              likes: {
                $size: '$likeOnComment'
              }
            }
          }
        ]
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "user",
        as: "userLikes",
        pipeline: [
          {
            $lookup: {
              from: 'tweets',
              localField: 'tweet',
              foreignField: '_id',
              as: 'likedTweets'
            }
          },
          {
            $addFields: {
              tweets: '$likedTweets'
            }
          }
        ]
      },
    },
    {
      $lookup: {
        from: 'follows',
        localField: '_id',
        foreignField: 'follower',
        as: 'followers'
      }
    },
    {
      $lookup: {
        from: 'follows',
        localField: '_id',
        foreignField: 'following',
        as: 'followings'
      }
    },
    {
      $addFields: {
        likes: "$userLikes",
        tweets: "$userTweets",
        comments: "$userComments",
        followersCount: {
          $size: '$followers'
        },
        followingCount: {
          $size: '$following'
        }
      },
    },
    {
      $project: {
        _id: 1,
        userName: 1,
        email: 1,
        OGName: 1,
        bio: 1,
        avatar: 1,
        coverImage: 1,
        birthDate: 1,
        isVerified: 1,
        isPrivate: 1,
        lastActive: 1,
        likes: 1,
        tweets: 1,
        comments: 1,
        followersCount: 1,
        followingCount: 1
      },
    },
  ]).sort("-1");

  if (!userDetails) throw new ApiError(400, "Something went wrong");
  res
    .status(200)
    .json(
      new ApiResponse(200, userDetails, "User details fetched successfully")
    );
});

export {
  sendMail,
  verifyOTP,
  signUp,
  login,
  refreshAccessToken,
  logout,
  forgotPasswordEmail,
  forgotPasswordOtpVerification,
  changePassword,
  getCurrentUser,
  updateAvatar,
  updateCoverImage,
  addBio,
  addBirthDate,
  deleteAcc,
  userDetails
};
