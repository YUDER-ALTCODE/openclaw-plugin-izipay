import { createAuthHeaders, getBaseUrl, buildUrl } from "./auth.js";
import { IZIPAY_ENDPOINTS } from "./endpoints.js";
import { IzipayApiError, IzipayAuthError, IzipayNetworkError } from "./errors.js";
export class IzipayClient {
    baseUrl;
    apiKey;
    constructor(config) {
        this.apiKey = config.apiKey;
        this.baseUrl = getBaseUrl(config.environment);
    }
    async request(path, options = {}) {
        const url = buildUrl(this.baseUrl, path);
        const response = await fetch(url, {
            ...options,
            headers: {
                ...createAuthHeaders({ apiKey: this.apiKey, environment: "sandbox" }),
                ...options.headers,
            },
        });
        const responseData = await response.json().catch(() => ({}));
        if (!response.ok) {
            if (response.status === 401) {
                throw new IzipayAuthError("Invalid API key", response.status, responseData);
            }
            if (response.status >= 500) {
                throw new IzipayNetworkError("Izipay server error", response.status, responseData);
            }
            const message = responseData?.message ?? "API error";
            throw new IzipayApiError(message, response.status, responseData);
        }
        return responseData;
    }
    async createPayment(data) {
        return this.request(IZIPAY_ENDPOINTS.payments, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
    async getPaymentStatus(paymentId) {
        return this.request(IZIPAY_ENDPOINTS.paymentStatus(paymentId));
    }
    async getPaymentDetails(paymentId) {
        return this.request(IZIPAY_ENDPOINTS.paymentDetails(paymentId));
    }
}
export function createIzipayClient(config) {
    return new IzipayClient(config);
}
export { IzipayApiError, IzipayAuthError, IzipayNetworkError };
export { IZIPAY_ENDPOINTS } from "./endpoints.js";
export { createAuthHeaders, getBaseUrl, buildUrl } from "./auth.js";
//# sourceMappingURL=izipay-client.js.map