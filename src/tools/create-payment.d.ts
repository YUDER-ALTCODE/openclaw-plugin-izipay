import { Type, type Static } from "typebox";
import type { IzipayPluginConfig } from "../schemas/config.js";
import type { ToolPluginExecutionContext } from "openclaw/plugin-sdk/tool-plugin.js";
declare const CreatePaymentParamsSchema: Type.TObject<{
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
declare const CreatePaymentResultSchema: Type.TObject<{
    paymentId: Type.TString;
    status: Type.TString;
    paymentUrl: Type.TOptional<Type.TString>;
    amount: Type.TNumber;
    currency: Type.TString;
    orderId: Type.TString;
    createdAt: Type.TString;
}>;
export declare function createPaymentTool(params: Static<typeof CreatePaymentParamsSchema>, config: IzipayPluginConfig, context: ToolPluginExecutionContext): Promise<Static<typeof CreatePaymentResultSchema>>;
export declare const createPaymentToolDefinition: {
    name: string;
    label: string;
    description: string;
    parameters: Type.TObject<{
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
    execute: typeof createPaymentTool;
};
export {};
//# sourceMappingURL=create-payment.d.ts.map