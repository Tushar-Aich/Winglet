import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import logger from './logger.js';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config()

const app = express();

const morganFormat = ':method :url :status :response-time ms';

app.use(morgan(morganFormat, {
    stream: {
        write: (message) => {
            const logObject = {
                method: message.split(' ')[0],
                url: message.split(' ')[1],
                status: message.split(' ')[2],
                responseTime: message.split(' ')[3]
            };
            logger.info(JSON.stringify(logObject));
        }
    }
}))

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

//common middleware
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));

app.use(cookieParser());

//router import
import UserRouter from './routes/user.routes.js'
import FollowRouter from './routes/follow.routes.js'
import TweetRouter from "./routes/tweet.routes.js"
import LikeRouter from "./routes/like.routes.js"
import CommentRouter from "./routes/comment.routes.js"
import NotificationRouter from "./routes/notification.routes.js"
import VoiceRouter from './routes/voice.routes.js'

//router declaration
app.use("/api/v1/users", UserRouter)
app.use("/api/v1/followers", FollowRouter)
app.use("/api/v1/tweets", TweetRouter)
app.use("/api/v1/likes", LikeRouter)
app.use("/api/v1/comments", CommentRouter)
app.use("/api/v1/notifications", NotificationRouter)
app.use('/api/v1/voice', VoiceRouter)

export default app;