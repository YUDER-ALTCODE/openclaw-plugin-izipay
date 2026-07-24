export interface IzipayCreatePaymentRequest {
  amount: number;
  currency: "PEN" | "USD";
  orderId: string;
  customer?: {
    email?: string;
    billingDetails?: {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      identityType?: string;
      identityCode?: string;
      address?: string;
      country?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
  };
}

export interface IzipayCreatePaymentResponse {
  status: "SUCCESS" | "ERROR";
  answer?: {
    formToken?: string;
  };
  message?: string;
  code?: string;
}
