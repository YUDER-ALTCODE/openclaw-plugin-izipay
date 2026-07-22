export class IzipayApiError extends Error {
    statusCode;
    responseData;
    constructor(message, statusCode, responseData) {
        super(message);
        this.statusCode = statusCode;
        this.responseData = responseData;
        this.name = "IzipayApiError";
    }
}
export class IzipayAuthError extends IzipayApiError {
    constructor(message, statusCode, responseData) {
        super(message, statusCode, responseData);
        this.name = "IzipayAuthError";
    }
}
export class IzipayNetworkError extends IzipayApiError {
    constructor(message, statusCode, responseData) {
        super(message, statusCode, responseData);
        this.name = "IzipayNetworkError";
    }
}
export class IzipayValidationError extends IzipayApiError {
    validationErrors;
    constructor(message, validationErrors, statusCode = 400, responseData) {
        super(message, statusCode, responseData);
        this.validationErrors = validationErrors;
        this.name = "IzipayValidationError";
    }
}
//# sourceMappingURL=errors.js.map