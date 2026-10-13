import { useState } from "react";
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

type ProfileTab = "home" | "orders" | "settings";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("home");
  const [orderId, setOrderId] = useState("");
  const [noOrderId, setNoOrderId] = useState(false);

  const { data: profile, isPending, isError } = useGetProfile();

  const { register, handleSubmit, formState, reset } =
    useForm<ChangePasswordSchema>({
      resolver: zodResolver(changePasswordSchema),
    });

  const changePassword = useChangePassword();

  const onSubmitPassword = (values: ChangePasswordSchema) => {
    changePassword.mutate(values, {
      onSuccess: () => {
        reset();
      },
    });
  };

  const copyReferral = () => {
    if (!profile) return;

    navigator.clipboard
      .writeText(profile.referralCode)
      .then(() => toast.success("Kode referral disalin"))
      .catch(() => toast.error("Gagal menyalin kode referral"));
  };

  if (isPending) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center bg-[#F7FAFA]">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </>
    );
  }

  if (isError || !profile) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center bg-[#F7FAFA]">
          <p className="text-gray-600">
            Failed to load profile. Please try again.
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFA] text-gray-800">
      <Navbar />

      {/* Profile banner */}
      <section className="bg-gradient-to-r from-[#DDF4F0] to-[#E8F5F5]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 pb-10 pt-28 sm:flex-row sm:items-center sm:px-10">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#BCE7DF] text-3xl font-bold text-[#147D74] shadow-sm">
            {profile.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="mb-2 text-sm text-gray-600">
              Member since {formatDate(profile.createdAt)}
            </p>

            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {profile.name}
            </h1>

            {profile.organization && (
              <p className="mt-2 text-gray-600">{profile.organization.name}</p>
            )}

            <p className="mt-2 text-sm font-medium text-[#147D74]">
              {profile.role}
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 pb-16 sm:px-10">
        {/* Tabs */}
        <div className="mb-8 flex flex-wrap gap-2 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab("home")}
            className={`border-b-2 px-5 py-4 text-sm font-semibold transition ${
              activeTab === "home"
                ? "border-[#159E98] text-[#147D74]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`border-b-2 px-5 py-4 text-sm font-semibold transition ${
              activeTab === "orders"
                ? "border-[#159E98] text-[#147D74]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            My Orders
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`border-b-2 px-5 py-4 text-sm font-semibold transition ${
              activeTab === "settings"
                ? "border-[#159E98] text-[#147D74]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Settings
          </button>
        </div>

        {/* HOME TAB */}
        {activeTab === "home" && (
          <div className="space-y-8">
            <section>
              <h2 className="mb-5 text-2xl font-bold text-gray-900">
                Your Activity
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#DDF4F0] text-xl text-[#147D74]">
                    ✦
                  </div>

                  <h3 className="text-lg font-semibold">Organised Events</h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Events you've organised will appear here.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#DDF4F0] text-xl text-[#147D74]">
                    ♧
                  </div>

                  <h3 className="text-lg font-semibold">Attending Events</h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Events you've booked will appear here.
                  </p>
                </div>
              </div>
            </section>

            {/* Existing rewards functionality */}
            <section>
              <h2 className="mb-5 text-2xl font-bold text-gray-900">
                Your Rewards
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  <p className="text-sm text-gray-500">Referral Code</p>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <p className="break-all text-xl font-bold">
                      {profile.referralCode}
                    </p>

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

                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  <p className="text-sm text-gray-500">Active Points</p>

                  <p className="mt-3 text-2xl font-bold">
                    {profile.pointBalance.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold">Active Coupons</h3>

                {profile.coupons.length === 0 ? (
                  <p className="text-sm text-gray-500">No coupons yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {profile.coupons.map((coupon) => (
                      <li
                        key={coupon.id}
                        className="flex flex-col gap-2 rounded-lg border border-gray-100 p-4 text-sm sm:flex-row sm:items-center sm:justify-between"
                      >
                        <span className="font-mono font-semibold">
                          {coupon.code}
                        </span>

                        <span>
                          Rp {coupon.discountValue.toLocaleString("id-ID")}
                        </span>

                        <span className="text-gray-500">
                          Expires {formatDate(coupon.expiresAt)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>
        )}

        {/* MY ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="mx-auto max-w-3xl space-y-6">
            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold">Find My Ticket</h2>

              <p className="mt-2 leading-6 text-gray-600">
                Enter your six-digit Order ID to look up your ticket.
              </p>

              <form
                className="mt-6 space-y-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  toast.info(
                    "Order lookup will be available when the transaction API is implemented.",
                  );
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="orderId">Order ID</Label>

                  <Input
                    id="orderId"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter your 6-digit Order ID"
                    value={orderId}
                    disabled={noOrderId}
                    onChange={(event) =>
                      setOrderId(
                        event.target.value.replace(/\D/g, "").slice(0, 6),
                      )
                    }
                  />
                </div>

                <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={noOrderId}
                    onChange={(event) => {
                      setNoOrderId(event.target.checked);
                      setOrderId("");
                    }}
                    className="mt-1 accent-[#159E98]"
                  />

                  <span>
                    I don't have my Order ID
                    <span className="mt-1 block text-gray-500">
                      You'll need an order lookup option to recover your
                      booking.
                    </span>
                  </span>
                </label>

                <Button
                  type="submit"
                  disabled={!noOrderId && orderId.length !== 6}
                  className="w-full bg-[#159E98] text-white hover:bg-[#117F7A]"
                >
                  Find My Ticket
                </Button>

                <p className="text-xs leading-5 text-gray-500">
                  Ticket searching is not connected yet. This button will become
                  functional when your team adds the order lookup API.
                </p>
              </form>
            </section>

            <section className="rounded-xl border border-[#D4EAE6] bg-[#EDF8F6] p-6">
              <h3 className="font-semibold text-gray-900">
                Need help with your tickets?
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Once ticket lookup is connected, you will be able to retrieve
                your booking details using your order information.
              </p>
            </section>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Email */}
            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Email Address</h2>

              <p className="mt-2 text-sm text-gray-500">
                Your account email address.
              </p>

              <div className="mt-4">
                <Input value={profile.email} readOnly />
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Email changes are not supported by the current profile API.
              </p>
            </section>

            {/* Existing name update form */}
            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Personal Information</h2>

              <UpdateNameForm currentName={profile.name} />
            </section>

            {/* Existing change-password functionality */}
            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold">Password Settings</h2>

              <p className="mt-2 mb-6 text-sm text-gray-500">
                Change your password to keep your account secure.
              </p>

              <form
                onSubmit={handleSubmit(onSubmitPassword)}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>

                  <Input
                    id="currentPassword"
                    type="password"
                    autoComplete="current-password"
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
                    autoComplete="new-password"
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
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                  />

                  {formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={changePassword.isPending}
                  className="bg-[#159E98] text-white hover:bg-[#117F7A]"
                >
                  {changePassword.isPending ? "Saving..." : "Change Password"}
                </Button>
              </form>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProfilePage;
