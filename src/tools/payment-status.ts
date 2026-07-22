import { Type, type Static } from "typebox";
import type { IzipayPluginConfig } from "../schemas/config.js";
import { IzipayClient } from "../client/izipay-client.js";
import type { ToolPluginExecutionContext } from "openclaw/plugin-sdk/tool-plugin";

const PaymentStatusParamsSchema = Type.Object({
  paymentId: Type.String({ minLength: 1, description: "Izipay payment ID returned from create payment" }),
}, { additionalProperties: false });

const PaymentStatusResultSchema = Type.Object({
  paymentId: Type.String(),
  status: Type.String(),
  amount: Type.Number(),
  currency: Type.String(),
  orderId: Type.String(),
  updatedAt: Type.String(),
});

export async function paymentStatusTool(
  params: Static<typeof PaymentStatusParamsSchema>,
  config: IzipayPluginConfig,
  context: ToolPluginExecutionContext,
): Promise<Static<typeof PaymentStatusResultSchema>> {
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

  const response = await client.getPaymentStatus(params.paymentId);

  return {
    paymentId: response.paymentId,
    status: response.status,
    amount: response.amount,
    currency: response.currency,
    orderId: response.orderId,
    updatedAt: response.updatedAt,
  };
}

export const paymentStatusToolDefinition = {
  name: "izipay_payment_status",
  label: "Get Izipay Payment Status",
  description: "Retrieve the current status of an Izipay payment by its ID.",
  parameters: PaymentStatusParamsSchema,
  execute: paymentStatusTool,
};
