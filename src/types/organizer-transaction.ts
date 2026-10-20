export type PaymentStatus =
  | "WAITING_FOR_PAYMENT"
  | "WAITING_FOR_CONFIRMATION"
  | "PAID"
  | "REJECTED"
  | "EXPIRED"
  | "CANCELED";

export type OrganizerTransaction = {
  id: number;
  paymentStatus: PaymentStatus;
  paymentProofUrl: string | null;
  quantity: number;
  total: number;
  pointsUsed: number;
  discount: number;
  finalPrice: number;
  createdAt: string;
  paidAt: string | null;
  user: {
    id: number;
    name: string;
    email: string;
  };
  ticket: {
    id: number;
    name: string;
    price: number;
    event: {
      id: number;
      name: string;
      startDate: string;
    };
  };
};
