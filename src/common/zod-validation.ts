import { ZodError, ZodIssue, ZodSchema } from 'zod';
import { BadRequestError } from './errors';

interface ValidationErrorDetail {
  field: string;
  message: string;
  value?: unknown;
}

interface ValidationErrorWithDetails extends BadRequestError {
  validationErrors: ValidationErrorDetail[];
}

export class ZodErrorFormatter {
  static formatZodError(error: ZodError): ValidationErrorWithDetails {
    const details: ValidationErrorDetail[] = error.issues.map((issue: ZodIssue) => ({
      field: issue.path.join('.'),
      message: issue.message,
      value: 'received' in issue ? issue.received : undefined,
    }));

    const message = this.createErrorMessage(details);
    const badRequestError = new BadRequestError(message) as ValidationErrorWithDetails;

    // Add detailed validation errors as additional property
    badRequestError.validationErrors = details;

    return badRequestError;
  }

  private static createErrorMessage(details: ValidationErrorDetail[]): string {
    if (details.length === 1) {
      const detail = details[0];
      if (!detail) {
        return 'Validation failed: Unknown error';
      }
      return detail.field
        ? `Validation failed for field '${detail.field}': ${detail.message}`
        : `Validation failed: ${detail.message}`;
    }

    const fieldErrors = details
      .map(detail => (detail.field ? `'${detail.field}': ${detail.message}` : detail.message))
      .join(', ');

    return `Validation failed for fields: ${fieldErrors}`;
  }

  static validateAndFormat<T>(schema: ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data);

    if (!result.success) {
      throw this.formatZodError(result.error);
    }

    return result.data;
  }
}

// Convenience function for direct usage
export function validateSchema<T>(schema: ZodSchema<T>, data: unknown): T {
  return ZodErrorFormatter.validateAndFormat<T>(schema, data);
}

// Export ZodError for type checking
export { ZodError };
