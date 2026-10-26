import { useGetEventAttendees } from "@/hooks/api/useGetEventAttendees";
import { getMyOrganizedEvents } from "@/services/event";
import GlobalPagination from "@/components/GlobalPagination";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const CARD =
  "rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm shadow-brand-navy/5";

function formatRupiah(amount: number) {
  return "Rp " + amount.toLocaleString("id-ID");
}

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EventAttendeesPage() {
  // The chosen event lives in the URL (?event=ID) so the page can be
  // refreshed, shared, or linked to from the event cards.
  const [searchParams, setSearchParams] = useSearchParams();
  const eventId = Number(searchParams.get("event")) || 0;

  const events = useQuery({
    queryKey: ["my-organized-events"],
    queryFn: getMyOrganizedEvents,
  });

  // Search box for the event list; filtering waits 300ms after typing stops
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const filteredEvents = (events.data ?? []).filter((event) =>
    event.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  // Page also lives in the URL; opening another event (?event=ID only)
  // naturally resets it to 1, so no effect is needed.
  const page = Number(searchParams.get("page")) || 1;
  const TAKE = 10;

  const setPage = (next: number) =>
    setSearchParams({ event: String(eventId), page: String(next) });

  const { data, isPending, isError, isPlaceholderData } = useGetEventAttendees(
    eventId,
    { page, take: TAKE },
  );

  const summaryCards = data
    ? [
        { label: "Attendees", value: data.summary.totalAttendees },
        { label: "Tickets", value: data.summary.totalTickets },
        { label: "Revenue", value: formatRupiah(data.summary.totalRevenue) },
      ]
    : [];

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
            Organizer dashboard
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
            Attendees
          </h1>
          <p className="mt-2 text-sm leading-6 text-brand-text">
            {eventId === 0
              ? "Pick an event to see who is attending."
              : "Customers whose payment has been confirmed."}
          </p>
        </div>

        {eventId === 0 ? (
          <div className="w-full sm:w-72">
            <label htmlFor="event-search" className="sr-only">
              Search events
            </label>
            <Input
              id="event-search"
              type="search"
              placeholder="Search your events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy underline underline-offset-4 transition hover:text-brand-orange"
          >
            <span aria-hidden="true">←</span>
            All events
          </button>
        )}
      </header>

      {eventId === 0 ? (
        // No event chosen yet: list every event so the organizer can click one.
        events.isPending ? (
          <p className="text-sm text-brand-muted">Loading your events...</p>
        ) : events.isError ? (
          <p className="text-sm font-medium text-red-600">
            Failed to load your events.
          </p>
        ) : (events.data ?? []).length === 0 ? (
          <div className={`${CARD} p-10 text-center`}>
            <p className="font-semibold text-brand-navy">No events yet</p>
            <p className="mt-2 text-sm text-brand-muted">
              Create an event first, then attendees will show up here.
            </p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className={`${CARD} p-10 text-center`}>
            <p className="font-semibold text-brand-navy">No events found</p>
            <p className="mt-2 text-sm text-brand-muted">
              No event name matches "{debouncedSearch}". Try another keyword.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredEvents.map((event) => (
              <Link
                key={event.id}
                to={`/organizer/attendees?event=${event.id}`}
                className={`${CARD} flex gap-4 transition hover:border-brand-orange hover:shadow-md hover:shadow-brand-navy/10`}
              >
                {event.image ? (
                  <img
                    src={event.image}
                    alt=""
                    className="size-16 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-brand-neutral text-xl font-extrabold text-brand-navy">
                    {event.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="line-clamp-2 font-semibold text-brand-navy">
                    {event.name}
                  </p>
                  <p className="mt-1 text-sm text-brand-muted">
                    {event.type === "ONLINE" ? "Online" : event.city} ·{" "}
                    {formatDate(event.startDate)}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-brand-orange">
                    View attendees
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )
      ) : isPending ? (
        <p className="text-sm text-brand-muted">Loading attendees...</p>
      ) : isError || !data ? (
        <p className="text-sm font-medium text-red-600">
          Failed to load attendees.
        </p>
      ) : (
        <>
          <div className="mb-5">
            <h2 className="text-lg font-bold text-brand-navy">
              {data.event.name}
            </h2>
            <p className="text-sm text-brand-muted">
              Starts {formatDate(data.event.startDate)}
            </p>
          </div>

          <div className="mb-5 grid gap-4 sm:grid-cols-3">
            {summaryCards.map((card) => (
              <div key={card.label} className={CARD}>
                <p className="text-sm font-medium text-brand-muted">
                  {card.label}
                </p>
                <p className="mt-2 break-words text-2xl font-extrabold text-brand-navy">
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          {data.attendees.length === 0 ? (
            <div className={`${CARD} p-10 text-center`}>
              <p className="font-semibold text-brand-navy">No attendees yet</p>
              <p className="mt-2 text-sm text-brand-muted">
                Paid attendees will appear here once payments are confirmed.
              </p>
            </div>
          ) : (
            <div
              className={`overflow-x-auto rounded-2xl border border-brand-navy/10 bg-white shadow-sm shadow-brand-navy/5 transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}
            >
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-brand-neutral/70 text-left text-xs font-bold uppercase tracking-wider text-brand-muted">
                  <tr>
                    <th className="w-12 px-4 py-3.5">No</th>
                    <th className="px-4 py-3.5">Name</th>
                    <th className="px-4 py-3.5">Ticket</th>
                    <th className="px-4 py-3.5">Qty</th>
                    <th className="px-4 py-3.5">Total Paid</th>
                    <th className="px-4 py-3.5">Paid At</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-brand-text">
                  {data.attendees.map((attendee, index) => (
                    <tr
                      key={attendee.orderId}
                      className="border-t border-brand-navy/10 transition hover:bg-brand-neutral/40"
                    >
                      <td className="px-4 py-3.5">
                        {(data.meta.page - 1) * data.meta.take + index + 1}
                      </td>
                      <td className="px-4 py-3.5">
                        <p>{attendee.name}</p>
                        <p className="mt-0.5 text-xs text-brand-muted">
                          {attendee.email}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">{attendee.ticketName}</td>
                      <td className="px-4 py-3.5">{attendee.quantity}</td>
                      <td className="px-4 py-3.5">
                        {formatRupiah(attendee.totalPaid)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5">
                        {formatDateTime(attendee.paidAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data.attendees.length > 0 && (
            <div className="mt-6">
              <GlobalPagination
                currentPage={data.meta.page}
                totalPage={Math.max(
                  1,
                  Math.ceil(data.meta.total / data.meta.take),
                )}
                onChangePage={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default EventAttendeesPage;
