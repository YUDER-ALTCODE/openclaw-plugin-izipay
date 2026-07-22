import type { IzipayCreatePaymentRequest, IzipayPaymentResponse, IzipayPaymentDetails } from "../types/api.js";
import { createAuthHeaders, getBaseUrl, buildUrl } from "./auth.js";
import { IZIPAY_ENDPOINTS } from "./endpoints.js";
import { IzipayApiError, IzipayAuthError, IzipayNetworkError } from "./errors.js";

export interface IzipayClientConfig {
  username: string;
  password: string;
  environment: "sandbox" | "production";
}

export class IzipayClient {
  private readonly baseUrl: string;
  private readonly config: IzipayClientConfig;

  constructor(config: IzipayClientConfig) {
    this.config = config;
    this.baseUrl = getBaseUrl(config.environment);

    if (!config.username || !config.password) {
      throw new Error("Username and password are required");
    }
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = buildUrl(this.baseUrl, path);

    const response = await fetch(url, {
      ...options,
      method: options.method ?? "GET",
      headers: {
        ...createAuthHeaders(this.config),
        ...options.headers,
      },
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401) {
        throw new IzipayAuthError("Invalid credentials", response.status, responseData);
      }
      if (response.status >= 500) {
        throw new IzipayNetworkError("Izipay server error", response.status, responseData);
      }
      const message = (responseData as { message?: string })?.message ?? "API error";
      throw new IzipayApiError(message, response.status, responseData);
    }

    return responseData as T;
  }

  async createPayment(data: IzipayCreatePaymentRequest): Promise<IzipayPaymentResponse> {
    return this.request<IzipayPaymentResponse>(IZIPAY_ENDPOINTS.payments, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getPaymentStatus(paymentId: string): Promise<IzipayPaymentResponse> {
    return this.request<IzipayPaymentResponse>(IZIPAY_ENDPOINTS.paymentStatus(paymentId));
  }

  async getPaymentDetails(paymentId: string): Promise<IzipayPaymentDetails> {
    return this.request<IzipayPaymentDetails>(IZIPAY_ENDPOINTS.paymentDetails(paymentId));
  }
}

export function createIzipayClient(config: IzipayClientConfig): IzipayClient {
  return new IzipayClient(config);
}

export { IzipayApiError, IzipayAuthError, IzipayNetworkError };
export { IZIPAY_ENDPOINTS } from "./endpoints.js";
export { createAuthHeaders, getBaseUrl, buildUrl } from "./auth.js";
