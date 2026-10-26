import { Link } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/hooks/api/useRegister";
import { registerSchema, type RegisterSchema } from "@/schemas/register";
import AuthLayout from "@/components/AuthLayout";

function RegisterPage() {
  const { register, handleSubmit, formState, control } =
    useForm<RegisterSchema>({
      resolver: zodResolver(registerSchema),
      defaultValues: { role: "CUSTOMER" },
    });

  const { mutate, isPending } = useRegister();
  const role = useWatch({ control, name: "role" });

  const onSubmit = (values: RegisterSchema) => {
    mutate(values);
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join as an attendee or start organizing your own events."
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Your full name"
            {...register("name")}
          />
          {formState.errors.name && (
            <p className="text-sm font-medium text-red-600">
              {formState.errors.name.message}
            </p>
          )}
        </div>

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
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a secure password"
            {...register("password")}
          />
          {formState.errors.password && (
            <p className="text-sm font-medium text-red-600">
              {formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Register as</Label>
          <select
            id="role"
            {...register("role")}
            className="h-11 w-full rounded-lg border border-brand-disabled/80 bg-white px-3.5 text-sm text-brand-text shadow-sm outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15"
          >
            <option value="CUSTOMER">Customer</option>
            <option value="ORGANIZER">Organizer</option>
          </select>
        </div>

        {role === "ORGANIZER" && (
          <div className="space-y-2">
            <Label htmlFor="organizationName">Organization name</Label>
            <Input
              id="organizationName"
              placeholder="Your organization name"
              {...register("organizationName")}
            />
          </div>
        )}

        {role === "CUSTOMER" && (
          <div className="space-y-2">
            <Label htmlFor="referralCode">Referral code (optional)</Label>
            <Input
              id="referralCode"
              placeholder="Enter a referral code"
              {...register("referralCode")}
            />
          </div>
        )}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Creating account..." : "Create account"}
        </Button>

        <p className="text-center text-sm text-brand-muted">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-brand-navy underline underline-offset-4 hover:text-brand-orange"
          >
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;
