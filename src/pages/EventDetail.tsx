import Navbar from "@/components/Navbar";
import useGetEventsById from "@/hooks/api/event/useGetEventById";
import { useNavigate, useParams } from "react-router-dom";

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: event, isLoading, isError } = useGetEventsById(id);

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
      <section className="mt-6 h-[70vh] w-full bg-gray-100">
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
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:px-12 md:py-16 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <div>
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
          {/* Back button */}
          <div className="mx-auto max-w-7xl px-6 pt-6 md:px-12">
            <button
              type="button"
              onClick={() => navigate("/events")}
              className="inline-flex items-center gap-2 font-semibold text-green-700 transition hover:text-green-800 py-40"
            >
              <span aria-hidden="true">←</span>
              Back to Events
            </button>
          </div>
        </div>

        {/* Event details and purchase button */}
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
            onClick={() => navigate(`/transaction/${event.id}`)}
            className="w-full rounded-lg bg-green-600 px-6 py-4 font-semibold text-white transition hover:bg-green-700"
          >
            Purchase Ticket
          </button>
        </aside>
      </section>
    </main>
  );
}

export default EventDetail;
