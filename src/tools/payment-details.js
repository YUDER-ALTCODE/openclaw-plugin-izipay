import { Type } from "typebox";
import { IzipayClient } from "../client/izipay-client.js";
const PaymentDetailsParamsSchema = Type.Object({
    paymentId: Type.String({ minLength: 1, description: "Izipay payment ID returned from create payment" }),
}, { additionalProperties: false });
const PaymentDetailsResultSchema = Type.Object({
    paymentId: Type.String(),
    status: Type.String(),
    amount: Type.Number(),
    currency: Type.String(),
    orderId: Type.String(),
    installments: Type.Optional(Type.Number()),
    paymentMethod: Type.Optional(Type.Object({
        type: Type.String(),
        brand: Type.Optional(Type.String()),
        lastFour: Type.Optional(Type.String()),
    })),
    fees: Type.Optional(Type.Object({
        total: Type.Number(),
        breakdown: Type.Array(Type.Object({
            type: Type.String(),
            amount: Type.Number(),
        })),
    })),
    refunds: Type.Optional(Type.Array(Type.Object({
        refundId: Type.String(),
        amount: Type.Number(),
        status: Type.String(),
        createdAt: Type.String(),
    }))),
    createdAt: Type.String(),
    updatedAt: Type.String(),
});
export async function paymentDetailsTool(params, config, context) {
    context.signal?.throwIfAborted();
    const apiKey = config.apiKey ?? process.env.IZIPAY_API_KEY;
    if (!apiKey) {
        throw new Error("Izipay API key not configured. Set apiKey in plugin config or IZIPAY_API_KEY env var.");
    }
    const client = new IzipayClient({
        apiKey,
        environment: config.environment ?? "sandbox",
    });
    const response = await client.getPaymentDetails(params.paymentId);
    return {
        paymentId: response.paymentId,
        status: response.status,
        amount: response.amount,
        currency: response.currency,
        orderId: response.orderId,
        installments: response.installments,
        paymentMethod: response.paymentMethod,
        fees: response.fees,
        refunds: response.refunds,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
    };
}
export const paymentDetailsToolDefinition = {
    name: "izipay_payment_details",
    label: "Get Izipay Payment Details",
    description: "Retrieve complete details of an Izipay payment including fees, payment method, and refunds.",
    parameters: PaymentDetailsParamsSchema,
    execute: paymentDetailsTool,
};
//# sourceMappingURL=payment-details.js.map