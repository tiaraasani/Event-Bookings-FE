import type { User } from "@/types/user";
import { useAuthStore } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type LoginInput = { email: string; password: string };
type LoginResponse = { message: string; data: { user: User; token: string } };

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (input: LoginInput) => {
        const res = await api.post<LoginResponse>("/auth/login", input);
        return res.data.data;
    },

    onSuccess: ({ user, token }) => {
      setAuth(user, token);
      toast.success("Login successful");
      navigate("/");
    },

    onError: () => {
      toast.error("Login failed");
    }
  })
}
