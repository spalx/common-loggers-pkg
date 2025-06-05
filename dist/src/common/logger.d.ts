import winston from 'winston';
import 'winston-daily-rotate-file';
declare const logger: winston.Logger;
declare const kafkaLogger: winston.Logger;
declare const accessLogger: winston.Logger;
export { logger, kafkaLogger, accessLogger };
