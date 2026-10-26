import type { Event } from "@/types/Events";
import { Link } from "react-router-dom";

interface EventCardProps {
  event: Event;
}

function EventCard({ event }: EventCardProps) {
  const lowestPrice =
    event.tickets.length > 0
      ? Math.min(...event.tickets.map((ticket) => ticket.price))
      : null;

  const price =
    lowestPrice === null
      ? "Tickets unavailable"
      : lowestPrice === 0
        ? "Free"
        : `Rp ${lowestPrice.toLocaleString("id-ID")}`;

  const formattedDate = new Date(event.startDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link to={`/events/${event.id}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-brand-navy/10 bg-white shadow-sm shadow-brand-navy/5 transition duration-200 hover:-translate-y-1 hover:border-brand-orange/35 hover:shadow-xl hover:shadow-brand-navy/10">
        <div className="relative h-52 overflow-hidden bg-brand-neutral">
          {event.image ? (
            <img
              src={event.image}
              alt={event.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-brand-neutral text-xl font-bold tracking-widest text-brand-navy/40">
              EVENT
            </div>
          )}

          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-brand-navy shadow-sm backdrop-blur">
            {event.type === "ONLINE" ? "Online" : event.city}
          </span>

          <span className="absolute right-3 top-3 rounded-lg bg-brand-orange px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white shadow-sm shadow-brand-orange/20">
            {event.category?.name ?? "Event"}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-orange">
            {formattedDate}
          </p>

          <h3 className="mt-2 line-clamp-2 min-h-14 text-lg font-bold leading-snug text-brand-navy transition-colors group-hover:text-brand-orange-dark">
            {event.name}
          </h3>

          <div className="mt-auto flex items-end justify-between gap-3 border-t border-brand-navy/10 pt-4">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-brand-muted">
                Starting from
              </p>
              <p className="mt-0.5 text-lg font-extrabold text-brand-navy">
                {price}
              </p>
            </div>

            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-neutral text-brand-navy transition group-hover:bg-brand-orange group-hover:text-white">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default EventCard;
