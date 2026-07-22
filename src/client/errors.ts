export class IzipayApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly responseData: unknown,
  ) {
    super(message);
    this.name = "IzipayApiError";
  }
}

export class IzipayAuthError extends IzipayApiError {
  constructor(message: string, statusCode: number, responseData: unknown) {
    super(message, statusCode, responseData);
    this.name = "IzipayAuthError";
  }
}

export class IzipayNetworkError extends IzipayApiError {
  constructor(message: string, statusCode: number, responseData: unknown) {
    super(message, statusCode, responseData);
    this.name = "IzipayNetworkError";
  }
}

export class IzipayValidationError extends IzipayApiError {
  constructor(
    message: string,
    public readonly validationErrors: Array<{ field: string; message: string }>,
    statusCode: number = 400,
    responseData: unknown,
  ) {
    super(message, statusCode, responseData);
    this.name = "IzipayValidationError";
  }
}