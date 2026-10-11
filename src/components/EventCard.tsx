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

  return (
    <Link to={`/events/${event.id}`} className="group block">
      <article>
        <div className="relative h-52 overflow-hidden bg-gray-100">
          {event.image ? (
            <img
              src={event.image}
              alt={event.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-teal-50 text-xl font-bold text-teal-600">
              EVENT
            </div>
          )}

          <span className="absolute right-3 top-3 rounded bg-slate-900/80 px-3 py-2 text-sm text-white">
            {event.type === "ONLINE" ? "Online" : event.city}
          </span>

          <span className="absolute left-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-teal-500 text-xl text-white">
            ▣
          </span>
        </div>

        <div className="py-4">
          <h3 className="line-clamp-2 min-h-14 text-lg font-semibold text-gray-900 group-hover:text-teal-600">
            {event.name}
          </h3>

          <p className="mt-3 text-lg font-bold text-gray-900">{price}</p>

          <p className="mt-3 text-sm text-gray-500">
            {new Date(event.startDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </article>
    </Link>
  );
}

export default EventCard;
