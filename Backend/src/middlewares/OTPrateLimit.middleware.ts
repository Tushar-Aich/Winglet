import {rateLimit} from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 2, // limit each IP to 2 requests per windowMs
    message: "Too many requests from this IP, please try again after 1 minute",
    standardHeaders: true,
    legacyHeaders: false
})

export default limiter;