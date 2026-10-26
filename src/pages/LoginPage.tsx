import { useForm } from "react-hook-form";
import { useLogin } from "@/hooks/api/useLogin";
import { loginSchema, type LoginSchema } from "@/schemas/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import PasswordInput from "@/components/PasswordInput";

function LoginPage() {
  const { register, handleSubmit, formState } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });
  const { mutate, isPending } = useLogin();

  const onSubmit = (values: LoginSchema) => {
    mutate(values);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your bookings and events."
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

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-brand-orange underline underline-offset-4 hover:text-brand-orange-dark"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            {...register("password")}
          />
          {formState.errors.password && (
            <p className="text-sm font-medium text-red-600">
              {formState.errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Signing in..." : "Login"}
        </Button>

        <p className="text-center text-sm text-brand-muted">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-brand-navy underline underline-offset-4 hover:text-brand-orange"
          >
            Register
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
