import ConfirmDialog from "@/components/ConfirmDialog";
import Navbar from "@/components/Navbar";
import OrganizerTransactionsTable from "@/components/OrganizerTransactionsTable";
import UpdateNameForm from "@/components/UpdateNameForm";
import UpdatePictureForm from "@/components/UpdatePictureForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePassword } from "@/hooks/api/useChangePassword";
import { useGetProfile } from "@/hooks/api/useGetProfile";
import {
  changePasswordSchema,
  type ChangePasswordSchema,
} from "@/schemas/change-password";
import { deleteEvent, getMyOrganizedEvents } from "@/services/event";
import { getMyTransactions } from "@/services/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";

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
  const {
    data: organizedEvents,
    isPending: isOrganizedEventsPending,
    isError: isOrganizedEventsError,
  } = useQuery({
    queryKey: ["my-organized-events"],
    queryFn: getMyOrganizedEvents,
    enabled: isOrganizer,
  });

  const queryClient = useQueryClient();

  const deleteEventMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      toast.success("Event deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["my-organized-events"],
      });

      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
    },
    onError: () => {
      toast.error("Failed to delete event. Please try again.");
    },
  });
  const { register, handleSubmit, formState, reset } =
    useForm<ChangePasswordSchema>({
      resolver: zodResolver(changePasswordSchema),
    });

  const changePassword = useChangePassword();

  const [pendingPassword, setPendingPassword] =
    useState<ChangePasswordSchema | null>(null);
  const [eventToDelete, setEventToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

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
          {profile.picture ? (
            <img
              src={profile.picture}
              alt={profile.name}
              className="h-24 w-24 shrink-0 rounded-full border-4 border-white object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#BCE7DF] text-3xl font-bold text-[#147D74] shadow-sm">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}

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

          {profile?.role === "CUSTOMER" && (
            <Link
              to="/my-orders"
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`border-b-2 px-5 py-4 text-sm font-semibold transition ${
                activeTab === "orders"
                  ? "border-[#159E98] text-[#147D74]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              My Orders
            </Link>
          )}

          {profile?.role === "ORGANIZER" && (
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`border-b-2 px-5 py-4 text-sm font-semibold transition ${
                activeTab === "orders"
                  ? "border-[#159E98] text-[#147D74]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              My Transaction
            </button>
          )}

          {profile?.role === "ORGANIZER" && (
            <Link
              to="/organizer/dashboard"
              className="border-b-2 border-transparent px-5 py-4 text-sm font-semibold text-gray-500 transition hover:text-gray-800"
            >
              Dashboard
            </Link>
          )}
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

              {/* Organizer activity */}
              {isOrganizer && (
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold">
                    Organised Events
                  </h3>

                  {isOrganizedEventsPending ? (
                    <p className="text-sm text-gray-500">
                      Loading your events...
                    </p>
                  ) : isOrganizedEventsError ? (
                    <p className="text-sm text-red-500">
                      Failed to load your events.
                    </p>
                  ) : !organizedEvents || organizedEvents.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      You haven't organised any events yet.
                    </p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {organizedEvents.map((event: any) => (
                        <div
                          key={event.id}
                          className="rounded-lg border border-gray-100 p-4"
                        >
                          {event.image && (
                            <img
                              src={event.image}
                              alt={event.name}
                              className="mb-3 h-40 w-full rounded-lg object-cover"
                            />
                          )}

                          <h4 className="font-semibold">{event.name}</h4>

                          <p className="mt-1 text-sm text-gray-500">
                            {event.category?.name ?? "Uncategorized"}
                          </p>

                          <p className="mt-1 text-sm text-gray-600">
                            {event.type === "ONLINE" ? "Online" : event.city}
                          </p>

                          <p className="mt-1 text-sm text-gray-600">
                            Starts: {formatDate(event.startDate)}
                          </p>

                          <div className="mt-3 border-t pt-3">
                            <p className="mb-2 text-sm font-medium">
                              Ticket Availability
                            </p>

                            {event.tickets.map((ticket: any) => (
                              <p
                                key={ticket.id}
                                className="flex justify-between gap-3 text-sm"
                              >
                                <span>{ticket.name}</span>
                                <span className="text-[#147D74]">
                                  {ticket.availableQuantity} / {ticket.quantity}
                                </span>
                              </p>
                            ))}
                            <div className="mt-4 flex justify-center gap-4 text-sm font-semibold text-[#147D74]">
                              <Link
                                to={`/events/${event.id}/edit`}
                                className="underline"
                              >
                                Edit event
                              </Link>
                              <Link
                                to={`/organizer/events/${event.id}/attendees`}
                                className="underline"
                              >
                                View attendees
                              </Link>
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              className="mt-4 w-full"
                              disabled={deleteEventMutation.isPending}
                              onClick={() =>
                                setEventToDelete({
                                  id: event.id,
                                  name: event.name,
                                })
                              }
                            >
                              {deleteEventMutation.isPending
                                ? "Deleting..."
                                : "Delete Event"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Customer activity */}
              {isCustomer && (
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold">
                    Attending Events
                  </h3>

                  {isTransactionsPending ? (
                    <p className="text-sm text-gray-500">
                      Loading your bookings...
                    </p>
                  ) : isTransactionsError ? (
                    <p className="text-sm text-red-500">
                      Failed to load your bookings.
                    </p>
                  ) : !transactions || transactions.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      You haven't booked any events yet.
                    </p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {Array.from(
                        new Map(
                          transactions
                            .filter(
                              (transaction: any) =>
                                transaction.paymentStatus !== "REJECTED" &&
                                transaction.ticket?.event,
                            )
                            .map((transaction: any) => [
                              transaction.ticket.event.id,
                              transaction.ticket.event,
                            ]),
                        ).values(),
                      ).map((event: any) => {
                        const eventTransactions = transactions.filter(
                          (transaction: any) =>
                            transaction.ticket?.event?.id === event.id &&
                            transaction.paymentStatus !== "REJECTED",
                        );

                        return (
                          <div
                            key={event.id}
                            className="rounded-lg border border-gray-100 p-4"
                          >
                            {event.image && (
                              <img
                                src={event.image}
                                alt={event.name}
                                className="mb-3 h-40 w-full rounded-lg object-cover"
                              />
                            )}

                            <h4 className="font-semibold">{event.name}</h4>

                            <p className="mt-1 text-sm text-gray-500">
                              {event.category?.name ?? "Uncategorized"}
                            </p>

                            <p className="mt-1 text-sm text-gray-600">
                              {event.type === "ONLINE" ? "Online" : event.city}
                            </p>

                            <p className="mt-1 text-sm text-gray-600">
                              Starts: {formatDate(event.startDate)}
                            </p>

                            <div className="mt-3 border-t pt-3">
                              <p className="mb-2 text-sm font-medium">
                                Your Bookings
                              </p>

                              {eventTransactions.map((transaction: any) => (
                                <div
                                  key={transaction.id}
                                  className="mt-2 rounded-md bg-gray-50 p-3"
                                >
                                  <p className="text-sm text-gray-600">
                                    Ticket: {transaction.ticket.name}
                                  </p>

                                  <p className="text-sm text-gray-600">
                                    Quantity: {transaction.quantity}
                                  </p>

                                  <p className="text-sm text-gray-600">
                                    Status:{" "}
                                    <span className="font-semibold text-[#147D74]">
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
              )}
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

        {/* ORGANIZER TRANSACTIONS TAB */}
        {activeTab === "orders" && isOrganizer && (
          <div>
            <h2 className="mb-4 text-2xl font-bold">My Transactions</h2>
            <OrganizerTransactionsTable />
          </div>
        )}

        <ConfirmDialog
          open={eventToDelete !== null}
          title="Delete this event?"
          description={`"${eventToDelete?.name}" will be removed from the event list. This cannot be undone.`}
          confirmText="Delete"
          destructive
          isPending={deleteEventMutation.isPending}
          onConfirm={() => {
            if (!eventToDelete) return;
            deleteEventMutation.mutate(eventToDelete.id, {
              onSettled: () => setEventToDelete(null),
            });
          }}
          onCancel={() => setEventToDelete(null)}
        />

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
            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Profile Picture</h2>

              <UpdatePictureForm
                currentPicture={profile.picture}
                name={profile.name}
              />
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
