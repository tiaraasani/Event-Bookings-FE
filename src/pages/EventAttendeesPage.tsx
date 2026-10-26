import Navbar from "@/components/Navbar";
import { useGetEventAttendees } from "@/hooks/api/useGetEventAttendees";
import { Link, useParams } from "react-router-dom";

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

function EventAttendeesPage() {
  const { id } = useParams();
  const eventId = Number(id);

  const { data, isPending, isError } = useGetEventAttendees(eventId);

  if (isPending) {
    return (
      <div className="min-h-screen bg-brand-neutral">
        <Navbar />
        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
          <p className="text-brand-muted">Loading attendees...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-brand-neutral">
        <Navbar />
        <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="font-medium text-brand-text">
            Failed to load attendees.
          </p>
          <Link
            to="/profile"
            className="rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-orange-dark"
          >
            Back to profile
          </Link>
        </div>
      </div>
    );
  }

  const summaryCards = [
    { label: "Attendees", value: data.summary.totalAttendees },
    { label: "Tickets", value: data.summary.totalTickets },
    { label: "Revenue", value: formatRupiah(data.summary.totalRevenue) },
  ];

  return (
    <div className="min-h-screen bg-brand-neutral">
      <Navbar />

      <main className="mx-auto max-w-5xl px-5 pb-16 pt-8 sm:px-8 md:pt-10">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy underline underline-offset-4 transition hover:text-brand-orange"
        >
          <span aria-hidden="true">←</span>
          Back to profile
        </Link>

        <header className="mb-8 mt-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
            Attendee list
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
            {data.event.name}
          </h1>

          <p className="mt-2 text-sm text-brand-muted">
            Starts {formatDate(data.event.startDate)}
          </p>
        </header>

        <div className="mb-5 grid gap-4 sm:grid-cols-3">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm shadow-brand-navy/5"
            >
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
          <div className="rounded-2xl border border-brand-navy/10 bg-white p-10 text-center shadow-sm shadow-brand-navy/5">
            <p className="font-semibold text-brand-navy">No attendees yet</p>
            <p className="mt-2 text-sm text-brand-muted">
              Paid attendees will appear here once payments are confirmed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-brand-navy/10 bg-white shadow-sm shadow-brand-navy/5">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-brand-neutral/70 text-left text-xs font-bold uppercase tracking-wider text-brand-muted">
                <tr>
                  <th className="px-4 py-3.5">Name</th>
                  <th className="px-4 py-3.5">Ticket</th>
                  <th className="px-4 py-3.5">Qty</th>
                  <th className="px-4 py-3.5">Total Paid</th>
                  <th className="px-4 py-3.5">Paid At</th>
                </tr>
              </thead>
              <tbody>
                {data.attendees.map((attendee) => (
                  <tr
                    key={attendee.orderId}
                    className="border-t border-brand-navy/10 transition hover:bg-brand-neutral/40"
                  >
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-brand-navy">
                        {attendee.name}
                      </p>
                      <p className="mt-0.5 text-xs text-brand-muted">
                        {attendee.email}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-brand-text">
                      {attendee.ticketName}
                    </td>
                    <td className="px-4 py-3.5 text-brand-text">
                      {attendee.quantity}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-brand-navy">
                      {formatRupiah(attendee.totalPaid)}
                    </td>
                    <td className="px-4 py-3.5 text-brand-muted">
                      {formatDate(attendee.paidAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default EventAttendeesPage;
