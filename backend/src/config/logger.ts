import winston from "winston";
import path from "path";
import fs from "fs";
import env from "./env.js";

const { combine, timestamp, printf, colorize, json } = winston.format;

if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs");
}

const consoleFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white",
};

winston.addColors(colors);

const logger = winston.createLogger({
    levels,
    level: env.NODE_ENV === "development" ? "debug" : "info",

    defaultMeta: { service: "backend-service" },

    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        json()
    ),

    transports: [
        new winston.transports.File({
            filename: path.join("logs", "error.log"),
            level: "error",
        }),

        new winston.transports.File({
            filename: path.join("logs", "combined.log"),
        }),
    ],
});

if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: combine(
                colorize({ all: true }),
                timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                consoleFormat
            ),
        })
    );
}

export default logger;