import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPaymentTool } from "./create-payment.js";
import { paymentStatusTool } from "./payment-status.js";
import { paymentDetailsTool } from "./payment-details.js";
import type { ToolPluginExecutionContext } from "openclaw/plugin-sdk/tool-plugin.js";
import { IzipayClient } from "../client/izipay-client.js";
import type { IzipayPaymentResponse, IzipayPaymentDetails } from "../types/api.js";

vi.mock("../client/izipay-client.js");

const MOCK_CONFIG = {
  apiKey: "izk_test_abc123",
  environment: "sandbox" as const,
};

const MOCK_CONTEXT: ToolPluginExecutionContext = {
  api: {} as any,
  signal: { aborted: false, throwIfAborted: vi.fn() },
  toolCallId: "call_123",
  onUpdate: vi.fn(),
};

const MOCK_PAYMENT_RESPONSE: IzipayPaymentResponse = {
  paymentId: "pay_abc123",
  status: "pending",
  amount: 15000,
  currency: "PEN",
  orderId: "ORD-001",
  paymentUrl: "https://pay.sandbox.izipay.pe/pay_abc123",
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

describe("Tools", () => {
  let mockClient: {
    createPayment: ReturnType<typeof vi.fn>;
    getPaymentStatus: ReturnType<typeof vi.fn>;
    getPaymentDetails: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient = {
      createPayment: vi.fn(),
      getPaymentStatus: vi.fn(),
      getPaymentDetails: vi.fn(),
    };
    vi.mocked(IzipayClient).mockImplementation(() => mockClient as any);
  });

  describe("createPaymentTool", () => {
    it("should create payment with all params", async () => {
      mockClient.createPayment.mockResolvedValueOnce(MOCK_PAYMENT_RESPONSE);

      const result = await createPaymentTool(
        {
          amount: 15000,
          currency: "PEN",
          orderId: "ORD-001",
          description: "Test order",
          customerEmail: "test@example.com",
          returnUrl: "https://example.com/success",
          cancelUrl: "https://example.com/cancel",
        },
        MOCK_CONFIG,
        MOCK_CONTEXT,
      );

      expect(result.paymentId).toBe("pay_abc123");
      expect(result.paymentUrl).toContain("pay_abc123");
      expect(mockClient.createPayment).toHaveBeenCalledWith({
        amount: 15000,
        currency: "PEN",
        orderId: "ORD-001",
        description: "Test order",
        customerEmail: "test@example.com",
        returnUrl: "https://example.com/success",
        cancelUrl: "https://example.com/cancel",
        metadata: undefined,
      });
    });

    it("should create payment with minimal params", async () => {
      mockClient.createPayment.mockResolvedValueOnce(MOCK_PAYMENT_RESPONSE);

      const result = await createPaymentTool(
        {
          amount: 10000,
          currency: "USD",
          orderId: "ORD-002",
        },
        MOCK_CONFIG,
        MOCK_CONTEXT,
      );

      expect(result.amount).toBe(10000);
      expect(result.currency).toBe("USD");
    });

    it("should throw on missing API key", async () => {
      await expect(
        createPaymentTool(
          { amount: 10000, currency: "PEN", orderId: "ORD-001" },
          { apiKey: "", environment: "sandbox" },
          MOCK_CONTEXT,
        ),
      ).rejects.toThrow("Izipay API key not configured");
    });

    it("should respect abort signal", async () => {
      const abortedContext: ToolPluginExecutionContext = {
        ...MOCK_CONTEXT,
        signal: { aborted: true, throwIfAborted: () => { throw new Error("Aborted"); } },
      };

      await expect(
        createPaymentTool(
          { amount: 10000, currency: "PEN", orderId: "ORD-001" },
          MOCK_CONFIG,
          abortedContext,
        ),
      ).rejects.toThrow("Aborted");
    });
  });

  describe("paymentStatusTool", () => {
    it("should get payment status", async () => {
      mockClient.getPaymentStatus.mockResolvedValueOnce({
        ...MOCK_PAYMENT_RESPONSE,
        status: "approved",
      });

      const result = await paymentStatusTool(
        { paymentId: "pay_abc123" },
        MOCK_CONFIG,
        MOCK_CONTEXT,
      );

      expect(result.paymentId).toBe("pay_abc123");
      expect(result.status).toBe("approved");
      expect(mockClient.getPaymentStatus).toHaveBeenCalledWith("pay_abc123");
    });

    it("should throw on empty paymentId", async () => {
      await expect(
        paymentStatusTool({ paymentId: "" }, MOCK_CONFIG, MOCK_CONTEXT),
      ).rejects.toThrow();
    });
  });

  describe("paymentDetailsTool", () => {
    it("should get payment details", async () => {
      mockClient.getPaymentDetails.mockResolvedValueOnce(MOCK_DETAILS_RESPONSE);

      const result = await paymentDetailsTool(
        { paymentId: "pay_abc123" },
        MOCK_CONFIG,
        MOCK_CONTEXT,
      );

      expect(result.paymentId).toBe("pay_abc123");
      expect(result.paymentMethod).toEqual({ type: "card", brand: "Visa", lastFour: "4242" });
      expect(result.fees?.total).toBe(450);
      expect(mockClient.getPaymentDetails).toHaveBeenCalledWith("pay_abc123");
    });
  });
});