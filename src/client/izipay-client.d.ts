import type { IzipayCreatePaymentRequest, IzipayPaymentResponse, IzipayPaymentDetails } from "../types/api.js";
import { IzipayApiError, IzipayAuthError, IzipayNetworkError } from "./errors.js";
export interface IzipayClientConfig {
    apiKey: string;
    environment: "sandbox" | "production";
}
export declare class IzipayClient {
    private readonly baseUrl;
    private readonly apiKey;
    constructor(config: IzipayClientConfig);
    private request;
    createPayment(data: IzipayCreatePaymentRequest): Promise<IzipayPaymentResponse>;
    getPaymentStatus(paymentId: string): Promise<IzipayPaymentResponse>;
    getPaymentDetails(paymentId: string): Promise<IzipayPaymentDetails>;
}
export declare function createIzipayClient(config: IzipayClientConfig): IzipayClient;
export { IzipayApiError, IzipayAuthError, IzipayNetworkError };
export { IZIPAY_ENDPOINTS } from "./endpoints.js";
export { createAuthHeaders, getBaseUrl, buildUrl } from "./auth.js";
//# sourceMappingURL=izipay-client.d.ts.map