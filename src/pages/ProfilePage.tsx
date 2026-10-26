import ConfirmDialog from "@/components/ConfirmDialog";
import Navbar from "@/components/Navbar";
import UpdateNameForm from "@/components/UpdateNameForm";
import UpdatePictureForm from "@/components/UpdatePictureForm";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePassword } from "@/hooks/api/useChangePassword";
import { useGetProfile } from "@/hooks/api/useGetProfile";
import {
  changePasswordSchema,
  type ChangePasswordSchema,
} from "@/schemas/change-password";
import { getMyTransactions } from "@/services/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type ProfileTab = "home" | "settings";

const TAB_BASE = "border-b-2 px-5 py-4 text-sm font-semibold transition";
const TAB_ACTIVE = "border-brand-orange text-brand-navy";
const TAB_INACTIVE =
  "border-transparent text-brand-muted hover:text-brand-navy";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("home");

  const { data: profile, isPending, isError } = useGetProfile();
  const isCustomer = profile?.role === "CUSTOMER";
  const isOrganizer = profile?.role === "ORGANIZER";

  const {
    data: transactions,
    isPending: isTransactionsPending,
    isError: isTransactionsError,
  } = useQuery({
    queryKey: ["my-transactions"],
    queryFn: getMyTransactions,
    enabled: isCustomer,
  });

  const { register, handleSubmit, formState, reset } =
    useForm<ChangePasswordSchema>({
      resolver: zodResolver(changePasswordSchema),
    });

  const changePassword = useChangePassword();

  const [pendingPassword, setPendingPassword] =
    useState<ChangePasswordSchema | null>(null);

  const onSubmitPassword = (values: ChangePasswordSchema) => {
    setPendingPassword(values);
  };

  const onConfirmPassword = () => {
    if (!pendingPassword) return;

    changePassword.mutate(pendingPassword, {
      onSuccess: () => {
        reset();
      },
      onSettled: () => setPendingPassword(null),
    });
  };

  const copyReferral = () => {
    if (!profile) return;

    navigator.clipboard
      .writeText(profile.referralCode)
      .then(() => toast.success("Referral code copied"))
      .catch(() => toast.error("Failed to copy referral code"));
  };

  if (isPending) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-brand-neutral">
          <p className="text-brand-muted">Loading profile...</p>
        </div>
      </>
    );
  }

  if (isError || !profile) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-brand-neutral px-4">
          <p className="text-brand-muted">
            Failed to load profile. Please try again.
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-brand-neutral text-brand-text">
      <Navbar />

      {/* Profile banner */}
      <section className="bg-brand-navy">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-10 sm:flex-row sm:items-center sm:px-10">
          {profile.picture ? (
            <img
              src={profile.picture}
              alt={profile.name}
              className="size-24 shrink-0 rounded-2xl border-4 border-white/20 object-cover shadow-lg"
            />
          ) : (
            <div className="flex size-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white/20 bg-brand-orange text-3xl font-extrabold text-white shadow-lg">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <p className="mb-2 text-sm text-white/55">
              Member since {formatDate(profile.createdAt)}
            </p>

            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              {profile.name}
            </h1>

            {profile.organization && (
              <p className="mt-2 text-white/70">{profile.organization.name}</p>
            )}

            <p className="mt-3 inline-flex rounded-full bg-brand-orange px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              {profile.role}
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 pb-16 sm:px-10">
        {/* Tabs */}
        <div className="relative z-10 -mt-7 mb-8 flex flex-wrap gap-2 rounded-2xl border border-brand-navy/10 bg-white px-2 shadow-lg shadow-brand-navy/10">
          <button
            type="button"
            onClick={() => setActiveTab("home")}
            className={`${TAB_BASE} ${
              activeTab === "home" ? TAB_ACTIVE : TAB_INACTIVE
            }`}
          >
            Home
          </button>

          {isCustomer && (
            <Link to="/my-orders" className={`${TAB_BASE} ${TAB_INACTIVE}`}>
              My Orders
            </Link>
          )}

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`${TAB_BASE} ${
              activeTab === "settings" ? TAB_ACTIVE : TAB_INACTIVE
            }`}
          >
            Settings
          </button>
        </div>

        {/* HOME TAB */}
        {activeTab === "home" && (
          <div className="space-y-8">
            {isOrganizer && (
              <section>
                <h2 className="mb-5 text-2xl font-bold text-brand-navy">
                  Your Organization
                </h2>

                <div className="flex flex-col gap-4 rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-brand-navy">
                      {profile.organization?.name ?? "Organizer dashboard"}
                    </p>
                    <p className="mt-1 text-sm text-brand-muted">
                      Manage events, confirm payments, and track sales from your
                      dashboard.
                    </p>
                  </div>
                  <Link
                    to="/organizer/dashboard"
                    className={buttonVariants({ className: "shrink-0" })}
                  >
                    Open dashboard
                  </Link>
                </div>
              </section>
            )}

            {/* Customer activity */}
            {isCustomer && (
              <section>
                <h2 className="mb-5 text-2xl font-bold text-brand-navy">
                  Your Activity
                </h2>

                <div className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold">
                    Attending Events
                  </h3>

                  {isTransactionsPending ? (
                    <p className="text-sm text-brand-muted">
                      Loading your bookings...
                    </p>
                  ) : isTransactionsError ? (
                    <p className="text-sm text-red-600">
                      Failed to load your bookings.
                    </p>
                  ) : !transactions || transactions.length === 0 ? (
                    <p className="text-sm text-brand-muted">
                      You haven't booked any events yet.
                    </p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {Array.from(
                        new Map(
                          transactions
                            .filter(
                              (transaction) =>
                                transaction.paymentStatus !== "REJECTED" &&
                                transaction.ticket?.event,
                            )
                            .map((transaction) => [
                              transaction.ticket.event.id,
                              transaction.ticket.event,
                            ]),
                        ).values(),
                      ).map((event) => {
                        const eventTransactions = transactions.filter(
                          (transaction) =>
                            transaction.ticket?.event?.id === event.id &&
                            transaction.paymentStatus !== "REJECTED",
                        );

                        return (
                          <div
                            key={event.id}
                            className="rounded-lg border border-brand-navy/10 p-4"
                          >
                            {event.image && (
                              <img
                                src={event.image}
                                alt={event.name}
                                className="mb-3 h-40 w-full rounded-lg object-cover"
                              />
                            )}

                            <h4 className="font-semibold">{event.name}</h4>

                            <p className="mt-1 text-sm text-brand-muted">
                              {event.category?.name ?? "Uncategorized"}
                            </p>

                            <p className="mt-1 text-sm text-brand-text">
                              {event.type === "ONLINE" ? "Online" : event.city}
                            </p>

                            <p className="mt-1 text-sm text-brand-text">
                              Starts: {formatDate(event.startDate)}
                            </p>

                            <div className="mt-3 border-t pt-3">
                              <p className="mb-2 text-sm font-medium">
                                Your Bookings
                              </p>

                              {eventTransactions.map((transaction) => (
                                <div
                                  key={transaction.id}
                                  className="mt-2 rounded-md bg-brand-neutral/60 p-3"
                                >
                                  <p className="text-sm text-brand-text">
                                    Ticket: {transaction.ticket.name}
                                  </p>

                                  <p className="text-sm text-brand-text">
                                    Quantity: {transaction.quantity}
                                  </p>

                                  <p className="text-sm text-brand-text">
                                    Status:{" "}
                                    <span className="font-semibold text-brand-navy">
                                      {transaction.paymentStatus.replaceAll(
                                        "_",
                                        " ",
                                      )}
                                    </span>
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            )}

            <section>
              <h2 className="mb-5 text-2xl font-bold text-brand-navy">
                Your Rewards
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm">
                  <p className="text-sm text-brand-muted">Referral Code</p>

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

                <div className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm">
                  <p className="text-sm text-brand-muted">Active Points</p>

                  <p className="mt-3 text-2xl font-bold">
                    {profile.pointBalance.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold">Active Coupons</h3>

                {profile.coupons.length === 0 ? (
                  <p className="text-sm text-brand-muted">No coupons yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {profile.coupons.map((coupon) => (
                      <li
                        key={coupon.id}
                        className="flex flex-col gap-2 rounded-lg border border-brand-navy/10 p-4 text-sm sm:flex-row sm:items-center sm:justify-between"
                      >
                        <span className="font-mono font-semibold">
                          {coupon.code}
                        </span>

                        <span>
                          Rp {coupon.discountValue.toLocaleString("id-ID")}
                        </span>

                        <span className="text-brand-muted">
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

        <ConfirmDialog
          open={pendingPassword !== null}
          title="Change your password?"
          description="You will need the new password the next time you login."
          confirmText="Change Password"
          isPending={changePassword.isPending}
          onConfirm={onConfirmPassword}
          onCancel={() => setPendingPassword(null)}
        />

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Email */}
            <section className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Email Address</h2>

              <p className="mt-2 text-sm text-brand-muted">
                Your account email address.
              </p>

              <div className="mt-4">
                <Input value={profile.email} readOnly />
              </div>

              <p className="mt-2 text-xs text-brand-muted">
                Email changes are not supported by the current profile API.
              </p>
            </section>
            <section className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Profile Picture</h2>

              <UpdatePictureForm
                currentPicture={profile.picture}
                name={profile.name}
              />
            </section>

            {/* Existing name update form */}
            <section className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Personal Information</h2>

              <UpdateNameForm currentName={profile.name} />
            </section>

            {/* Existing change-password functionality */}
            <section className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold">Password Settings</h2>

              <p className="mt-2 mb-6 text-sm text-brand-muted">
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
                    <p className="text-sm text-red-600">
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
                    <p className="text-sm text-red-600">
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
                    <p className="text-sm text-red-600">
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
        )}
      </main>
    </div>
  );
}

export default ProfilePage;
