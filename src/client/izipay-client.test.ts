import { beforeEach, describe, expect, it, vi } from "vitest";
import { IzipayClient } from "./izipay-client.js";
import type { IzipayCreatePaymentRequest, IzipayCreatePaymentResponse } from "../types/api.js";
import { IzipayAuthError, IzipayNetworkError, IzipayApiError } from "./errors.js";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const VALID_CONFIG = {
  username: "98671504",
  password: "testpassword_abc123",
  publicKey: "testpublickey_12345678901234567890",
  environment: "sandbox" as const,
};

const CREATE_REQUEST: IzipayCreatePaymentRequest = {
  amount: 10000,
  currency: "PEN",
  orderId: "TEST-001",
  customer: {
    email: "test@example.com",
  },
};

const MOCK_SUCCESS_RESPONSE: IzipayCreatePaymentResponse = {
  status: "SUCCESS",
  answer: {
    formToken: "abc123def456",
  },
};

const MOCK_ERROR_RESPONSE: IzipayCreatePaymentResponse = {
  status: "ERROR",
  message: "Invalid amount",
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
        json: async () => MOCK_SUCCESS_RESPONSE,
      });

      const result = await client.createPayment(CREATE_REQUEST);

      expect(result).toEqual(MOCK_SUCCESS_RESPONSE);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toBe("https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment");
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
});
