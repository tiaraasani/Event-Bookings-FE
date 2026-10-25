import { useGetMyTransactions } from "@/hooks/api/useGetMyTransaction";
import { uploadPaymentProof } from "@/services/transaction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
      return "bg-green-100 text-green-700";
    case "WAITING_FOR_CONFIRMATION":
      return "bg-blue-100 text-blue-700";
    case "WAITING_FOR_PAYMENT":
      return "bg-amber-100 text-amber-700";
    case "REJECTED":
      return "bg-red-100 text-red-700";
    case "EXPIRED":
    case "CANCELED":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
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

  const [currentTime, setCurrentTime] = useState(Date.now());

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
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-6 text-3xl font-bold">My Orders</h1>
          <p className="text-gray-500">Loading your orders...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-4 text-3xl font-bold">My Orders</h1>

          <p className="mb-4 text-red-600">
            {error instanceof Error
              ? error.message
              : "Failed to load your orders."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg bg-teal-600 px-5 py-2 text-white hover:bg-teal-700"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="mb-2 font-medium text-teal-600">YOUR ACCOUNT</p>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            My Orders
          </h1>

          <p className="mt-2 text-gray-500">
            View your event tickets and track your payments.
          </p>
        </div>

        {!transactions || transactions.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              No orders yet
            </h2>

            <p className="mt-2 text-gray-500">
              When you book an event, your orders will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {transactions.map((order) => (
              <article
                key={order.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
                  {order.ticket.event.image ? (
                    <img
                      src={order.ticket.event.image}
                      alt={order.ticket.event.name}
                      className="h-48 w-full rounded-xl object-cover sm:h-32 sm:w-44"
                    />
                  ) : (
                    <div className="flex h-32 w-full items-center justify-center rounded-xl bg-gray-100 text-gray-400 sm:w-44">
                      No event image
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="text-sm text-gray-500">
                        Order #{order.id}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          order.paymentStatus,
                        )}`}
                      >
                        {getStatusLabel(order.paymentStatus)}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900">
                      {order.ticket.event.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {order.ticket.event.city} ·{" "}
                      {order.ticket.event.type === "ONLINE"
                        ? "Online event"
                        : "Venue event"}
                    </p>

                    <p className="mt-3 text-sm text-gray-600">
                      Ticket:{" "}
                      <span className="font-medium text-gray-900">
                        {order.ticket.name}
                      </span>
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      Quantity: {order.quantity}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
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
                          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                            <p className="text-sm font-medium text-amber-800">
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

                  <div className="sm:min-w-40">
                    <p className="text-sm text-gray-500 sm:text-right">
                      Total payment
                    </p>

                    <p className="mt-1 text-xl font-bold text-teal-700 sm:text-right">
                      {formatRupiah(order.finalPrice)}
                    </p>

                    {order.paymentStatus === "WAITING_FOR_PAYMENT" && (
                      <div className="mt-4 space-y-3">
                        <label
                          htmlFor={`payment-proof-${order.id}`}
                          className="block text-sm font-medium text-gray-700"
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
                          className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:font-medium file:text-teal-700 hover:file:bg-teal-100"
                        />

                        {uploadErrors[order.id] && (
                          <p className="text-sm text-red-600">
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
                          className="w-full rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {paymentProofMutation.isPending
                            ? "Uploading..."
                            : "Upload payment proof"}
                        </button>

                        {paymentProofMutation.isError && (
                          <p className="text-sm text-red-600">
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
                      <p className="mt-3 text-sm font-medium text-green-700">
                        Payment completed. Your order is confirmed.
                      </p>
                    )}

                    {["REJECTED", "EXPIRED", "CANCELED"].includes(
                      order.paymentStatus,
                    ) && (
                      <p className="mt-3 text-sm text-gray-600">
                        This order is no longer active. Status:{" "}
                        {getStatusLabel(order.paymentStatus)}.
                      </p>
                    )}

                    {order.paymentProofUrl && (
                      <a
                        href={order.paymentProofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-block text-sm font-medium text-teal-700 underline hover:text-teal-900"
                      >
                        View payment proof
                      </a>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-100 px-5 py-3">
                  <p className="text-xs text-gray-500">
                    Event date: {formatDate(order.ticket.event.startDate)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <div className="mx-auto max-w-7xl px-6 pt-6 md:px-12">
        <Link
          to="/profile"
          type="button"
          className="inline-flex items-center gap-2 font-semibold text-green-700 transition hover:text-green-800 py-40"
        >
          <span aria-hidden="true">←</span>
          Back to Profile
        </Link>
      </div>
    </main>
  );
}

export default MyOrdersPage;
