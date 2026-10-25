import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import useGetEventsById from "@/hooks/api/event/useGetEventById";
import { createTransaction } from "@/services/transaction";
import { useGetMyPointBalance } from "@/hooks/api/useGetMyPointsBalance";
import { axiosInstance } from "@/lib/axios";

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

interface PublicVoucher {
  code: string;
  eventId: number;
  discountValue: number;
}

function TransactionPage() {
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const ticketId = Number(searchParams.get("ticketId"));
  const requestedQuantity = Number(searchParams.get("quantity") ?? 1);

  const { data: event, isLoading, isError } = useGetEventsById(eventId);

  const { data: pointBalance = 0, isLoading: isPointBalanceLoading } =
    useGetMyPointBalance();

  // Existing points and error states
  const [pointsInput, setPointsInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Voucher states
  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<PublicVoucher | null>(
    null,
  );
  const [voucherMessage, setVoucherMessage] = useState("");
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  const selectedTicket = event?.tickets.find(
    (ticket) => ticket.id === ticketId,
  );

  const quantity = Math.min(10, Math.max(1, requestedQuantity));

  const total = selectedTicket ? selectedTicket.price * quantity : 0;

  // Calculate voucher discount before applying points
  const voucherDiscount = appliedVoucher
    ? Math.floor((total * appliedVoucher.discountValue) / 100)
    : 0;

  const totalAfterVoucher = total - voucherDiscount;

  const pointsNumber = pointsInput === "" ? 0 : Number(pointsInput);

  const validPointsToUse = Math.min(
    Math.max(0, Math.floor(pointsNumber)),
    pointBalance,
    totalAfterVoucher,
  );

  const finalPrice = totalAfterVoucher - validPointsToUse;

  const createTransactionMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      navigate("/my-orders");
    },
    onError: (error) => {
      console.error(error);
      setErrorMessage(
        "We couldn't create your order. Please check ticket availability and your points balance, then try again.",
      );
    },
  });

  // Apply voucher
  const handleApplyVoucher = async () => {
    const code = voucherInput.trim().toUpperCase();

    if (!code) {
      setVoucherMessage("Please enter a voucher code.");
      return;
    }

    setIsApplyingVoucher(true);
    setVoucherMessage("");

    try {
      const response = await axiosInstance.get<{
        message: string;
        data: PublicVoucher[];
      }>("/vouchers/public");

      const voucher = response.data.data.find(
        (item) =>
          item.code.toUpperCase() === code && item.eventId === event?.id,
      );

      if (!voucher) {
        setAppliedVoucher(null);
        setVoucherMessage(
          "This voucher is invalid, expired, or unavailable for this event.",
        );
        return;
      }

      setAppliedVoucher(voucher);
      setVoucherMessage(
        `Voucher applied successfully! You save ${voucher.discountValue}%.`,
      );
    } catch (error) {
      console.error(error);
      setAppliedVoucher(null);
      setVoucherMessage("Unable to check the voucher. Please try again.");
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <p className="text-gray-600">Loading checkout...</p>
        </main>
      </>
    );
  }

  if (isError || !event) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
          <p className="text-gray-700">Unable to load this event.</p>

          <button
            type="button"
            onClick={() => navigate("/events")}
            className="mt-4 rounded-lg bg-teal-600 px-5 py-3 text-white hover:bg-teal-700"
          >
            Back to Events
          </button>
        </main>
      </>
    );
  }

  if (
    !selectedTicket ||
    !Number.isInteger(requestedQuantity) ||
    requestedQuantity < 1 ||
    requestedQuantity > 10
  ) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
          <p className="text-gray-700">
            Please select a valid ticket and quantity first.
          </p>

          <button
            type="button"
            onClick={() => navigate(`/events/${event.id}`)}
            className="mt-4 rounded-lg bg-teal-600 px-5 py-3 text-white hover:bg-teal-700"
          >
            Back to Event
          </button>
        </main>
      </>
    );
  }

  const isOutOfStock = selectedTicket.availableQuantity < quantity;

  const canCreateOrder =
    !createTransactionMutation.isPending &&
    !isOutOfStock &&
    !isPointBalanceLoading;

  return (
    <main className="min-h-screen bg-[#f0f1fb] text-slate-900">
      <header className="border-b border-gray-200 bg-white px-4 py-5 md:px-8">
        <div className="mx-auto max-w-7xl">
          <span className="text-xl font-bold tracking-tight text-teal-700 md:text-2xl">
            EVENT BOOKINGS
          </span>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:px-8 md:py-10 lg:grid-cols-[1.3fr_1fr] lg:gap-10">
        <section>
          <h1 className="border-b border-gray-300 pb-4 text-3xl font-semibold md:text-4xl">
            Checkout
          </h1>

          <p className="mb-6 mt-4 text-sm text-gray-600 md:text-base">
            Review your ticket details before creating your order.
          </p>

          <div className="rounded-2xl bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-4 text-xl font-bold">Attendee Details</h2>

            <p className="text-sm leading-6 text-gray-600 md:text-base">
              Your order will be associated with your signed-in account.
            </p>

            <p className="mt-4 text-sm leading-6 text-gray-500">
              After confirming, your order will appear in My Orders. Follow the
              payment instructions there to submit your payment proof.
            </p>
          </div>
        </section>

        <aside className="h-fit rounded-2xl bg-white p-5 shadow-lg md:rounded-3xl md:p-8">
          <div className="flex items-start gap-4">
            {event.image && (
              <img
                src={event.image}
                alt={event.name}
                className="h-20 w-24 shrink-0 rounded-lg object-cover md:h-24 md:w-28"
              />
            )}

            <div className="min-w-0">
              <h2 className="break-words font-bold md:text-lg">{event.name}</h2>

              <p className="mt-2 text-sm text-gray-500">
                {event.type === "ONLINE" ? "Online event" : event.city}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {new Date(event.startDate).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          <h3 className="mb-5 text-lg font-bold">Order Summary</h3>

          <div className="flex items-start justify-between gap-4 text-sm md:text-base">
            <span>
              {quantity} × {selectedTicket.name}
            </span>

            <span className="shrink-0 font-medium">{formatRupiah(total)}</span>
          </div>

          <div className="mt-5 flex justify-between gap-4 text-sm text-gray-600 md:text-base">
            <span>Subtotal</span>
            <span>{formatRupiah(total)}</span>
          </div>

          {/* Voucher section */}
          <div className="mt-5 rounded-xl border border-gray-200 p-4">
            <label htmlFor="voucherCode" className="font-medium">
              Have a voucher?
            </label>

            <div className="mt-3 flex gap-2">
              <input
                id="voucherCode"
                type="text"
                autoComplete="off"
                placeholder="Enter voucher code"
                value={voucherInput}
                disabled={!!appliedVoucher || isApplyingVoucher}
                onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-gray-100"
              />

              <button
                type="button"
                onClick={handleApplyVoucher}
                disabled={isApplyingVoucher || !!appliedVoucher}
                className="rounded-lg bg-teal-600 px-4 py-3 font-medium text-white hover:bg-teal-700 disabled:opacity-50"
              >
                {isApplyingVoucher ? "Checking..." : "Apply"}
              </button>
            </div>

            {voucherMessage && (
              <p
                role="status"
                className={`mt-2 text-sm ${
                  appliedVoucher ? "text-teal-700" : "text-red-600"
                }`}
              >
                {voucherMessage}
              </p>
            )}

            {appliedVoucher && (
              <button
                type="button"
                onClick={() => {
                  setAppliedVoucher(null);
                  setVoucherInput("");
                  setVoucherMessage("");
                }}
                className="mt-2 text-sm font-medium text-gray-500 hover:text-red-600"
              >
                Remove voucher
              </button>
            )}

            {appliedVoucher && (
              <div className="mt-3 flex justify-between gap-4 text-sm text-teal-700">
                <span>Voucher discount ({appliedVoucher.discountValue}%)</span>
                <span className="font-medium">
                  -{formatRupiah(voucherDiscount)}
                </span>
              </div>
            )}
          </div>

          {/* Existing points section */}
          <div className="mt-5 rounded-xl border border-gray-200 p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <label htmlFor="pointsToUse" className="font-medium">
                Use your points
              </label>

              <span className="text-sm text-teal-700">
                {isPointBalanceLoading
                  ? "Loading balance..."
                  : `${pointBalance.toLocaleString("id-ID")} points available`}
              </span>
            </div>

            <input
              id="pointsToUse"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="Enter points to use"
              value={pointsInput}
              disabled={isPointBalanceLoading || pointBalance <= 0}
              onChange={(e) => {
                const value = e.target.value
                  .replace(/\D/g, "")
                  .replace(/^0+(?=\d)/, "");

                setPointsInput(value);
              }}
              className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            />

            <p className="mt-2 text-xs leading-5 text-gray-500">
              1 point reduces your payment by Rp 1. Maximum usable:{" "}
              {Math.min(pointBalance, totalAfterVoucher).toLocaleString(
                "id-ID",
              )}{" "}
              points.
            </p>

            {pointsNumber > Math.min(pointBalance, totalAfterVoucher) && (
              <p className="mt-2 text-xs text-amber-700">
                Your applied points will be limited to the maximum allowed
                amount.
              </p>
            )}

            {validPointsToUse > 0 && (
              <div className="mt-3 flex justify-between gap-4 text-sm text-teal-700">
                <span>Points discount</span>
                <span className="font-medium">
                  -{formatRupiah(validPointsToUse)}
                </span>
              </div>
            )}
          </div>

          <hr className="my-5 border-gray-200" />

          <div className="flex items-center justify-between gap-4 text-xl font-bold">
            <span>Total</span>
            <span className="text-right">{formatRupiah(finalPrice)}</span>
          </div>

          {isOutOfStock && (
            <p className="mt-4 text-sm text-red-600">
              Not enough tickets are available for this quantity.
            </p>
          )}

          {errorMessage && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          <button
            type="button"
            disabled={!canCreateOrder}
            onClick={() => {
              setErrorMessage("");

              createTransactionMutation.mutate({
                ticketId: selectedTicket.id,
                quantity,
                pointsToUse: validPointsToUse,
                ...(appliedVoucher ? { voucherCode: appliedVoucher.code } : {}),
              });
            }}
            className="mt-7 w-full rounded-lg bg-teal-600 px-6 py-4 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createTransactionMutation.isPending
              ? "Creating order..."
              : isPointBalanceLoading
                ? "Loading points..."
                : isOutOfStock
                  ? "Tickets Unavailable"
                  : "Proceed to Payment"}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/events/${event.id}`)}
            className="mt-3 w-full rounded-lg py-3 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-teal-700"
          >
            Back to Event
          </button>
        </aside>
      </div>
    </main>
  );
}

export default TransactionPage;
