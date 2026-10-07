import { useAuth } from "@/stores/useAuth";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { LoginSchema } from "@/schemas/login";

export function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (values: LoginSchema) => {
      const { data } = await api.post("/auth/login", values);
      return data;
    },

    onSuccess: (data) => {
      login({ ...data.user, accessToken: data.accessToken });
      toast.success("Login successful");
      navigate("/");
    },

    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Login failed");
    },
  });
}
