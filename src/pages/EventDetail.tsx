import EventReviews from "@/components/EventReviews";
import Navbar from "@/components/Navbar";
import useGetEventsById from "@/hooks/api/event/useGetEventById";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: event, isLoading, isError } = useGetEventsById(id);

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-brand-neutral text-brand-muted">
          Loading event...
        </div>
      </>
    );
  }

  if (isError || !event) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center gap-4 bg-brand-neutral px-4 text-center">
          <p className="font-medium text-brand-text">
            Failed to load event. Please try again.
          </p>
          <button
            type="button"
            onClick={() => navigate("/events")}
            className="rounded-lg bg-brand-orange px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-orange-dark"
          >
            Back to Events
          </button>
        </div>
      </>
    );
  }

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  const date = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const startTime = startDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const endTime = endDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="min-h-screen bg-brand-neutral pb-16">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 pt-6 md:px-8">
        <div className="relative h-[38vh] overflow-hidden rounded-[2rem] bg-brand-navy/10 shadow-sm md:h-[56vh]">
          {event.image ? (
            <img
              src={event.image}
              alt={event.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-brand-muted">
              No event image available
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-brand-navy/85 to-transparent p-5 pt-20 md:p-8 md:pt-28">
            <span className="rounded-full bg-brand-orange px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
              {event.category?.name ?? "Event"}
            </span>
            <p className="mt-3 text-sm font-medium text-white/80">
              {event.type === "ONLINE" ? "Online event" : event.city}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 md:px-8 md:py-12 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm shadow-brand-navy/5 md:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
            {event.category?.name ?? "Event"}
          </p>

          <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-brand-navy md:text-5xl">
            {event.name}
          </h1>

          <div className="mt-8 rounded-2xl bg-brand-neutral/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Organized by
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(`/organizers/${event.organization?.id}/reviews`)
              }
              disabled={!event.organization?.id}
              className="mt-2 text-left text-lg font-bold text-brand-navy underline-offset-4 transition hover:text-brand-orange hover:underline disabled:cursor-default disabled:no-underline"
            >
              {event.organization?.name ?? "Event Organizer"}
            </button>

            <p className="mt-1 text-xs text-brand-muted">
              Click to view organizer reviews
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-extrabold text-brand-navy">
              About this event
            </h2>
            <p className="mt-3 whitespace-pre-line leading-8 text-brand-text">
              {event.description || "No event description available."}
            </p>
          </div>

          <div className="mt-9 border-t border-brand-navy/10 pt-6">
            <button
              type="button"
              onClick={() => navigate("/events")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy underline underline-offset-4 transition hover:text-brand-orange"
            >
              <span aria-hidden="true">←</span>
              Back to Events
            </button>
          </div>
        </div>

        <aside className="h-fit rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-xl shadow-brand-navy/10 md:p-8 lg:sticky lg:top-24">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
            Event details
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-brand-navy">
            Plan your visit
          </h2>

          <div className="mt-6 space-y-3">
            <div className="rounded-2xl bg-brand-neutral/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                Date
              </p>
              <p className="mt-1.5 text-sm font-semibold text-brand-navy">
                {date}
              </p>
            </div>

            <div className="rounded-2xl bg-brand-neutral/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                Time
              </p>
              <p className="mt-1.5 text-sm font-semibold text-brand-navy">
                {startTime} – {endTime}
              </p>
            </div>

            <div className="rounded-2xl bg-brand-neutral/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                Location
              </p>
              <p className="mt-1.5 text-sm font-semibold text-brand-navy">
                {event.type === "ONLINE" ? "Online Event" : event.city}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedTicketId(event.tickets[0]?.id ?? null);
              setQuantity(1);
              setIsTicketModalOpen(true);
            }}
            disabled={
              !event.tickets?.some((ticket) => ticket.availableQuantity > 0)
            }
            className="mt-6 w-full rounded-xl bg-brand-orange px-6 py-4 text-sm font-bold text-white shadow-lg shadow-brand-orange/20 transition hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:bg-brand-disabled disabled:text-[#5b6b88] disabled:shadow-none"
          >
            Purchase Ticket
          </button>

          <p className="mt-3 text-center text-xs text-brand-muted">
            Secure checkout · Instant confirmation
          </p>
        </aside>
      </section>

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <EventReviews />
      </div>

      {isTicketModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-brand-navy/60 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="bg-brand-navy p-5 text-white md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="break-words text-xl font-extrabold text-white">
                    {event.name}
                  </h2>
                  <p className="mt-2 text-sm text-white/60">
                    {event.type === "ONLINE" ? "Online event" : event.city}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-2xl leading-none text-white transition hover:bg-brand-orange"
                  aria-label="Close ticket selection"
                >
                  &times;
                </button>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-orange">
                  Select ticket
                </p>

                <select
                  value={selectedTicketId ?? ""}
                  onChange={(e) => {
                    setSelectedTicketId(Number(e.target.value));
                    setQuantity(1);
                  }}
                  className="w-full rounded-xl border border-white/15 bg-brand-navy-dark p-3 text-sm text-white outline-none focus:border-brand-orange"
                >
                  {event.tickets
                    .filter((ticket) => ticket.availableQuantity > 0)
                    .map((ticket) => (
                      <option key={ticket.id} value={ticket.id}>
                        {ticket.name} — {formatRupiah(ticket.price)}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {(() => {
              const ticket = event.tickets.find(
                (item) => item.id === selectedTicketId,
              );

              if (!ticket) {
                return (
                  <div className="p-8 text-center text-brand-muted">
                    No tickets are currently available.
                  </div>
                );
              }

              return (
                <>
                  <div className="p-5 md:p-6">
                    <div className="flex flex-col justify-between gap-4 rounded-2xl bg-brand-neutral/70 p-4 md:flex-row md:items-center">
                      <div>
                        <h3 className="text-lg font-bold text-brand-navy">
                          {ticket.name}
                        </h3>
                        <p className="mt-1 font-extrabold text-brand-orange">
                          {formatRupiah(ticket.price)}
                        </p>
                        <p className="mt-1 text-sm text-brand-muted">
                          {ticket.availableQuantity} tickets available
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          disabled={quantity <= 1}
                          className="flex size-10 items-center justify-center rounded-full border border-brand-navy/20 bg-white text-xl font-semibold text-brand-navy transition hover:border-brand-navy disabled:cursor-not-allowed disabled:border-brand-disabled disabled:text-brand-disabled"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <span className="min-w-5 text-center font-bold text-brand-navy">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setQuantity((q) =>
                              Math.min(10, ticket.availableQuantity, q + 1),
                            )
                          }
                          disabled={
                            quantity >= Math.min(10, ticket.availableQuantity)
                          }
                          className="flex size-10 items-center justify-center rounded-full border border-brand-navy/20 bg-white text-xl font-semibold text-brand-navy transition hover:border-brand-navy disabled:cursor-not-allowed disabled:border-brand-disabled disabled:text-brand-disabled"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 border-t border-brand-navy/10 p-5 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xl font-extrabold text-brand-navy">
                        {formatRupiah(ticket.price * quantity)}
                      </p>
                      <p className="text-sm text-brand-muted">
                        {quantity} ticket{quantity > 1 ? "s" : ""}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        navigate(
                          `/transaction/${event.id}?ticketId=${ticket.id}&quantity=${quantity}`,
                        );
                      }}
                      className="w-full rounded-xl bg-brand-orange px-8 py-3 text-sm font-bold text-white shadow-lg shadow-brand-orange/20 transition hover:bg-brand-orange-dark md:w-auto"
                    >
                      Continue
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </main>
  );
}

export default EventDetail;
