import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams } from "react-router-dom";
import { useResetPassword } from "@/hooks/api/useResetPassword";
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "@/schemas/reset-password";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/AuthLayout";

function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { register, handleSubmit, formState } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const { mutate, isPending } = useResetPassword(token);

  const onSubmit = (values: ResetPasswordSchema) => {
    mutate(values);
  };

  if (!token) {
    return (
      <AuthLayout
        title="Invalid reset link"
        subtitle="The reset token was not found. Request a new link to continue."
      >
        <Link
          to="/forgot-password"
          className="flex h-11 w-full items-center justify-center rounded-lg bg-brand-orange text-sm font-semibold text-white transition hover:bg-brand-orange-dark"
        >
          Request a new link
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a secure password to protect your account."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Enter your new password"
            {...register("password")}
          />
          {formState.errors.password && (
            <p className="text-sm font-medium text-red-600">
              {formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repeat your new password"
            {...register("confirmPassword")}
          />
          {formState.errors.confirmPassword && (
            <p className="text-sm font-medium text-red-600">
              {formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-brand-text">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="size-4 rounded border-brand-disabled accent-brand-orange"
          />
          Show password
        </label>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Saving..." : "Save new password"}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default ResetPasswordPage;
