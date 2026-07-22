import { Type } from "typebox";
export const CreatePaymentParamsSchema = Type.Object({
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
export const PaymentStatusParamsSchema = Type.Object({
    paymentId: Type.String({ minLength: 1, description: "Izipay payment ID returned from create payment" }),
}, { additionalProperties: false });
export const PaymentDetailsParamsSchema = Type.Object({
    paymentId: Type.String({ minLength: 1, description: "Izipay payment ID returned from create payment" }),
}, { additionalProperties: false });
export const CreatePaymentResultSchema = Type.Object({
    paymentId: Type.String({ description: "Izipay payment ID" }),
    status: Type.String({ description: "Payment status" }),
    paymentUrl: Type.Optional(Type.String({ format: "uri", description: "URL to redirect customer for payment" })),
    amount: Type.Number({ description: "Amount in cents" }),
    currency: Type.String({ description: "Currency code" }),
    orderId: Type.String({ description: "Merchant order ID" }),
    createdAt: Type.String({ description: "ISO 8601 creation timestamp" }),
});
export const PaymentStatusResultSchema = Type.Object({
    paymentId: Type.String(),
    status: Type.String(),
    amount: Type.Number(),
    currency: Type.String(),
    orderId: Type.String(),
    updatedAt: Type.String(),
});
export const PaymentDetailsResultSchema = Type.Object({
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
    metadata: Type.Optional(Type.Record(Type.String(), Type.String())),
});
//# sourceMappingURL=payment.js.map