import { axiosInstance } from "@/lib/axios";
import { useAuth } from "@/stores/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export function useUpdatePicture() {
  const { user, login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("picture", file);

      const { data } = await axiosInstance.patch("/profile/picture", formData);
      return data;
    },

    onSuccess: (data) => {
      if (user) {
        login({ ...user, picture: data.picture });
      }
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(data.message);
    },

    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Failed to update picture");
    },
  });
}
