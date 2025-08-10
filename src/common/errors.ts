/**
 * Base error class for all QMobile microservices
 * Provides consistent error handling with HTTP status codes
 */
export abstract class BaseError extends Error {
  constructor(message: string) {
    super(message);
    // Node.js specific stack trace capture
    const errorClass = Error as typeof Error & {
      captureStackTrace?: (
        targetObject: object,
        constructorOpt: new (...args: unknown[]) => unknown
      ) => void;
    };
    if (errorClass.captureStackTrace) {
      errorClass.captureStackTrace(this, this.constructor);
    }
    this.name = this.constructor.name;
  }

  abstract get code(): number;
}

/**
 * 400 Bad Request - Client error in request format or parameters
 */
export class BadRequestError extends BaseError {
  readonly code: number = 400;
}

/**
 * 401 Unauthorized - Authentication required or failed
 */
export class UnauthorizedError extends BaseError {
  constructor(message: string = 'Unauthorized - Invalid credentials') {
    super(message);
  }
  readonly code: number = 401;
}

/**
 * 403 Forbidden - Authenticated but lacking permissions
 */
export class ForbiddenError extends BaseError {
  readonly code: number = 403;
}

/**
 * 404 Not Found - Requested resource does not exist
 */
export class NotFoundError extends BaseError {
  readonly code: number = 404;
}

/**
 * 500 Internal Server Error - Server-side error
 */
export class InternalServerError extends BaseError {
  readonly code: number = 500;
}
