export declare const IZIPAY_ENDPOINTS: {
    readonly payments: "/v1/payments";
    readonly paymentById: (paymentId: string) => string;
    readonly paymentStatus: (paymentId: string) => string;
    readonly paymentDetails: (paymentId: string) => string;
    readonly refunds: (paymentId: string) => string;
    readonly webhooks: "/v1/webhooks";
    readonly health: "/v1/health";
};
//# sourceMappingURL=endpoints.d.ts.map