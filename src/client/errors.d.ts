export declare class IzipayApiError extends Error {
    readonly statusCode: number;
    readonly responseData: unknown;
    constructor(message: string, statusCode: number, responseData: unknown);
}
export declare class IzipayAuthError extends IzipayApiError {
    constructor(message: string, statusCode: number, responseData: unknown);
}
export declare class IzipayNetworkError extends IzipayApiError {
    constructor(message: string, statusCode: number, responseData: unknown);
}
export declare class IzipayValidationError extends IzipayApiError {
    readonly validationErrors: Array<{
        field: string;
        message: string;
    }>;
    constructor(message: string, validationErrors: Array<{
        field: string;
        message: string;
    }>, statusCode: number | undefined, responseData: unknown);
}
//# sourceMappingURL=errors.d.ts.map