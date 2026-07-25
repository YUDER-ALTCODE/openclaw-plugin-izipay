import { Type } from "typebox";
import { defineToolPlugin } from "openclaw/plugin-sdk/tool-plugin";
import { IzipayPluginConfigSchema, type IzipayPluginConfig } from "./src/schemas/config.js";
import { createPaymentToolDefinition } from "./src/tools/create-payment.js";
import { createPaymentLinkToolDefinition } from "./src/tools/create-payment-link.js";

const tools = (tool: any) => [
  tool(createPaymentToolDefinition),
  tool(createPaymentLinkToolDefinition),
];

export default defineToolPlugin({
  id: "izipay",
  name: "Izipay Payments",
  description: "Integrate Izipay payment gateway for creating payments, payment links, and generating form tokens",
  configSchema: IzipayPluginConfigSchema,
  tools,
});

export { IzipayPluginConfigSchema };
export type { IzipayPluginConfig } from "./src/schemas/config.js";
