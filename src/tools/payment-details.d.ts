import { Type, type Static } from "typebox";
import type { IzipayPluginConfig } from "../schemas/config.js";
import type { ToolPluginExecutionContext } from "openclaw/plugin-sdk/tool-plugin.js";
declare const PaymentDetailsParamsSchema: Type.TObject<{
    paymentId: Type.TString;
}>;
declare const PaymentDetailsResultSchema: Type.TObject<{
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
}>;
export declare function paymentDetailsTool(params: Static<typeof PaymentDetailsParamsSchema>, config: IzipayPluginConfig, context: ToolPluginExecutionContext): Promise<Static<typeof PaymentDetailsResultSchema>>;
export declare const paymentDetailsToolDefinition: {
    name: string;
    label: string;
    description: string;
    parameters: Type.TObject<{
        paymentId: Type.TString;
    }>;
    execute: typeof paymentDetailsTool;
};
export {};
//# sourceMappingURL=payment-details.d.ts.map