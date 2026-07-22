export interface IzipayCreatePaymentRequest {
    amount: number;
    currency: "PEN" | "USD";
    orderId: string;
    description?: string;
    customerEmail?: string;
    customerPhone?: string;
    returnUrl?: string;
    cancelUrl?: string;
    metadata?: Record<string, string>;
}
export interface IzipayPaymentResponse {
    paymentId: string;
    status: IzipayPaymentStatus;
    amount: number;
    currency: string;
    orderId: string;
    paymentUrl?: string;
    createdAt: string;
    updatedAt: string;
    metadata?: Record<string, string>;
}
export type IzipayPaymentStatus = "pending" | "processing" | "approved" | "declined" | "cancelled" | "refunded" | "expired";
export interface IzipayPaymentDetails extends IzipayPaymentResponse {
    installments?: number;
    paymentMethod?: {
        type: "card" | "yape" | "plin" | "banca_movil";
        brand?: string;
        lastFour?: string;
    };
    fees?: {
        total: number;
        breakdown: Array<{
            type: string;
            amount: number;
        }>;
    };
    refunds?: Array<{
        refundId: string;
        amount: number;
        status: string;
        createdAt: string;
    }>;
}
//# sourceMappingURL=api.d.ts.map