import { axiosInstance } from "@/lib/axios";
import { useAuth } from "@/stores/useAuth";
import type { UpdateProfileSchema } from "@/schemas/update-profile";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export function useUpdateProfile() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  return useMutation({
    mutationFn: async (values: UpdateProfileSchema) => {
      const { data } = await axiosInstance.patch("/profile", values);
      return data;
    },

    onSuccess: (data, values) => {
      if (user) {
        login({ ...user, name: values.name });
      }
      toast.success(data.message);
      navigate("/");
    },

    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Failed to update profile");
    },
  });
}
