import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { ResetPasswordSchema } from "@/schemas/reset-password";

export function useResetPassword(token: string | null) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (values: ResetPasswordSchema) => {
      const { data } = await axiosInstance.post(
        "/auth/reset-password",
        { password: values.password },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return data;
    },

    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/login");
    },

    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Failed to reset password");
    },
  });
}
