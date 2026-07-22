export const IZIPAY_ENDPOINTS = {
    payments: "/v1/payments",
    paymentById: (paymentId) => `/v1/payments/${paymentId}`,
    paymentStatus: (paymentId) => `/v1/payments/${paymentId}/status`,
    paymentDetails: (paymentId) => `/v1/payments/${paymentId}/details`,
    refunds: (paymentId) => `/v1/payments/${paymentId}/refunds`,
    webhooks: "/v1/webhooks",
    health: "/v1/health",
};
//# sourceMappingURL=endpoints.js.map