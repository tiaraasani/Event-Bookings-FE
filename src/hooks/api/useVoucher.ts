import { axiosInstance } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type Voucher = {
  id: number;
  eventId: number;
  code: string;
  discountValue: number;
  quota: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  event: {
    id: number;
    name: string;
    startDate?: string;
    endDate?: string;
  };
  _count?: {
    orders: number;
  };
};

export type CreateVoucherPayload = {
  eventId: number;
  code: string;
  discountValue: number;
  quota: number;
  startDate: string;
  endDate: string;
};

type UpdateVoucherPayload = Partial<Omit<CreateVoucherPayload, "eventId">>;

type ApiResponse<T> = {
  message: string;
  data: T;
};

function useGetMyVouchers() {
  return useQuery({
    queryKey: ["vouchers"],
    queryFn: async () => {
      const response =
        await axiosInstance.get<ApiResponse<Voucher[]>>("/vouchers");

      return response.data.data;
    },
  });
}

function useCreateVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateVoucherPayload) => {
      const response = await axiosInstance.post<ApiResponse<Voucher>>(
        "/vouchers",
        payload,
      );

      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      alert("Promotion created successfully!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      alert(error.response?.data.message || "Failed to create promotion.");
    },
  });
}

function useUpdateVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateVoucherPayload;
    }) => {
      const response = await axiosInstance.patch<ApiResponse<Voucher>>(
        `/vouchers/${id}`,
        data,
      );

      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      alert("Promotion updated successfully!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      alert(error.response?.data.message || "Failed to update promotion.");
    },
  });
}

function useDeleteVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await axiosInstance.delete(`/vouchers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      alert("Promotion deleted successfully!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      alert(error.response?.data.message || "Failed to delete promotion.");
    },
  });
}

export {
  useGetMyVouchers,
  useCreateVoucher,
  useUpdateVoucher,
  useDeleteVoucher,
};
