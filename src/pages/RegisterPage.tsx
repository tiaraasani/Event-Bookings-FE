import { Link } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/hooks/api/useRegister";
import { registerSchema, type RegisterSchema } from "@/schemas/register";
import AuthLayout from "@/components/AuthLayout";
import PasswordInput from "@/components/PasswordInput";
import { Select } from "@/components/ui/select";

function RegisterPage() {
  const { register, handleSubmit, formState, control, setValue } =
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
          <PasswordInput
            id="password"
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
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            placeholder="Repeat your password"
            {...register("confirmPassword")}
          />
          {formState.errors.confirmPassword && (
            <p className="text-sm font-medium text-red-600">
              {formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Register as</Label>
          <input type="hidden" {...register("role")} />
          <Select
            id="role"
            value={role}
            onValueChange={(v) =>
              setValue("role", v as RegisterSchema["role"], {
                shouldValidate: true,
              })
            }
            options={[
              { value: "CUSTOMER", label: "Customer" },
              { value: "ORGANIZER", label: "Organizer" },
            ]}
          />
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
