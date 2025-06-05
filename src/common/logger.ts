import winston from 'winston';
import 'winston-daily-rotate-file';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(), // Add timestamps
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return stack
        ? `[${timestamp}][${level.toUpperCase()}] ${message}\n${stack}`
        : `[${timestamp}][${level.toUpperCase()}] ${message}`;
    })
  ),
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(), // Add timestamps
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `[${timestamp}][${level.toUpperCase()}] ${message}${Object.keys(meta).length ? ': ' + JSON.stringify(meta) : ''}`;
        })
      ),
    }),
    // Write error logs to error.log
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});

const kafkaLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamps
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `[${timestamp}][${level.toUpperCase()}] ${message}${Object.keys(meta).length ? ': ' + JSON.stringify(meta) : ''}`;
    })
  ),
  transports: [
    // Dedicated transport for Kafka logs
    new winston.transports.DailyRotateFile({
      filename: 'logs/kafka-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '50m',
      maxFiles: '7d',
    }),
  ],
});

const accessLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamps
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `[${timestamp}][${level.toUpperCase()}] ${message}${Object.keys(meta).length ? ': ' + JSON.stringify(meta) : ''}`;
    })
  ),
  transports: [
    // Dedicated transport for incoming http requests logs
    new winston.transports.DailyRotateFile({
      filename: 'logs/access-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '100m',
      maxFiles: '5d',
    }),
  ],
});

export { logger, kafkaLogger, accessLogger };
