import { useGetMyTransactions } from "@/hooks/api/useGetMyTransaction";
import { uploadPaymentProof } from "@/services/transaction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case "PAID":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "WAITING_FOR_CONFIRMATION":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "WAITING_FOR_PAYMENT":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "REJECTED":
      return "bg-red-50 text-red-700 ring-red-200";
    case "EXPIRED":
    case "CANCELED":
      return "bg-brand-neutral text-brand-muted ring-brand-disabled/60";
    default:
      return "bg-brand-neutral text-brand-muted ring-brand-disabled/60";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "PAID":
      return "Paid";
    case "WAITING_FOR_CONFIRMATION":
      return "Waiting for confirmation";
    case "WAITING_FOR_PAYMENT":
      return "Waiting for payment";
    case "REJECTED":
      return "Rejected";
    case "EXPIRED":
      return "Expired";
    case "CANCELED":
      return "Canceled";
    default:
      return status.replaceAll("_", " ");
  }
};

function MyOrdersPage() {
  const {
    data: transactions,
    isPending,
    isError,
    error,
    refetch,
  } = useGetMyTransactions();

  const queryClient = useQueryClient();

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 15000);

    return () => clearInterval(interval);
  }, [refetch]);

  const [selectedImages, setSelectedImages] = useState<
    Record<number, File | undefined>
  >({});

  const [uploadErrors, setUploadErrors] = useState<Record<number, string>>({});

  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const paymentProofMutation = useMutation({
    mutationFn: ({ orderId, image }: { orderId: number; image: File }) =>
      uploadPaymentProof(orderId, image),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["my-transactions"],
      });

      setSelectedImages({});
      setUploadErrors({});
    },
  });

  if (isPending) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-brand-neutral px-4">
          <p className="text-brand-muted">Loading your orders...</p>
        </main>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-brand-neutral px-4">
          <div className="w-full max-w-lg rounded-3xl border border-brand-navy/10 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-extrabold text-brand-navy">
              My Orders
            </h1>

            <p className="mb-5 mt-3 text-sm font-medium text-red-600">
              {error instanceof Error
                ? error.message
                : "Failed to load your orders."}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-orange-dark"
            >
              Try again
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <main className="min-h-screen bg-brand-neutral pb-16">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
            Your account
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
            My Orders
          </h1>

          <p className="mt-2 text-sm text-brand-muted">
            View your event tickets and track your payments.
          </p>
        </div>

        {!transactions || transactions.length === 0 ? (
          <div className="rounded-3xl border border-brand-navy/10 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-brand-orange-soft text-3xl">
              🎟️
            </div>
            <h2 className="mt-5 text-xl font-bold text-brand-navy">
              No orders yet
            </h2>

            <p className="mt-2 text-sm text-brand-muted">
              When you book an event, your orders will appear here.
            </p>

            <Link
              to="/events"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-brand-orange px-5 text-sm font-semibold text-white transition hover:bg-brand-orange-dark"
            >
              Explore Events
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {transactions.map((order) => (
              <article
                key={order.id}
                className="overflow-hidden rounded-3xl border border-brand-navy/10 bg-white shadow-sm shadow-brand-navy/5"
              >
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start md:p-6">
                  {order.ticket.event.image ? (
                    <img
                      src={order.ticket.event.image}
                      alt={order.ticket.event.name}
                      className="h-48 w-full rounded-2xl object-cover sm:h-32 sm:w-44"
                    />
                  ) : (
                    <div className="flex h-32 w-full items-center justify-center rounded-2xl bg-brand-neutral text-brand-muted sm:w-44">
                      No event image
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                        Order #{order.id}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusStyle(
                          order.paymentStatus,
                        )}`}
                      >
                        {getStatusLabel(order.paymentStatus)}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-brand-navy">
                      {order.ticket.event.name}
                    </h2>

                    <p className="mt-1 text-sm text-brand-muted">
                      {order.ticket.event.city} ·{" "}
                      {order.ticket.event.type === "ONLINE"
                        ? "Online event"
                        : "Venue event"}
                    </p>

                    <p className="mt-3 text-sm text-brand-text">
                      Ticket:{" "}
                      <span className="font-semibold text-brand-navy">
                        {order.ticket.name}
                      </span>
                    </p>

                    <p className="mt-1 text-sm text-brand-text">
                      Quantity: {order.quantity}
                    </p>

                    <p className="mt-1 text-xs text-brand-muted">
                      Ordered on {formatDate(order.createdAt)}
                    </p>

                    {order.paymentStatus === "WAITING_FOR_PAYMENT" &&
                      order.expiresAt &&
                      (() => {
                        const remainingTime = Math.max(
                          0,
                          new Date(order.expiresAt).getTime() - currentTime,
                        );

                        const totalSeconds = Math.floor(remainingTime / 1000);
                        const hours = Math.floor(totalSeconds / 3600);
                        const minutes = Math.floor((totalSeconds % 3600) / 60);
                        const seconds = totalSeconds % 60;

                        return remainingTime > 0 ? (
                          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                            <p className="text-xs font-semibold text-amber-800">
                              Time remaining to pay
                            </p>

                            <p className="mt-1 font-mono text-xl font-bold text-amber-700">
                              {String(hours).padStart(2, "0")}:
                              {String(minutes).padStart(2, "0")}:
                              {String(seconds).padStart(2, "0")}
                            </p>

                            <p className="mt-1 text-xs text-amber-700">
                              Please upload your payment proof before the
                              deadline.
                            </p>
                          </div>
                        ) : (
                          <p className="mt-3 text-sm font-semibold text-red-600">
                            Payment deadline reached. Updating order status...
                          </p>
                        );
                      })()}
                  </div>

                  <div className="sm:min-w-44">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted sm:text-right">
                      Total payment
                    </p>

                    <p className="mt-1 text-xl font-extrabold text-brand-navy sm:text-right">
                      {formatRupiah(order.finalPrice)}
                    </p>

                    {order.paymentStatus === "WAITING_FOR_PAYMENT" && (
                      <div className="mt-4 space-y-3">
                        <label
                          htmlFor={`payment-proof-${order.id}`}
                          className="block text-sm font-medium text-brand-navy"
                        >
                          Upload payment proof
                        </label>

                        <input
                          id={`payment-proof-${order.id}`}
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            const image = event.target.files?.[0];

                            setSelectedImages((previous) => ({
                              ...previous,
                              [order.id]: image,
                            }));

                            setUploadErrors((previous) => ({
                              ...previous,
                              [order.id]: "",
                            }));
                          }}
                          className="block w-full rounded-lg border border-brand-disabled/80 bg-white text-sm text-brand-muted file:mr-3 file:rounded-l-lg file:border-0 file:bg-brand-orange-soft file:px-3 file:py-2.5 file:text-xs file:font-semibold file:text-brand-navy hover:file:bg-brand-orange/20"
                        />

                        {uploadErrors[order.id] && (
                          <p className="text-sm font-medium text-red-600">
                            {uploadErrors[order.id]}
                          </p>
                        )}

                        <button
                          type="button"
                          disabled={
                            !selectedImages[order.id] ||
                            paymentProofMutation.isPending
                          }
                          onClick={() => {
                            const image = selectedImages[order.id];

                            if (!image) {
                              setUploadErrors((previous) => ({
                                ...previous,
                                [order.id]: "Please select an image first.",
                              }));
                              return;
                            }

                            if (!image.type.startsWith("image/")) {
                              setUploadErrors((previous) => ({
                                ...previous,
                                [order.id]: "Please select an image file.",
                              }));
                              return;
                            }

                            if (image.size > 5 * 1024 * 1024) {
                              setUploadErrors((previous) => ({
                                ...previous,
                                [order.id]:
                                  "The image must be 5 MB or smaller.",
                              }));
                              return;
                            }

                            setUploadErrors((previous) => ({
                              ...previous,
                              [order.id]: "",
                            }));

                            paymentProofMutation.mutate({
                              orderId: order.id,
                              image,
                            });
                          }}
                          className="w-full rounded-lg bg-brand-orange px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-brand-orange/20 transition hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:bg-brand-disabled disabled:text-[#5b6b88] disabled:shadow-none"
                        >
                          {paymentProofMutation.isPending
                            ? "Uploading..."
                            : "Upload payment proof"}
                        </button>

                        {paymentProofMutation.isError && (
                          <p className="text-sm font-medium text-red-600">
                            Upload failed. Check the order deadline and try
                            again.
                          </p>
                        )}
                      </div>
                    )}

                    {order.paymentStatus === "WAITING_FOR_CONFIRMATION" && (
                      <p className="mt-3 text-sm text-blue-700">
                        Your payment proof has been submitted and is awaiting
                        confirmation.
                      </p>
                    )}

                    {order.paymentStatus === "PAID" && (
                      <p className="mt-3 text-sm font-medium text-emerald-700">
                        Payment completed. Your order is confirmed.
                      </p>
                    )}

                    {["REJECTED", "EXPIRED", "CANCELED"].includes(
                      order.paymentStatus,
                    ) && (
                      <p className="mt-3 text-sm text-brand-muted">
                        This order is no longer active. Status:{" "}
                        {getStatusLabel(order.paymentStatus)}.
                      </p>
                    )}

                    {order.paymentProofUrl && (
                      <a
                        href={order.paymentProofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-block text-sm font-semibold text-brand-navy underline underline-offset-4 hover:text-brand-orange"
                      >
                        View payment proof
                      </a>
                    )}
                  </div>
                </div>

                <div className="border-t border-brand-navy/10 bg-brand-neutral/40 px-5 py-3 md:px-6">
                  <p className="text-xs text-brand-muted">
                    Event date: {formatDate(order.ticket.event.startDate)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="pt-8">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy underline underline-offset-4 transition hover:text-brand-orange"
          >
            <span aria-hidden="true">←</span>
            Back to Profile
          </Link>
        </div>
      </div>
    </main>
  );
}

export default MyOrdersPage;
