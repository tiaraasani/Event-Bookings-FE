import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";

type ConfirmInput = {
  orderId: number;
  action: "accept" | "reject";
};

export function useConfirmTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, action }: ConfirmInput) => {
      const { data } = await axiosInstance.patch(
        `/organizer/transactions/${orderId}/${action}`,
      );
      return data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["organizer-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["organizer-statistics"] });
      queryClient.invalidateQueries({ queryKey: ["event-attendees"] });
      toast.success(data.message);
    },

    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data.message || "Failed to update transaction",
      );
    },
  });
}
