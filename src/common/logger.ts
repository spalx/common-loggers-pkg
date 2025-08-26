import winston, { Logger, LoggerOptions } from 'winston';
import 'winston-daily-rotate-file';

function lazyLogger(configFactory: () => LoggerOptions): Logger {
  let realLogger: Logger | null = null;

  return new Proxy({} as Logger, {
    get(_, prop: keyof Logger) {
      if (!realLogger) {
        realLogger = winston.createLogger(configFactory());
      }
      const value = (realLogger as any)[prop];
      return typeof value === 'function' ? value.bind(realLogger) : value;
    },
  });
}

const logger = lazyLogger(() => ({
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, stack }) =>
      stack
        ? `[${timestamp}][${level.toUpperCase()}] ${message}\n${stack}`
        : `[${timestamp}][${level.toUpperCase()}] ${message}`
    )
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `[${timestamp}][${level.toUpperCase()}] ${message}${
            Object.keys(meta).length ? ': ' + JSON.stringify(meta) : ''
          }`;
        })
      ),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
}));

const kafkaLogger = lazyLogger(() => ({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `[${timestamp}][${level.toUpperCase()}] ${message}${
        Object.keys(meta).length ? ': ' + JSON.stringify(meta) : ''
      }`;
    })
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/kafka-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '50m',
      maxFiles: '7d',
    }),
  ],
}));

const httpLogger = lazyLogger(() => ({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `[${timestamp}][${level.toUpperCase()}] ${message}${
        Object.keys(meta).length ? ': ' + JSON.stringify(meta) : ''
      }`;
    })
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/http-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '100m',
      maxFiles: '5d',
    }),
  ],
}));

const accessLogger = lazyLogger(() => ({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `[${timestamp}][${level.toUpperCase()}] ${message}${
        Object.keys(meta).length ? ': ' + JSON.stringify(meta) : ''
      }`;
    })
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/access-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '100m',
      maxFiles: '5d',
    }),
  ],
}));

export { logger, kafkaLogger, httpLogger, accessLogger };
