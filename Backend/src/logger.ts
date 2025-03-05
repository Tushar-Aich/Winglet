import { createLogger, format, transports  } from "winston";
import 'winston-daily-rotate-file'

const logFormat = format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}] : ${message}`
    })
)

const fileTransport = new transports.DailyRotateFile({
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d'
})

const consoleTransport = new transports.Console({
    format: format.combine(format.colorize(), logFormat)
})

const logger = createLogger({
    level: 'info',
    format: logFormat,
    transports: [fileTransport, consoleTransport]
})

export default logger