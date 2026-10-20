import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useGetOrganizerTransactions } from "@/hooks/api/useGetOrganizerTransactions";
import { useConfirmTransaction } from "@/hooks/api/useConfirmTransaction";
import type { PaymentStatus } from "@/types/organizer-transaction";

function formatRupiah(amount: number) {
  return "Rp " + amount.toLocaleString("id-ID");
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusStyle(status: PaymentStatus) {
  if (status === "PAID") return "bg-green-100 text-green-700";
  if (status === "WAITING_FOR_CONFIRMATION") return "bg-blue-100 text-blue-700";
  if (status === "WAITING_FOR_PAYMENT") return "bg-amber-100 text-amber-700";
  if (status === "REJECTED") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-600";
}

function OrganizerTransactionsPage() {
  const {
    data: transactions,
    isPending,
    isError,
  } = useGetOrganizerTransactions();
  const confirm = useConfirmTransaction();

  if (isPending) {
    return (
      <>
        <Navbar />
        <p className="p-8 pt-32">Loading transactions...</p>
      </>
    );
  }

  if (isError || !transactions) {
    return (
      <>
        <Navbar />
        <p className="p-8 pt-32">Failed to load transactions.</p>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFA] text-gray-800">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pb-16 pt-32 sm:px-10">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Transactions</h1>

        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Ticket</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Proof</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((trx) => (
                  <tr key={trx.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <p className="font-semibold">#{trx.id}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(trx.createdAt)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{trx.user.name}</p>
                      <p className="text-xs text-gray-500">{trx.user.email}</p>
                    </td>
                    <td className="px-4 py-3">{trx.ticket.event.name}</td>
                    <td className="px-4 py-3">
                      {trx.ticket.name} x {trx.quantity}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">
                        {formatRupiah(trx.finalPrice)}
                      </p>
                      {trx.pointsUsed > 0 && (
                        <p className="text-xs text-gray-500">
                          {trx.pointsUsed.toLocaleString("id-ID")} points used
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(trx.paymentStatus)}`}
                      >
                        {trx.paymentStatus.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {trx.paymentProofUrl ? (
                        <a
                          href={trx.paymentProofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#147D74] underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {trx.paymentStatus === "WAITING_FOR_CONFIRMATION" ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            disabled={confirm.isPending}
                            onClick={() =>
                              confirm.mutate({
                                orderId: trx.id,
                                action: "accept",
                              })
                            }
                            className="bg-[#159E98] text-white hover:bg-[#117F7A]"
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={confirm.isPending}
                            onClick={() =>
                              confirm.mutate({
                                orderId: trx.id,
                                action: "reject",
                              })
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
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

export default OrganizerTransactionsPage;
