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

  const [pointsInput, setPointsInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
        <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-brand-neutral px-4">
          <p className="text-brand-muted">Loading checkout...</p>
        </main>
      </>
    );
  }

  if (isError || !event) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center bg-brand-neutral px-4 text-center">
          <p className="font-medium text-brand-text">
            Unable to load this event.
          </p>

          <button
            type="button"
            onClick={() => navigate("/events")}
            className="mt-4 rounded-lg bg-brand-orange px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-orange-dark"
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
        <main className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center bg-brand-neutral px-4 text-center">
          <p className="font-medium text-brand-text">
            Please select a valid ticket and quantity first.
          </p>

          <button
            type="button"
            onClick={() => navigate(`/events/${event.id}`)}
            className="mt-4 rounded-lg bg-brand-orange px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-orange-dark"
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
    <main className="min-h-screen bg-brand-neutral pb-16">
      <Navbar />

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:px-8 md:py-12 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
            Secure checkout
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy md:text-4xl">
            Checkout
          </h1>

          <p className="mb-6 mt-3 text-sm leading-6 text-brand-text md:text-base">
            Review your ticket details before creating your order.
          </p>

          <div className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm shadow-brand-navy/5 md:p-8">
            <h2 className="text-xl font-bold text-brand-navy">
              Attendee Details
            </h2>

            <p className="mt-3 text-sm leading-6 text-brand-text md:text-base">
              Your order will be associated with your signed-in account.
            </p>

            <p className="mt-3 rounded-xl bg-brand-neutral/80 px-4 py-3 text-sm leading-6 text-brand-muted">
              After confirming, your order will appear in My Orders. Follow the
              payment instructions there to submit your payment proof.
            </p>
          </div>

          <div className="mt-5 rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm shadow-brand-navy/5 md:p-8">
            <h2 className="text-lg font-bold text-brand-navy">
              Before you continue
            </h2>

            <ul className="mt-4 space-y-3 text-sm leading-6 text-brand-text">
              <li className="flex gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-orange-soft text-xs font-bold text-brand-orange-dark">
                  1
                </span>
                Confirm the ticket type and quantity in the order summary.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-orange-soft text-xs font-bold text-brand-orange-dark">
                  2
                </span>
                Upload your payment proof from My Orders once the order is
                created.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-orange-soft text-xs font-bold text-brand-orange-dark">
                  3
                </span>
                Your booking is confirmed after the organizer verifies payment.
              </li>
            </ul>
          </div>
        </section>

        <aside className="h-fit rounded-3xl border border-brand-navy/10 bg-white p-5 shadow-xl shadow-brand-navy/10 md:p-8 lg:sticky lg:top-24">
          <div className="flex items-start gap-4">
            {event.image && (
              <img
                src={event.image}
                alt={event.name}
                className="h-20 w-24 shrink-0 rounded-xl object-cover md:h-24 md:w-28"
              />
            )}

            <div className="min-w-0">
              <h2 className="break-words text-base font-bold text-brand-navy md:text-lg">
                {event.name}
              </h2>

              <p className="mt-2 text-sm text-brand-muted">
                {event.type === "ONLINE" ? "Online event" : event.city}
              </p>

              <p className="mt-1 text-sm text-brand-muted">
                {new Date(event.startDate).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <hr className="my-6 border-brand-navy/10" />

          <h3 className="mb-5 text-lg font-bold text-brand-navy">
            Order Summary
          </h3>

          <div className="flex items-start justify-between gap-4 text-sm md:text-base">
            <span className="text-brand-text">
              {quantity} × {selectedTicket.name}
            </span>

            <span className="shrink-0 font-semibold text-brand-navy">
              {formatRupiah(total)}
            </span>
          </div>

          <div className="mt-4 flex justify-between gap-4 text-sm text-brand-muted md:text-base">
            <span>Subtotal</span>
            <span className="font-medium text-brand-text">
              {formatRupiah(total)}
            </span>
          </div>

          <div className="mt-5 rounded-2xl border border-brand-navy/10 bg-brand-neutral/50 p-4">
            <label
              htmlFor="voucherCode"
              className="text-sm font-semibold text-brand-navy"
            >
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
                className="h-10 min-w-0 flex-1 rounded-lg border border-brand-disabled/80 bg-white px-3 text-sm text-brand-text outline-none transition placeholder:text-brand-muted/70 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15 disabled:bg-brand-disabled/30 disabled:text-brand-muted"
              />

              <button
                type="button"
                onClick={handleApplyVoucher}
                disabled={isApplyingVoucher || !!appliedVoucher}
                className="rounded-lg border border-brand-navy/25 bg-white px-4 py-2 text-sm font-semibold text-brand-navy transition hover:border-brand-navy hover:bg-brand-navy hover:text-white disabled:cursor-not-allowed disabled:border-transparent disabled:bg-brand-disabled disabled:text-[#5b6b88]"
              >
                {isApplyingVoucher ? "Checking..." : "Apply"}
              </button>
            </div>

            {voucherMessage && (
              <p
                role="status"
                className={`mt-2 text-sm font-medium ${
                  appliedVoucher ? "text-emerald-600" : "text-red-600"
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
                className="mt-2 text-xs font-semibold text-brand-muted underline underline-offset-4 hover:text-brand-orange"
              >
                Remove voucher
              </button>
            )}

            {appliedVoucher && (
              <div className="mt-3 flex justify-between gap-4 text-sm font-medium text-emerald-600">
                <span>Voucher discount ({appliedVoucher.discountValue}%)</span>
                <span>-{formatRupiah(voucherDiscount)}</span>
              </div>
            )}
          </div>

          <div className="mt-4 rounded-2xl border border-brand-navy/10 bg-brand-neutral/50 p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <label
                htmlFor="pointsToUse"
                className="text-sm font-semibold text-brand-navy"
              >
                Use your points
              </label>

              <span className="text-xs font-semibold text-brand-orange">
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
              className="mt-3 h-10 w-full rounded-lg border border-brand-disabled/80 bg-white px-3 text-sm text-brand-text outline-none transition placeholder:text-brand-muted/70 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15 disabled:cursor-not-allowed disabled:bg-brand-disabled/30 disabled:text-brand-muted"
            />

            <p className="mt-2 text-xs leading-5 text-brand-muted">
              1 point reduces your payment by Rp 1. Maximum usable:{" "}
              {Math.min(pointBalance, totalAfterVoucher).toLocaleString("id-ID")}{" "}
              points.
            </p>

            {pointsNumber > Math.min(pointBalance, totalAfterVoucher) && (
              <p className="mt-2 text-xs font-medium text-amber-700">
                Your applied points will be limited to the maximum allowed
                amount.
              </p>
            )}

            {validPointsToUse > 0 && (
              <div className="mt-3 flex justify-between gap-4 text-sm font-medium text-emerald-600">
                <span>Points discount</span>
                <span>-{formatRupiah(validPointsToUse)}</span>
              </div>
            )}
          </div>

          <hr className="my-5 border-brand-navy/10" />

          <div className="flex items-center justify-between gap-4 text-xl font-extrabold text-brand-navy">
            <span>Total</span>
            <span className="text-right">{formatRupiah(finalPrice)}</span>
          </div>

          {isOutOfStock && (
            <p className="mt-4 text-sm font-medium text-red-600">
              Not enough tickets are available for this quantity.
            </p>
          )}

          {errorMessage && (
            <p role="alert" className="mt-4 text-sm font-medium text-red-600">
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
            className="mt-6 w-full rounded-xl bg-brand-orange px-6 py-4 text-sm font-bold text-white shadow-lg shadow-brand-orange/20 transition hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:bg-brand-disabled disabled:text-[#5b6b88] disabled:shadow-none"
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
            className="mt-2 w-full rounded-xl border border-transparent py-3 text-sm font-semibold text-brand-muted transition hover:border-brand-navy/10 hover:bg-brand-neutral hover:text-brand-navy"
          >
            Back to Event
          </button>
        </aside>
      </div>
    </main>
  );
}

export default TransactionPage;
