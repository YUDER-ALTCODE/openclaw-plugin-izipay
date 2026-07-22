import { beforeEach, describe, expect, it, vi } from "vitest";
import { IzipayClient } from "./izipay-client.js";
import type { IzipayCreatePaymentRequest, IzipayPaymentResponse, IzipayPaymentDetails } from "../types/api.js";
import { IzipayAuthError, IzipayNetworkError, IzipayApiError } from "./errors.js";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const VALID_CONFIG = {
  username: "98671504",
  password: "testpassword_abc123",
  environment: "sandbox" as const,
};

const CREATE_REQUEST: IzipayCreatePaymentRequest = {
  amount: 15000,
  currency: "PEN",
  orderId: "ORD-001",
  customerEmail: "test@example.com",
};

const MOCK_PAYMENT_RESPONSE: IzipayPaymentResponse = {
  paymentId: "pay_abc123",
  status: "pending",
  amount: 15000,
  currency: "PEN",
  orderId: "ORD-001",
  paymentUrl: "https://pay.micuentaweb.pe/pay_abc123",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z",
};

const MOCK_DETAILS_RESPONSE: IzipayPaymentDetails = {
  ...MOCK_PAYMENT_RESPONSE,
  installments: 1,
  paymentMethod: { type: "card", brand: "Visa", lastFour: "4242" },
  fees: { total: 450, breakdown: [{ type: "processing", amount: 450 }] },
  refunds: [],
};

describe("IzipayClient", () => {
  let client: IzipayClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new IzipayClient(VALID_CONFIG);
  });

  describe("constructor", () => {
    it("should create client with valid config", () => {
      expect(client).toBeInstanceOf(IzipayClient);
    });

    it("should throw on missing username", () => {
      expect(() => new IzipayClient({ username: "", password: "test", environment: "sandbox" })).toThrow(
        "Username and password are required",
      );
    });

    it("should throw on missing password", () => {
      expect(() => new IzipayClient({ username: "98671504", password: "", environment: "sandbox" })).toThrow(
        "Username and password are required",
      );
    });
  });

  describe("createPayment", () => {
    it("should create payment successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => MOCK_PAYMENT_RESPONSE,
      });

      const result = await client.createPayment(CREATE_REQUEST);

      expect(result).toEqual(MOCK_PAYMENT_RESPONSE);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toBe("https://api.micuentaweb.pe/v1/payments");
      expect(options?.method).toBe("POST");
      expect(options?.headers).toHaveProperty("Authorization");
    });

    it("should throw IzipayAuthError on 401", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: "Invalid credentials" }),
      });

      await expect(client.createPayment(CREATE_REQUEST)).rejects.toThrow(IzipayAuthError);
    });

    it("should throw IzipayNetworkError on 500", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: "Internal error" }),
      });

      await expect(client.createPayment(CREATE_REQUEST)).rejects.toThrow(IzipayNetworkError);
    });

    it("should throw IzipayApiError on 400", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: "Bad request" }),
      });

      await expect(client.createPayment(CREATE_REQUEST)).rejects.toThrow(IzipayApiError);
    });

    it("should throw on network failure", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(client.createPayment(CREATE_REQUEST)).rejects.toThrow("Network error");
    });
  });

  describe("getPaymentStatus", () => {
    it("should get payment status successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => MOCK_PAYMENT_RESPONSE,
      });

      const result = await client.getPaymentStatus("pay_abc123");

      expect(result).toEqual(MOCK_PAYMENT_RESPONSE);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.micuentaweb.pe/v1/payments/pay_abc123/status",
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("should throw on empty paymentId", async () => {
      await expect(client.getPaymentStatus("")).rejects.toThrow();
    });
  });

  describe("getPaymentDetails", () => {
    it("should get payment details successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => MOCK_DETAILS_RESPONSE,
      });

      const result = await client.getPaymentDetails("pay_abc123");

      expect(result).toEqual(MOCK_DETAILS_RESPONSE);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.micuentaweb.pe/v1/payments/pay_abc123/details",
        expect.objectContaining({ method: "GET" }),
      );
    });
  });
});
