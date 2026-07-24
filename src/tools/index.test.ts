import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPaymentTool } from "./create-payment.js";
import type { ToolPluginExecutionContext } from "openclaw/plugin-sdk/tool-plugin.js";
import { IzipayClient } from "../client/izipay-client.js";
import type { IzipayCreatePaymentResponse } from "../types/api.js";

vi.mock("../client/izipay-client.js");

const MOCK_CONFIG = {
  username: "98671504",
  password: "testpassword_abc123",
  environment: "sandbox" as const,
};

const MOCK_CONTEXT: ToolPluginExecutionContext = {
  api: {} as any,
  signal: { aborted: false, throwIfAborted: vi.fn() },
  toolCallId: "call_123",
  onUpdate: vi.fn(),
};

const MOCK_SUCCESS_RESPONSE: IzipayCreatePaymentResponse = {
  status: "SUCCESS",
  answer: {
    formToken: "abc123def456",
  },
};

describe("Tools", () => {
  let mockClient: {
    createPayment: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient = {
      createPayment: vi.fn(),
    };
    vi.mocked(IzipayClient).mockImplementation(() => mockClient as any);
  });

  describe("createPaymentTool", () => {
    it("should create payment with all params", async () => {
      mockClient.createPayment.mockResolvedValueOnce(MOCK_SUCCESS_RESPONSE);

      const result = await createPaymentTool(
        {
          amount: 10000,
          currency: "PEN",
          orderId: "TEST-001",
          customerEmail: "test@example.com",
          customerFirstName: "Test",
          customerLastName: "User",
          customerPhone: "987654321",
        },
        MOCK_CONFIG,
        MOCK_CONTEXT,
      );

      expect(result.status).toBe("SUCCESS");
      expect(result.formToken).toBe("abc123def456");
      expect(mockClient.createPayment).toHaveBeenCalledWith({
        amount: 10000,
        currency: "PEN",
        orderId: "TEST-001",
        customer: {
          email: "test@example.com",
          billingDetails: {
            firstName: "Test",
            lastName: "User",
            phoneNumber: "987654321",
          },
        },
      });
    });

    it("should create payment with minimal params", async () => {
      mockClient.createPayment.mockResolvedValueOnce(MOCK_SUCCESS_RESPONSE);

      const result = await createPaymentTool(
        {
          amount: 10000,
          currency: "USD",
          orderId: "TEST-002",
        },
        MOCK_CONFIG,
        MOCK_CONTEXT,
      );

      expect(result.status).toBe("SUCCESS");
    });

    it("should throw on missing credentials", async () => {
      await expect(
        createPaymentTool(
          { amount: 10000, currency: "PEN", orderId: "TEST-001" },
          { username: "", password: "", environment: "sandbox" },
          MOCK_CONTEXT,
        ),
      ).rejects.toThrow("Izipay credentials not configured");
    });

    it("should respect abort signal", async () => {
      const abortedContext: ToolPluginExecutionContext = {
        ...MOCK_CONTEXT,
        signal: { aborted: true, throwIfAborted: () => { throw new Error("Aborted"); } },
      };

      await expect(
        createPaymentTool(
          { amount: 10000, currency: "PEN", orderId: "TEST-001" },
          MOCK_CONFIG,
          abortedContext,
        ),
      ).rejects.toThrow("Aborted");
    });

    it("should throw on API error response", async () => {
      mockClient.createPayment.mockResolvedValueOnce({
        status: "ERROR",
        message: "Invalid amount",
      });

      await expect(
        createPaymentTool(
          { amount: 10000, currency: "PEN", orderId: "TEST-001" },
          MOCK_CONFIG,
          MOCK_CONTEXT,
        ),
      ).rejects.toThrow("Payment creation failed: Invalid amount");
    });
  });
});
