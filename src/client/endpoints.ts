export const IZIPAY_ENDPOINTS = {
  payments: "/v1/payments",
  paymentById: (paymentId: string) => `/v1/payments/${paymentId}`,
  paymentStatus: (paymentId: string) => `/v1/payments/${paymentId}/status`,
  paymentDetails: (paymentId: string) => `/v1/payments/${paymentId}/details`,
  refunds: (paymentId: string) => `/v1/payments/${paymentId}/refunds`,
  webhooks: "/v1/webhooks",
  health: "/v1/health",
} as const;