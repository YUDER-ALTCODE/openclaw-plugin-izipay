import { Type, type Static } from "typebox";
export declare const CreatePaymentParamsSchema: Type.TObject<{
    amount: Type.TNumber;
    currency: Type.TUnion<[Type.TLiteral<"PEN">, Type.TLiteral<"USD">]>;
    orderId: Type.TString;
    description: Type.TOptional<Type.TString>;
    customerEmail: Type.TOptional<Type.TString>;
    customerPhone: Type.TOptional<Type.TString>;
    returnUrl: Type.TOptional<Type.TString>;
    cancelUrl: Type.TOptional<Type.TString>;
    metadata: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
}>;
export type CreatePaymentParams = Static<typeof CreatePaymentParamsSchema>;
export declare const PaymentStatusParamsSchema: Type.TObject<{
    paymentId: Type.TString;
}>;
export type PaymentStatusParams = Static<typeof PaymentStatusParamsSchema>;
export declare const PaymentDetailsParamsSchema: Type.TObject<{
    paymentId: Type.TString;
}>;
export type PaymentDetailsParams = Static<typeof PaymentDetailsParamsSchema>;
export declare const CreatePaymentResultSchema: Type.TObject<{
    paymentId: Type.TString;
    status: Type.TString;
    paymentUrl: Type.TOptional<Type.TString>;
    amount: Type.TNumber;
    currency: Type.TString;
    orderId: Type.TString;
    createdAt: Type.TString;
}>;
export type CreatePaymentResult = Static<typeof CreatePaymentResultSchema>;
export declare const PaymentStatusResultSchema: Type.TObject<{
    paymentId: Type.TString;
    status: Type.TString;
    amount: Type.TNumber;
    currency: Type.TString;
    orderId: Type.TString;
    updatedAt: Type.TString;
}>;
export type PaymentStatusResult = Static<typeof PaymentStatusResultSchema>;
export declare const PaymentDetailsResultSchema: Type.TObject<{
    paymentId: Type.TString;
    status: Type.TString;
    amount: Type.TNumber;
    currency: Type.TString;
    orderId: Type.TString;
    installments: Type.TOptional<Type.TNumber>;
    paymentMethod: Type.TOptional<Type.TObject<{
        type: Type.TString;
        brand: Type.TOptional<Type.TString>;
        lastFour: Type.TOptional<Type.TString>;
    }>>;
    fees: Type.TOptional<Type.TObject<{
        total: Type.TNumber;
        breakdown: Type.TArray<Type.TObject<{
            type: Type.TString;
            amount: Type.TNumber;
        }>>;
    }>>;
    refunds: Type.TOptional<Type.TArray<Type.TObject<{
        refundId: Type.TString;
        amount: Type.TNumber;
        status: Type.TString;
        createdAt: Type.TString;
    }>>>;
    createdAt: Type.TString;
    updatedAt: Type.TString;
    metadata: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
}>;
export type PaymentDetailsResult = Static<typeof PaymentDetailsResultSchema>;
//# sourceMappingURL=payment.d.ts.map