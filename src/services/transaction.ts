import { axiosInstance } from "@/lib/axios";

export interface Transaction {
  id: number;
  userId: number;
  ticketId: number;
  paymentStatus:
    | "WAITING_FOR_PAYMENT"
    | "WAITING_FOR_CONFIRMATION"
    | "PAID"
    | "REJECTED"
    | "EXPIRED"
    | "CANCELED";
  paymentProofUrl: string | null;
  quantity: number;
  total: number;
  finalPrice: number;
  createdAt: string;
  expiresAt: string | null;
  ticket: {
    id: number;
    name: string;
    price: number;
    event: {
      id: number;
      name: string;
      image: string | null;
      city: string;
      startDate: string;
      endDate: string;
      type: "VENUE" | "ONLINE";
      category?: {
        id: number;
        name: string;
      } | null;
      organization: {
        id: number;
      };
    };
  };
}

interface TransactionResponse {
  message: string;
  data: Transaction[];
}

export const getMyTransactions = async (): Promise<Transaction[]> => {
  const response =
    await axiosInstance.get<TransactionResponse>("/transactions/my");

  return response.data.data;
};

export const uploadPaymentProof = async (orderId: number, image: File) => {
  const formData = new FormData();
  formData.append("image", image);

  const response = await axiosInstance.post(
    `/transactions/${orderId}/payment-proof`,
    formData,
  );

  return response.data;
};

export const getMyOrganizedEvents = async () => {
  const response = await axiosInstance.get("/events/my");
  return response.data.data;
};

export interface CreateTransactionData {
  ticketId: number;
  quantity: number;
  pointsToUse?: number;
  voucherCode?: string;
}

export const createTransaction = async (data: CreateTransactionData) => {
  const response = await axiosInstance.post("/transactions", data);

  return response.data;
};

export const getMyPointBalance = async (): Promise<number> => {
  const response = await axiosInstance.get("/transactions/my/points");
  return response.data.data.balance;
};
