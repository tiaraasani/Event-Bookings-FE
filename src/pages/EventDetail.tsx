import Navbar from "@/components/Navbar";
import useGetEventsById from "@/hooks/api/event/useGetEventById";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

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
        <div className="flex min-h-screen items-center justify-center bg-white text-gray-700">
          Loading event...
        </div>
      </>
    );
  }

  if (isError || !event) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white text-gray-700">
          <p>Failed to load event. Please try again.</p>
          <button
            type="button"
            onClick={() => navigate("/events")}
            className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
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
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* Event image */}
      <section className="mt-6 h-[40vh] w-full bg-gray-100 md:h-[70vh]">
        {event.image ? (
          <img
            src={event.image}
            alt={event.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-500">
            No event image available
          </div>
        )}
      </section>

      {/* Event information */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:min-h-[70vh] md:grid-cols-[1.5fr_1fr] md:gap-16 md:px-12 md:py-16">
        {/* Left column */}
        <div className="flex flex-col">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-700">
            {event.category?.name ?? "Event"}
          </p>

          <h1 className="mb-8 text-3xl font-bold leading-tight md:text-5xl">
            {event.name}
          </h1>

          <div className="mb-10 border-b border-gray-200 pb-8">
            <p className="mb-3 text-sm font-medium text-gray-500">
              Organized by
            </p>
            <h2 className="text-xl font-semibold">
              {event.organization?.name ?? "Event Organizer"}
            </h2>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-bold">About this event</h2>
            <p className="whitespace-pre-line leading-8 text-gray-600">
              {event.description || "No event description available."}
            </p>
          </div>

          {/* Back button pushed to the bottom */}
          <div className="mt-10 pt-6 md:mt-auto md:pt-10">
            <button
              type="button"
              onClick={() => navigate("/events")}
              className="inline-flex items-center gap-2 font-semibold text-green-700 transition hover:text-green-800"
            >
              <span aria-hidden="true">←</span>
              Back to Events
            </button>
          </div>
        </div>

        {/* Right column: Event details and purchase button */}
        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="mb-8 text-2xl font-bold">Event Details</h2>

          <div className="mb-7">
            <p className="mb-2 text-sm font-medium text-gray-500">Date</p>
            <p className="font-semibold">{date}</p>
          </div>

          <div className="mb-7">
            <p className="mb-2 text-sm font-medium text-gray-500">Time</p>
            <p className="font-semibold">
              {startTime} – {endTime}
            </p>
          </div>

          <div className="mb-8">
            <p className="mb-2 text-sm font-medium text-gray-500">Location</p>
            <p className="font-semibold">
              {event.type === "ONLINE" ? "Online Event" : event.city}
            </p>
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
            className="w-full rounded-lg bg-green-600 px-6 py-4 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Purchase Ticket
          </button>
        </aside>
      </section>

      {/* Ticket selection modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="bg-slate-800 p-5 text-white md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="break-words text-xl font-bold">
                    {event.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-300">
                    {event.type === "ONLINE" ? "Online event" : event.city}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="shrink-0 text-2xl text-white hover:text-teal-300"
                  aria-label="Close ticket selection"
                >
                  &times;
                </button>
              </div>

              <div className="mt-6 rounded-xl border border-teal-400 bg-teal-900/40 p-4">
                <p className="mb-2 font-semibold text-teal-300">
                  Select ticket
                </p>

                <select
                  value={selectedTicketId ?? ""}
                  onChange={(e) => {
                    setSelectedTicketId(Number(e.target.value));
                    setQuantity(1);
                  }}
                  className="w-full rounded-lg border border-slate-500 bg-slate-700 p-3 text-white"
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
                  <div className="p-8 text-center text-gray-500">
                    No tickets are currently available.
                  </div>
                );
              }

              return (
                <>
                  <div className="p-5 md:p-6">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div>
                        <h3 className="text-lg font-bold">{ticket.name}</h3>
                        <p className="mt-1 font-semibold text-teal-700">
                          {formatRupiah(ticket.price)}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {ticket.availableQuantity} tickets available
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          disabled={quantity <= 1}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-xl disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <span className="min-w-5 text-center font-semibold">
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
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-xl disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 border-t border-gray-200 p-5 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xl font-bold">
                        {formatRupiah(ticket.price * quantity)}
                      </p>
                      <p className="text-sm text-gray-500">
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
                      className="w-full rounded-lg bg-teal-600 px-8 py-3 font-semibold text-white hover:bg-teal-700 md:w-auto"
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
