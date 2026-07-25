import { Type, type Static } from "typebox";
import type { IzipayPluginConfig } from "../schemas/config.js";
import { IzipayClient } from "../client/izipay-client.js";
import type {
  IzipayCreatePaymentLinkRequest,
  IzipayBillingOrShipping,
  IzipayCustomField,
  DocumentType,
  PaymentMethod,
  WayOfUse,
  LanguageUsed,
} from "../types/api.js";
import type { ToolPluginExecutionContext } from "openclaw/plugin-sdk/tool-plugin";

const BillingOrShippingSchema = Type.Object({
  firstName: Type.String({ minLength: 2, maxLength: 50 }),
  lastName: Type.String({ minLength: 2, maxLength: 50 }),
  email: Type.String({ format: "email", minLength: 5, maxLength: 50 }),
  phoneNumber: Type.String({ minLength: 7, maxLength: 15 }),
  street: Type.String({ minLength: 5, maxLength: 25 }),
  postalCode: Type.String({ minLength: 5, maxLength: 10 }),
  city: Type.String({ minLength: 3, maxLength: 40 }),
  state: Type.String({ minLength: 3, maxLength: 40 }),
  country: Type.String({ minLength: 2, maxLength: 2, description: "ISO country code (e.g., PE)" }),
  documentType: Type.Union([
    Type.Literal("DNI"),
    Type.Literal("CE"),
    Type.Literal("PASAPORTE"),
    Type.Literal("RUC"),
    Type.Literal("OTROS"),
  ]),
  document: Type.String({ minLength: 8, maxLength: 12 }),
});

const CustomFieldSchema = Type.Object({
  name: Type.Union([
    Type.Literal("field1"),
    Type.Literal("field2"),
    Type.Literal("field3"),
    Type.Literal("field4"),
    Type.Literal("field5"),
    Type.Literal("field6"),
    Type.Literal("field7"),
    Type.Literal("field8"),
    Type.Literal("field9"),
    Type.Literal("field10"),
  ]),
  value: Type.String({ minLength: 1, maxLength: 100 }),
});

const CreatePaymentLinkParamsSchema = Type.Object({
  merchantCode: Type.String({ minLength: 1, maxLength: 15, description: "Merchant code from Izipay" }),
  productDescription: Type.String({ minLength: 1, maxLength: 100, description: "Product description shown on the payment page" }),
  amount: Type.String({ description: "Amount with 2 decimals (e.g., '10.50')" }),
  currency: Type.Union([Type.Literal("PEN"), Type.Literal("USD")]),
  expirationDate: Type.String({ description: "Expiration date in format 'YYYY-MM-DD HH:mm:ss.fff' (e.g., '2024-12-31 23:59:00.000')" }),
  wayOfUse: Type.Union([Type.Literal("INDIVIDUAL"), Type.Literal("GENERAL")], {
    description: "INDIVIDUAL = single-use for one client, GENERAL = reusable for multiple clients",
  }),
  emailNotification: Type.Optional(Type.String({ format: "email", description: "Notification email (only for INDIVIDUAL links)" })),
  payMethod: Type.Union([Type.Literal("CARD"), Type.Literal("QR"), Type.Literal("YAPE_CODE"), Type.Literal("PAGO_PUSH")], {
    description: "Payment method to show",
  }),
  referenceCode: Type.Optional(Type.String({ minLength: 1, maxLength: 64, description: "Optional reference code" })),
  languageUsed: Type.Optional(Type.Union([Type.Literal("ESP"), Type.Literal("ENG")], { description: "Language for the payment form" })),
  urlTermsAndConditions: Type.Optional(Type.String({ description: "URL to your terms and conditions" })),
  urlIpn: Type.Optional(Type.String({ description: "IPN notification URL" })),
  billing: BillingOrShippingSchema,
  shipping: BillingOrShippingSchema,
  customFields: Type.Optional(Type.Array(CustomFieldSchema, { maxItems: 10 })),
}, { additionalProperties: false });

const CreatePaymentLinkResultSchema = Type.Object({
  status: Type.String(),
  paymentLinkId: Type.Optional(Type.String()),
  paymentUrl: Type.Optional(Type.String()),
  message: Type.Optional(Type.String()),
  amount: Type.Optional(Type.String()),
  currency: Type.Optional(Type.String()),
  expirationDate: Type.Optional(Type.String()),
  wayOfUse: Type.Optional(Type.String()),
  state: Type.Optional(Type.String()),
});

function generateTransactionId(): string {
  return `${Date.now()}${Math.random().toString(36).substring(2, 8)}`;
}

export async function createPaymentLinkTool(
  params: Static<typeof CreatePaymentLinkParamsSchema>,
  config: IzipayPluginConfig,
  context: ToolPluginExecutionContext,
): Promise<Static<typeof CreatePaymentLinkResultSchema>> {
  context.signal?.throwIfAborted();

  const username = config.username ?? process.env.IZIPAY_USERNAME;
  const password = config.password ?? process.env.IZIPAY_PASSWORD;
  const publicKey = config.publicKey ?? process.env.IZIPAY_PUBLIC_KEY;
  if (!username || !password) {
    throw new Error(
      "Izipay credentials not configured. Set username and password in plugin config or IZIPAY_USERNAME and IZIPAY_PASSWORD env vars.",
    );
  }
  if (!publicKey) {
    throw new Error(
      "Izipay public key not configured. Set publicKey in plugin config or IZIPAY_PUBLIC_KEY env var.",
    );
  }

  const client = new IzipayClient({
    username,
    password,
    publicKey,
    environment: config.environment ?? "sandbox",
  });

  const transactionId = generateTransactionId();

  const request: IzipayCreatePaymentLinkRequest = {
    merchantCode: params.merchantCode,
    productDescription: params.productDescription,
    amount: params.amount,
    currency: params.currency,
    expirationDate: params.expirationDate,
    wayOfUse: params.wayOfUse,
    email_Notification: params.emailNotification,
    payMethod: params.payMethod,
    referenceCode: params.referenceCode ?? `REF${Date.now()}`,
    languageUsed: params.languageUsed ?? "ESP",
    urL_Terms_and_Conditions:
      params.urlTermsAndConditions ??
      "https://www.izipay.pe/pdf/terminos-y-condiciones-formulario-pago",
    billing: params.billing,
    shipping: params.shipping,
    ...(params.urlIpn ? { urlIpn: params.urlIpn } : {}),
    ...(params.customFields ? { customFields: params.customFields } : {}),
  };

  const response = await client.createPaymentLink(request, transactionId);

  if (response.header.code !== "00") {
    throw new Error(
      `Payment link creation failed: ${response.header.messageFriendly ?? response.header.message ?? "Unknown error"} (code: ${response.header.code})`,
    );
  }

  return {
    status: response.header.message,
    paymentLinkId: response.response.paymentLinkId,
    paymentUrl: response.response.urL_PaymentLink,
    message: response.header.messageFriendly,
    amount: response.response.amount,
    currency: response.response.currency,
    expirationDate: response.response.expirationDate,
    wayOfUse: response.response.wayOfUse,
    state: response.response.state,
  };
}

export const createPaymentLinkToolDefinition = {
  name: "izipay_create_payment_link",
  label: "Create Izipay Payment Link",
  description:
    "Create a shareable payment link in Izipay. The link can be sent via WhatsApp, email, SMS, or any messaging channel. The customer clicks the link and pays directly on Izipay's secure page.",
  parameters: CreatePaymentLinkParamsSchema,
  execute: createPaymentLinkTool,
};
