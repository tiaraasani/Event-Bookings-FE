import { api } from "@/lib/api";
import type { RegisterSchema } from "@/schemas/register";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (values: RegisterSchema) => {
      await api.post("/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        referralCode: values.referralCode || undefined,
        organizationName: values.organizationName || undefined,
      });
    },
    onSuccess: () => {
      toast.success("Register successful. Please login.");
      navigate("/login");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Register failed");
    },
  });
}
