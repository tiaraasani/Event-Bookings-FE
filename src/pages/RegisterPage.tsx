import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/hooks/api/useRegister";
import { registerSchema, type RegisterSchema } from "@/schemas/register";

function RegisterPage() {
  const { register, handleSubmit, formState, watch } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "CUSTOMER" },
  });

  const { mutate, isPending } = useRegister();
  const role = watch("role");

  const onSubmit = (values: RegisterSchema) => {
    mutate(values);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#002F36] px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-5 bg-white p-8"
      >
        <h1 className="text-2xl font-bold">Register</h1>

        <div className="space-y-2">
          <Label htmlFor="name">Nama</Label>
          <Input id="name" {...register("name")} />
          {formState.errors.name && (
            <p className="text-sm text-red-500">
              {formState.errors.name.message}
            </p>
          )}
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="role">Daftar sebagai</Label>
          <select
            id="role"
            {...register("role")}
            className="h-9 w-full rounded-md border px-3 text-sm"
          >
            <option value="CUSTOMER">Customer</option>
            <option value="ORGANIZER">Organizer</option>
          </select>
        </div>

        {role === "ORGANIZER" && (
          <div className="space-y-2">
            <Label htmlFor="organizationName">Nama organisasi</Label>
            <Input id="organizationName" {...register("organizationName")} />
          </div>
        )}

        {role === "CUSTOMER" && (
          <div className="space-y-2">
            <Label htmlFor="referralCode">Kode referral (opsional)</Label>
            <Input id="referralCode" {...register("referralCode")} />
          </div>
        )}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Loading..." : "Daftar"}
        </Button>

        <p className="text-center text-sm">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-semibold text-[#2bb3b3]">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
