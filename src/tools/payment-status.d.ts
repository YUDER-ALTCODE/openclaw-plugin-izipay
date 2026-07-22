import { Type, type Static } from "typebox";
import type { IzipayPluginConfig } from "../schemas/config.js";
import type { ToolPluginExecutionContext } from "openclaw/plugin-sdk/tool-plugin.js";
declare const PaymentStatusParamsSchema: Type.TObject<{
    paymentId: Type.TString;
}>;
declare const PaymentStatusResultSchema: Type.TObject<{
    paymentId: Type.TString;
    status: Type.TString;
    amount: Type.TNumber;
    currency: Type.TString;
    orderId: Type.TString;
    updatedAt: Type.TString;
}>;
export declare function paymentStatusTool(params: Static<typeof PaymentStatusParamsSchema>, config: IzipayPluginConfig, context: ToolPluginExecutionContext): Promise<Static<typeof PaymentStatusResultSchema>>;
export declare const paymentStatusToolDefinition: {
    name: string;
    label: string;
    description: string;
    parameters: Type.TObject<{
        paymentId: Type.TString;
    }>;
    execute: typeof paymentStatusTool;
};
export {};
//# sourceMappingURL=payment-status.d.ts.map