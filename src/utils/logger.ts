import winston from "winston";
import * as dotenv from "dotenv";

dotenv.config();

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
 
const level = () => {
    const env = process.env.NODE_ENV ?? "development";
    return env == "development" ? "debug" : "info";
}

const format = winston.format.combine(
    winston.format.timestamp( { format: "YYYY-MM-DD HH:mm:ss:ms" }),
    winston.format.printf((info: any) => `${info.timestamp}:${info.level} - ${info.message}`)
);

const transports = [new winston.transports.Console()];

export const Logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
});