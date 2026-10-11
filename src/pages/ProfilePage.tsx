import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import UpdateNameForm from "@/components/UpdateNameForm";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetProfile } from "@/hooks/api/useGetProfile";
import { useChangePassword } from "@/hooks/api/useChangePassword";
import {
  changePasswordSchema,
  type ChangePasswordSchema,
} from "@/schemas/change-password";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ProfilePage() {
  const { data: profile, isPending } = useGetProfile();

  const { register, handleSubmit, formState } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
  });
  const changePassword = useChangePassword();

  const onSubmitPassword = (values: ChangePasswordSchema) => {
    changePassword.mutate(values);
  };

  const copyReferral = () => {
    if (!profile) return;
    navigator.clipboard.writeText(profile.referralCode);
    toast.success("Kode referral disalin");
  };

  if (isPending) {
    return <p className="p-8">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="p-8">Failed to load profile.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="mx-auto max-w-3xl space-y-8 px-4 pb-16 pt-32">
        <section className="space-y-2 rounded-lg bg-white p-6">
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-gray-600">{profile.email}</p>
          <p className="text-sm text-gray-500">
            {profile.role} · joined {formatDate(profile.createdAt)}
          </p>
          {profile.organization && (
            <p className="text-sm">Organization: {profile.organization.name}</p>
          )}
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-white p-6">
            <p className="text-sm text-gray-500">Referral Code</p>
            <div className="flex items-center gap-3">
              <p className="text-xl font-bold">{profile.referralCode}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copyReferral}
              >
                Copy
              </Button>
            </div>
          </div>
          <div className="rounded-lg bg-white p-6">
            <p className="text-sm text-gray-500">Active Points</p>
            <p className="text-xl font-bold">
              {profile.pointBalance.toLocaleString("id-ID")}
            </p>
          </div>
        </section>

        <section className="rounded-lg bg-white p-6">
          <h2 className="mb-3 text-lg font-semibold">Active Coupons</h2>
          {profile.coupons.length === 0 ? (
            <p className="text-sm text-gray-500">No coupons yet.</p>
          ) : (
            <ul className="space-y-2">
              {profile.coupons.map((coupon) => (
                <li
                  key={coupon.id}
                  className="flex justify-between rounded border p-3 text-sm"
                >
                  <span className="font-mono font-semibold">{coupon.code}</span>
                  <span>Rp {coupon.discountValue.toLocaleString("id-ID")}</span>
                  <span className="text-gray-500">
                    until {formatDate(coupon.expiresAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-lg bg-white p-6">
          <UpdateNameForm currentName={profile.name} />
        </section>

        <section className="rounded-lg bg-white p-6">
          <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
            <h2 className="text-lg font-semibold">Change Password</h2>
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                {...register("currentPassword")}
              />
              {formState.errors.currentPassword && (
                <p className="text-sm text-red-500">
                  {formState.errors.currentPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                {...register("newPassword")}
              />
              {formState.errors.newPassword && (
                <p className="text-sm text-red-500">
                  {formState.errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
              />
              {formState.errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={changePassword.isPending}>
              {changePassword.isPending ? "Saving..." : "Change Password"}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;
