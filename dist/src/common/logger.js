"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessLogger = exports.kafkaLogger = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
require("winston-daily-rotate-file");
const logger = winston_1.default.createLogger({
    format: winston_1.default.format.combine(winston_1.default.format.errors({ stack: true }), winston_1.default.format.timestamp(), // Add timestamps
    winston_1.default.format.printf(({ timestamp, level, message, stack }) => {
        return stack
            ? `[${timestamp}][${level.toUpperCase()}] ${message}\n${stack}`
            : `[${timestamp}][${level.toUpperCase()}] ${message}`;
    })),
    transports: [
        // Write all logs to console
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), // Add timestamps
            winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
                return `[${timestamp}][${level.toUpperCase()}] ${message}${Object.keys(meta).length ? ': ' + JSON.stringify(meta) : ''}`;
            })),
        }),
        // Write error logs to error.log
        new winston_1.default.transports.File({ filename: 'logs/error.log', level: 'error' }),
    ],
});
exports.logger = logger;
const kafkaLogger = winston_1.default.createLogger({
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), // Add timestamps
    winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
        return `[${timestamp}][${level.toUpperCase()}] ${message}${Object.keys(meta).length ? ': ' + JSON.stringify(meta) : ''}`;
    })),
    transports: [
        // Dedicated transport for Kafka logs
        new winston_1.default.transports.DailyRotateFile({
            filename: 'logs/kafka-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '50m',
            maxFiles: '7d',
        }),
    ],
});
exports.kafkaLogger = kafkaLogger;
const accessLogger = winston_1.default.createLogger({
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), // Add timestamps
    winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
        return `[${timestamp}][${level.toUpperCase()}] ${message}${Object.keys(meta).length ? ': ' + JSON.stringify(meta) : ''}`;
    })),
    transports: [
        // Dedicated transport for incoming http requests logs
        new winston_1.default.transports.DailyRotateFile({
            filename: 'logs/access-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '100m',
            maxFiles: '5d',
        }),
    ],
});
exports.accessLogger = accessLogger;
