import { createLogger, format, transports } from "winston";
import path from "path";

const logFormat = format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`
})

const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss"}),
        format.errors({ stack: true}),
        format.splat(),
        logFormat
    ),
    transports: [
        new transports.File({filename: "error.log", level: "error"}),
        new transports.File({ filename: "combine.log"})
    ]
})

export default logger;