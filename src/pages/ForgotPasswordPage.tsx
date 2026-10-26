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
import AuthLayout from "@/components/AuthLayout";

function ForgotPasswordPage() {
  const { register, handleSubmit, formState } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const { mutate, isPending } = useForgotPassword();

  const onSubmit = (values: ForgotPasswordSchema) => {
    mutate(values);
  };

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a link to reset your password."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register("email")}
          />
          {formState.errors.email && (
            <p className="text-sm font-medium text-red-600">
              {formState.errors.email.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Sending..." : "Send reset link"}
        </Button>

        <p className="text-center text-sm text-brand-muted">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-brand-navy underline underline-offset-4 hover:text-brand-orange"
          >
            Return to login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
