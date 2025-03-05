import {rateLimit} from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3, // limit each IP to 3 requests per windowMs
    message: "Too many requests from this IP, please try again after 1 minute",
    standardHeaders: true,
    legacyHeaders: false
})

export default limiter;