import { axiosInstance } from "@/lib/axios";
import type { ChangePasswordSchema } from "@/schemas/change-password";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export function useChangePassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (values: ChangePasswordSchema) => {
      const { data } = await axiosInstance.patch("/profile/password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      return data;
    },

    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/");
    },

    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Failed to change password");
    },
  });
}
