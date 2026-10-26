import ConfirmDialog from "@/components/ConfirmDialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { deleteEvent, getMyOrganizedEvents } from "@/services/event";
import type { Event } from "@/types/Events";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const CARD =
  "rounded-2xl border border-brand-navy/10 bg-white shadow-sm shadow-brand-navy/5";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function eventStatus(event: Event) {
  const now = Date.now();
  const start = new Date(event.startDate).getTime();
  const end = new Date(event.endDate).getTime();

  if (now < start)
    return { label: "Upcoming", style: "bg-blue-50 text-blue-700 ring-blue-200" };
  if (now > end)
    return {
      label: "Ended",
      style: "bg-brand-neutral text-brand-muted ring-brand-disabled/60",
    };
  return {
    label: "Ongoing",
    style: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };
}

function OrganizerEventsPage() {
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery({
    queryKey: ["my-organized-events"],
    queryFn: getMyOrganizedEvents,
  });

  const [eventToDelete, setEventToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      toast.success("Event deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["my-organized-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: () => {
      toast.error("Failed to delete event. Please try again.");
    },
  });

  const events = data ?? [];

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
            Organizer dashboard
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
            My Events
          </h1>
          <p className="mt-2 text-sm leading-6 text-brand-text">
            Everything you have published, with seats left per ticket.
          </p>
        </div>

        <Link to="/events/create" className={buttonVariants()}>
          + Create event
        </Link>
      </header>

      {isPending ? (
        <p className="text-sm text-brand-muted">Loading your events...</p>
      ) : isError ? (
        <p className="text-sm font-medium text-red-600">
          Failed to load your events.
        </p>
      ) : events.length === 0 ? (
        <div className={`${CARD} p-10 text-center`}>
          <p className="font-semibold text-brand-navy">No events yet</p>
          <p className="mt-2 text-sm text-brand-muted">
            Create your first event to start selling tickets.
          </p>
          <Link
            to="/events/create"
            className={buttonVariants({ className: "mt-5" })}
          >
            Create event
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => {
            const status = eventStatus(event);
            return (
              <article
                key={event.id}
                className={`${CARD} flex flex-col overflow-hidden`}
              >
                <div className="relative">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.name}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center bg-brand-neutral text-3xl font-extrabold text-brand-navy">
                      {event.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span
                    className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${status.style}`}
                  >
                    {status.label}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                    {event.category?.name ?? "Uncategorized"}
                  </p>
                  <h2 className="mt-1 line-clamp-2 text-base font-bold text-brand-navy">
                    {event.name}
                  </h2>
                  <p className="mt-1 text-sm text-brand-muted">
                    {event.type === "ONLINE" ? "Online" : event.city}
                    <span className="mx-1.5 text-brand-disabled">·</span>
                    {formatDate(event.startDate)}
                  </p>

                  <div className="mt-4 border-t border-brand-navy/10 pt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-muted">
                      Seats left
                    </p>
                    <ul className="mt-2 space-y-1">
                      {event.tickets.map((ticket) => (
                        <li
                          key={ticket.id}
                          className="flex justify-between gap-3 text-sm"
                        >
                          <span className="text-brand-text">{ticket.name}</span>
                          <span className="text-brand-navy">
                            {ticket.availableQuantity} / {ticket.quantity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto flex flex-wrap gap-2 pt-5">
                    <Link
                      to={`/events/${event.id}/edit`}
                      className={buttonVariants({
                        size: "sm",
                        variant: "secondary",
                      })}
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/organizer/attendees?event=${event.id}`}
                      className={buttonVariants({
                        size: "sm",
                        variant: "outline",
                      })}
                    >
                      Attendees
                    </Link>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="ml-auto"
                      disabled={deleteMutation.isPending}
                      onClick={() =>
                        setEventToDelete({ id: event.id, name: event.name })
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={eventToDelete !== null}
        title="Delete this event?"
        description={`"${eventToDelete?.name}" will be removed from the event list. This cannot be undone.`}
        confirmText="Delete"
        destructive
        isPending={deleteMutation.isPending}
        onConfirm={() => {
          if (!eventToDelete) return;
          deleteMutation.mutate(eventToDelete.id, {
            onSettled: () => setEventToDelete(null),
          });
        }}
        onCancel={() => setEventToDelete(null)}
      />
    </div>
  );
}

export default OrganizerEventsPage;
