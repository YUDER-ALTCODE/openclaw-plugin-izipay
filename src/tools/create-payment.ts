import { Type, type Static } from "typebox";
import type { IzipayPluginConfig } from "../schemas/config.js";
import { IzipayClient } from "../client/izipay-client.js";
import type { IzipayCreatePaymentRequest } from "../types/api.js";
import type { ToolPluginExecutionContext } from "openclaw/plugin-sdk/tool-plugin";

const CreatePaymentParamsSchema = Type.Object({
  amount: Type.Number({ minimum: 1, description: "Amount in cents (e.g., 10000 = 100.00)" }),
  currency: Type.Union([Type.Literal("PEN"), Type.Literal("USD")]),
  orderId: Type.String({ minLength: 1, maxLength: 64, description: "Unique order identifier for your store" }),
  customerEmail: Type.Optional(Type.String({ format: "email" })),
  customerFirstName: Type.Optional(Type.String()),
  customerLastName: Type.Optional(Type.String()),
  customerPhone: Type.Optional(Type.String()),
}, { additionalProperties: false });

const CreatePaymentResultSchema = Type.Object({
  status: Type.String(),
  formToken: Type.Optional(Type.String()),
  message: Type.Optional(Type.String()),
});

export async function createPaymentTool(
  params: Static<typeof CreatePaymentParamsSchema>,
  config: IzipayPluginConfig,
  context: ToolPluginExecutionContext,
): Promise<Static<typeof CreatePaymentResultSchema>> {
  context.signal?.throwIfAborted();

  const username = config.username ?? process.env.IZIPAY_USERNAME;
  const password = config.password ?? process.env.IZIPAY_PASSWORD;
  if (!username || !password) {
    throw new Error("Izipay credentials not configured. Set username and password in plugin config or IZIPAY_USERNAME and IZIPAY_PASSWORD env vars.");
  }

  const client = new IzipayClient({
    username,
    password,
    environment: config.environment ?? "sandbox",
  });

  const request: IzipayCreatePaymentRequest = {
    amount: params.amount,
    currency: params.currency,
    orderId: params.orderId,
    customer: {
      email: params.customerEmail,
      billingDetails: {
        firstName: params.customerFirstName,
        lastName: params.customerLastName,
        phoneNumber: params.customerPhone,
      },
    },
  };

  const response = await client.createPayment(request);

  if (response.status !== "SUCCESS") {
    throw new Error(`Payment creation failed: ${response.message ?? "Unknown error"}`);
  }

  return {
    status: response.status,
    formToken: response.answer?.formToken,
    message: response.message,
  };
}

export const createPaymentToolDefinition = {
  name: "izipay_create_payment",
  label: "Create Izipay Payment",
  description: "Create a new payment request in Izipay. Returns a formToken to use with the Izipay JavaScript SDK.",
  parameters: CreatePaymentParamsSchema,
  execute: createPaymentTool,
};
