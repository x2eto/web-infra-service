export type AppErrorCode = 'BAD_REQUEST' | 'TIMEOUT' | 'NOT_READY' | 'INTERNAL_ERROR';

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status: number;
  readonly details?: unknown;
  constructor(message: string, code: AppErrorCode, status: number, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

/**
 * Custom error class for PDF generation errors.
 */
export class GeneratePdfError extends Error {
  original?: Error;
  constructor(message: string, original?: Error) {
    super(message);
    this.name = 'GeneratePdfError';
    this.original = original;
  }
}

/**
 * Custom error class for PDF generation timeout errors.
 */
export class TimeoutPdfError extends GeneratePdfError {
  constructor(message: string, original?: Error) {
    super(message, original);
    this.name = 'TimeoutPdfError';
  }
}
