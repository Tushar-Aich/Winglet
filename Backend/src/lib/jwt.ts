import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string

const generateAccessToken = (userId: any, email: String, userName: String): string => {
    return jwt.sign(
        {
            _id: userId,
            email,
            userName
        },
        ACCESS_TOKEN_SECRET,
        {
            expiresIn: "1d"
        }
    )
}

const generateRefreshToken = (userId: any): string => {
    return jwt.sign(
        {
            _id: userId
        },
        REFRESH_TOKEN_SECRET,
        {
            expiresIn: "7d"
        }
    )
}

export { generateAccessToken, generateRefreshToken }