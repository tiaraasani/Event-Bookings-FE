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
      <>
        <Navbar />
        <p className="p-8 pt-32">Loading attendees...</p>
      </>
    );
  }

  if (isError || !data) {
    return (
      <>
        <Navbar />
        <p className="p-8 pt-32">Failed to load attendees.</p>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFA] text-gray-800">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 pb-16 pt-32 sm:px-10">
        <Link to="/profile" className="text-sm text-[#147D74] underline">
          Back to profile
        </Link>

        <h1 className="mb-1 mt-3 text-3xl font-bold text-gray-900">
          {data.event.name}
        </h1>
        <p className="mb-6 text-gray-500">
          Starts {formatDate(data.event.startDate)}
        </p>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Attendees</p>
            <p className="mt-1 text-2xl font-bold">
              {data.summary.totalAttendees}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Tickets</p>
            <p className="mt-1 text-2xl font-bold">
              {data.summary.totalTickets}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Revenue</p>
            <p className="mt-1 text-2xl font-bold">
              {formatRupiah(data.summary.totalRevenue)}
            </p>
          </div>
        </div>

        {data.attendees.length === 0 ? (
          <p className="text-gray-500">No paid attendees yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Ticket</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Total Paid</th>
                  <th className="px-4 py-3">Paid At</th>
                </tr>
              </thead>
              <tbody>
                {data.attendees.map((attendee) => (
                  <tr
                    key={attendee.orderId}
                    className="border-t border-gray-100"
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold">{attendee.name}</p>
                      <p className="text-xs text-gray-500">{attendee.email}</p>
                    </td>
                    <td className="px-4 py-3">{attendee.ticketName}</td>
                    <td className="px-4 py-3">{attendee.quantity}</td>
                    <td className="px-4 py-3 font-semibold">
                      {formatRupiah(attendee.totalPaid)}
                    </td>
                    <td className="px-4 py-3">{formatDate(attendee.paidAt)}</td>
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
