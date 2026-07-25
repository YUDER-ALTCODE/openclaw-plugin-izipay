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

export interface IzipayGenerateSessionTokenRequest {
  requestSource: "ECOMMERCE" | "REFUND";
  merchantCode: string;
  orderNumber: string;
  publicKey: string;
  amount: string;
}

export interface IzipayGenerateSessionTokenResponse {
  code: string;
  message: string;
  response: {
    token: string;
  };
}

export type DocumentType = "DNI" | "CE" | "PASAPORTE" | "RUC" | "OTROS";

export type PaymentMethod = "CARD" | "QR" | "YAPE_CODE" | "PAGO_PUSH";

export type WayOfUse = "INDIVIDUAL" | "GENERAL";

export type LanguageUsed = "ESP" | "ENG";

export interface IzipayBillingOrShipping {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  street: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  documentType: DocumentType;
  document: string;
}

export interface IzipayCustomField {
  name: `field${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}`;
  value: string;
}

export interface IzipayCreatePaymentLinkRequest {
  merchantCode: string;
  productDescription: string;
  amount: string;
  currency: "PEN" | "USD";
  expirationDate: string;
  wayOfUse: WayOfUse;
  email_Notification?: string | null;
  payMethod: PaymentMethod;
  referenceCode: string;
  languageUsed: LanguageUsed;
  urL_Terms_and_Conditions?: string | null;
  urlIpn?: string;
  billing: IzipayBillingOrShipping;
  shipping: IzipayBillingOrShipping;
  customFields?: IzipayCustomField[];
}

export interface IzipayCreatePaymentLinkResponse {
  header: {
    transactionStartDatetime: string;
    transactionEndDatetime: string;
    millis: number;
    code: string;
    message: string;
    messageFriendly: string;
    statusCode: string;
  };
  response: {
    paymentLinkId: string;
    merchantCode: string;
    urL_PaymentLink: string;
    productDescription: string;
    amount: string;
    currency: string;
    expirationDate: string;
    wayOfUse: string;
    email_Notification: string;
    payMethod: string;
    referenceCode: string;
    languageUsed: string;
    urL_Terms_and_Conditions: string;
    urlIpn: string;
    billing: IzipayBillingOrShipping;
    shipping: IzipayBillingOrShipping;
    state: string;
  };
}
