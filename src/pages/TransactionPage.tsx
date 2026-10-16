import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import useGetEventsById from "@/hooks/api/event/useGetEventById";
import { createTransaction } from "@/services/transaction";
import { useGetMyPointBalance } from "@/hooks/api/useGetMyPointsBalance";

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

function TransactionPage() {
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const ticketId = Number(searchParams.get("ticketId"));
  const requestedQuantity = Number(searchParams.get("quantity") ?? 1);

  const { data: event, isLoading, isError } = useGetEventsById(eventId);

  const { data: pointBalance = 0, isLoading: isPointBalanceLoading } =
    useGetMyPointBalance();

  const [pointsToUse, setPointsToUse] = useState(0);

  const [errorMessage, setErrorMessage] = useState("");

  const selectedTicket = event?.tickets.find(
    (ticket) => ticket.id === ticketId,
  );

  const quantity = Math.min(10, Math.max(1, requestedQuantity));
  const total = selectedTicket ? selectedTicket.price * quantity : 0;
  const validPointsToUse = Math.min(
    Math.max(0, Math.floor(pointsToUse)),
    pointBalance,
    total,
  );

  const finalPrice = total - validPointsToUse;

  const createTransactionMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      navigate("/my-orders");
    },
    onError: (error) => {
      console.error(error);
      setErrorMessage(
        "We couldn't create your order. Please check ticket availability and try again.",
      );
    },
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-slate-50">
          Loading checkout...
        </main>
      </>
    );
  }

  if (isError || !event) {
    return (
      <>
        <Navbar />
        <main className="p-8 text-center">
          <p>Unable to load this event.</p>
          <button
            type="button"
            onClick={() => navigate("/events")}
            className="mt-4 rounded-lg bg-teal-600 px-5 py-3 text-white"
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
    requestedQuantity < 1
  ) {
    return (
      <>
        <Navbar />
        <main className="p-8 text-center">
          <p>Please select a valid ticket and quantity first.</p>
          <button
            type="button"
            onClick={() => navigate(`/events/${event.id}`)}
            className="mt-4 rounded-lg bg-teal-600 px-5 py-3 text-white"
          >
            Back to Event
          </button>
        </main>
      </>
    );
  }

  return (
    <main className="min-h-screen bg-[#f0f1fb] text-slate-900">
      <header className="border-b border-gray-200 bg-white px-6 py-5">
        <div className="mx-auto max-w-7xl">
          <span className="text-2xl font-bold tracking-tight text-teal-700">
            EVENT BOOKINGS
          </span>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1.3fr_1fr]">
        <section>
          <h1 className="mb-6 border-b border-gray-300 pb-5 text-4xl font-semibold">
            Checkout
          </h1>

          <p className="mb-6 text-gray-600">
            Review your ticket details before creating your order.
          </p>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Attendee Details</h2>

            <p className="text-gray-600">
              Your order will be associated with your signed-in account.
            </p>

            <p className="mt-4 text-sm text-gray-500">
              After confirming, your order will appear in My Orders. Follow the
              payment instructions there to submit your payment proof.
            </p>
          </div>
        </section>

        <aside className="h-fit rounded-3xl bg-white p-6 shadow-lg sm:p-8">
          <div className="flex gap-4">
            {event.image && (
              <img
                src={event.image}
                alt={event.name}
                className="h-24 w-28 rounded-lg object-cover"
              />
            )}

            <div>
              <h2 className="font-bold">{event.name}</h2>
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

          <div className="flex justify-between gap-4">
            <span>
              {quantity} × {selectedTicket.name}
            </span>
            <span className="font-medium">{formatRupiah(total)}</span>
          </div>

          <div className="mt-5 flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatRupiah(total)}</span>
          </div>
          <div className="mt-5 rounded-xl border border-gray-200 p-4">
            <div className="flex justify-between gap-4">
              <label htmlFor="pointsToUse" className="font-medium">
                Use your points
              </label>

              <span className="text-sm text-teal-700">
                {isPointBalanceLoading
                  ? "Loading..."
                  : `${pointBalance.toLocaleString("id-ID")} points available`}
              </span>
            </div>

            <input
              id="pointsToUse"
              type="number"
              min={0}
              max={Math.min(pointBalance, total)}
              step={1}
              value={pointsToUse}
              disabled={isPointBalanceLoading || pointBalance === 0}
              onChange={(e) => {
                const value = Number(e.target.value);

                setPointsToUse(
                  Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0,
                );
              }}
              className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-teal-500"
            />

            <p className="mt-2 text-xs text-gray-500">
              1 point reduces your payment by Rp 1. Maximum usable:{" "}
              {Math.min(pointBalance, total).toLocaleString("id-ID")} points.
            </p>

            {validPointsToUse > 0 && (
              <div className="mt-3 flex justify-between text-teal-700">
                <span>Points discount</span>
                <span>-{formatRupiah(validPointsToUse)}</span>
              </div>
            )}
          </div>

          <hr className="my-5 border-gray-200" />

          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>{formatRupiah(finalPrice)}</span>
          </div>

          {errorMessage && (
            <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
          )}

          <button
            type="button"
            disabled={
              createTransactionMutation.isPending ||
              selectedTicket.availableQuantity < quantity
            }
            onClick={() => {
              setErrorMessage("");
              createTransactionMutation.mutate({
                ticketId: selectedTicket.id,
                quantity,
                pointsToUse: validPointsToUse,
              });
            }}
            className="mt-7 w-full rounded-lg bg-teal-600 px-6 py-4 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createTransactionMutation.isPending
              ? "Creating order..."
              : "Proceed to Payment"}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/events/${event.id}`)}
            className="mt-3 w-full py-2 text-sm font-medium text-gray-500 hover:text-teal-700"
          >
            Back to Event
          </button>
        </aside>
      </div>
    </main>
  );
}

export default TransactionPage;
