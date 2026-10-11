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
      <div className="flex min-h-screen items-center justify-center bg-[#002F36] px-4">
        <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-8 text-center">
          <h1 className="text-2xl font-bold">Invalid link</h1>
          <p className="text-sm text-gray-600">
            The reset token was not found in the URL.
          </p>
          <Link to="/forgot-password" className="font-semibold text-[#2bb3b3]">
            Requesting a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#002F36] px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-5 rounded-lg bg-white p-8"
      >
        <h1 className="text-2xl font-bold">Reset Password</h1>

        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
          />
          {formState.errors.password && (
            <p className="text-sm text-red-500">
              {formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            {...register("confirmPassword")}
          />
          {formState.errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Show password
        </label>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Saving..." : "Save New Password"}
        </Button>
      </form>
    </div>
  );
}

export default ResetPasswordPage;
