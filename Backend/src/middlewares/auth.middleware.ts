import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/Asynchandler.js";
import UserModel from "../models/user.model.js";
import { Request, NextFunction } from "express";

export const verifyJWT = AsyncHandler(
  async (req: Request, _, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("bearer ", "");

    if (!token) throw new ApiError(401, "Unauthorized request");

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    );

    const user = await UserModel.findById(
      (decodedToken as jwt.JwtPayload)?._id
    ).select("-password -refreshToken");

    if (!user) throw new ApiError(401, "Invalid Access Token");

    req.user = user;
    next();
  }
);
