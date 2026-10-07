import { useForm } from "react-hook-form";
import { useLogin } from "@/hooks/api/useLogin";
import { loginSchema, type LoginSchema } from "@/schemas/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function LoginPage() {
  const { register, handleSubmit, formState } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });
  const { mutate, isPending } = useLogin();

  const onSubmit = (values: LoginSchema) => {
    mutate(values);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#002F36] px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-5-bg-white p-8"
      >
        <h1 className="text-2xl font-bold">Login</h1>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {formState.errors.email && (
            <p className="text-sm text-red-500">
              {formState.errors.email.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} />
          {formState.errors.password && (
            <p className="text-sm text-red-500">
              {formState.errors.password.message}
            </p>
          )}
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Loading..." : "Login"}
        </Button>
        <p className="text-center text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-[#2bb3b3]">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
