import { Type } from "typebox";
import { defineToolPlugin } from "openclaw/plugin-sdk/tool-plugin";
import { IzipayPluginConfigSchema, type IzipayPluginConfig } from "./src/schemas/config.js";
import { createPaymentToolDefinition } from "./src/tools/create-payment.js";
import { paymentStatusToolDefinition } from "./src/tools/payment-status.js";
import { paymentDetailsToolDefinition } from "./src/tools/payment-details.js";

const tools = (tool: any) => [
  tool(createPaymentToolDefinition),
  tool(paymentStatusToolDefinition),
  tool(paymentDetailsToolDefinition),
];

export default defineToolPlugin({
  id: "izipay",
  name: "Izipay Payments",
  description: "Integrate Izipay payment gateway for creating payments, checking status, and retrieving transaction details",
  configSchema: IzipayPluginConfigSchema,
  tools,
});

export { IzipayPluginConfigSchema };
export type { IzipayPluginConfig } from "./src/schemas/config.js";