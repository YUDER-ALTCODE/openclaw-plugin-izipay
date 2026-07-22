import { Type } from "typebox";
import { IzipayClient } from "../client/izipay-client.js";
const CreatePaymentParamsSchema = Type.Object({
    amount: Type.Number({ minimum: 1, description: "Amount in cents (e.g., 10000 = 100.00)" }),
    currency: Type.Union([Type.Literal("PEN"), Type.Literal("USD")]),
    orderId: Type.String({ minLength: 1, maxLength: 64, description: "Unique order identifier for your store" }),
    description: Type.Optional(Type.String({ maxLength: 255 })),
    customerEmail: Type.Optional(Type.String({ format: "email" })),
    customerPhone: Type.Optional(Type.String({ pattern: "^\\+?[1-9]\\d{1,14}$" })),
    returnUrl: Type.Optional(Type.String({ format: "uri" })),
    cancelUrl: Type.Optional(Type.String({ format: "uri" })),
    metadata: Type.Optional(Type.Record(Type.String(), Type.String())),
}, { additionalProperties: false });
const CreatePaymentResultSchema = Type.Object({
    paymentId: Type.String(),
    status: Type.String(),
    paymentUrl: Type.Optional(Type.String({ format: "uri" })),
    amount: Type.Number(),
    currency: Type.String(),
    orderId: Type.String(),
    createdAt: Type.String(),
});
export async function createPaymentTool(params, config, context) {
    context.signal?.throwIfAborted();
    const apiKey = config.apiKey ?? process.env.IZIPAY_API_KEY;
    if (!apiKey) {
        throw new Error("Izipay API key not configured. Set apiKey in plugin config or IZIPAY_API_KEY env var.");
    }
    const client = new IzipayClient({
        apiKey,
        environment: config.environment ?? "sandbox",
    });
    const request = {
        amount: params.amount,
        currency: params.currency,
        orderId: params.orderId,
        description: params.description,
        customerEmail: params.customerEmail,
        customerPhone: params.customerPhone,
        returnUrl: params.returnUrl,
        cancelUrl: params.cancelUrl,
        metadata: params.metadata,
    };
    const response = await client.createPayment(request);
    return {
        paymentId: response.paymentId,
        status: response.status,
        paymentUrl: response.paymentUrl,
        amount: response.amount,
        currency: response.currency,
        orderId: response.orderId,
        createdAt: response.createdAt,
    };
}
export const createPaymentToolDefinition = {
    name: "izipay_create_payment",
    label: "Create Izipay Payment",
    description: "Create a new payment request in Izipay. Returns payment ID and payment URL for customer redirection.",
    parameters: CreatePaymentParamsSchema,
    execute: createPaymentTool,
};
//# sourceMappingURL=create-payment.js.map