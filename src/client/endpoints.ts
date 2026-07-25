export const IZIPAY_ENDPOINTS = {
  createPayment: "/api-payment/V4/Charge/CreatePayment",
} as const;

export const IZIPAY_SESSION_ENDPOINTS = {
  generateToken: "/security/v1/Token/Generate",
} as const;

export const IZIPAY_PAYMENT_LINK_ENDPOINTS = {
  generate: "/paymentlink/api/v1/process/generate",
} as const;
