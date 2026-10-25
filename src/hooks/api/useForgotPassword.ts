import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { ForgotPasswordSchema } from "@/schemas/forgot-password";

export function useForgotPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (values: ForgotPasswordSchema) => {
      const { data } = await axiosInstance.post("/auth/forgot-password", values);
      return data;
    },

    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/login");
    },

    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Failed to send email");
    },
  });
}
