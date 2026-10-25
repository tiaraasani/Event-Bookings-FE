import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useForgotPassword } from "@/hooks/api/useForgotPassword";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "@/schemas/forgot-password";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function ForgotPasswordPage() {
  const { register, handleSubmit, formState } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const { mutate, isPending } = useForgotPassword();

  const onSubmit = (values: ForgotPasswordSchema) => {
    mutate(values);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#002F36] px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-5 rounded-lg bg-white p-8"
      >
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="text-sm text-gray-600">
          Enter your email, and we will send you a link to reset your password.
        </p>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {formState.errors.email && (
            <p className="text-sm text-red-500">
              {formState.errors.email.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Sending..." : "Send Reset Link"}
        </Button>

        <p className="text-center text-sm">
          <Link to="/login" className="font-semibold text-[#2bb3b3]">
            Return to Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
