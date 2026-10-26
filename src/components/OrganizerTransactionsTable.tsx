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
  if (status === "PAID")
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (status === "WAITING_FOR_CONFIRMATION")
    return "bg-blue-50 text-blue-700 ring-blue-200";
  if (status === "WAITING_FOR_PAYMENT")
    return "bg-amber-50 text-amber-700 ring-amber-200";
  if (status === "REJECTED") return "bg-red-50 text-red-700 ring-red-200";
  return "bg-brand-neutral text-brand-muted ring-brand-disabled/60";
}

function OrganizerTransactionsTable() {
  const {
    data: transactions,
    isPending,
    isError,
  } = useGetOrganizerTransactions();
  const confirm = useConfirmTransaction();

  if (isPending) {
    return <p className="text-sm text-brand-muted">Loading transactions...</p>;
  }

  if (isError || !transactions) {
    return (
      <p className="text-sm font-medium text-red-600">
        Failed to load transactions.
      </p>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-brand-navy/10 bg-white p-10 text-center shadow-sm shadow-brand-navy/5">
        <p className="font-semibold text-brand-navy">No transactions yet</p>
        <p className="mt-2 text-sm text-brand-muted">
          Orders will appear here when customers book your events.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-brand-navy/10 bg-white shadow-sm shadow-brand-navy/5">
      <table className="w-full min-w-[800px] text-sm">
        <thead className="bg-brand-neutral/70 text-left text-xs font-bold uppercase tracking-wider text-brand-muted">
          <tr>
            <th className="px-4 py-3.5">Order</th>
            <th className="px-4 py-3.5">Customer</th>
            <th className="px-4 py-3.5">Event</th>
            <th className="hidden px-4 py-3.5 md:table-cell">Ticket</th>
            <th className="px-4 py-3.5">Total</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="hidden px-4 py-3.5 md:table-cell">Proof</th>
            <th className="px-4 py-3.5">Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((trx) => (
            <tr
              key={trx.id}
              className="border-t border-brand-navy/10 transition hover:bg-brand-neutral/40"
            >
              <td className="px-4 py-3.5">
                <p className="font-semibold text-brand-navy">#{trx.id}</p>
                <p className="mt-0.5 text-xs text-brand-muted">
                  {formatDate(trx.createdAt)}
                </p>
              </td>
              <td className="px-4 py-3.5">
                <p className="font-medium text-brand-navy">{trx.user.name}</p>
                <p className="mt-0.5 text-xs text-brand-muted">
                  {trx.user.email}
                </p>
              </td>
              <td className="px-4 py-3.5 text-brand-text">
                {trx.ticket.event.name}
              </td>
              <td className="hidden px-4 py-3.5 text-brand-text md:table-cell">
                {trx.ticket.name} x {trx.quantity}
              </td>
              <td className="px-4 py-3.5">
                <p className="font-semibold text-brand-navy">
                  {formatRupiah(trx.finalPrice)}
                </p>
                {trx.pointsUsed > 0 && (
                  <p className="mt-0.5 text-xs text-brand-muted">
                    {trx.pointsUsed.toLocaleString("id-ID")} points used
                  </p>
                )}
              </td>
              <td className="px-4 py-3.5">
                <span
                  className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusStyle(trx.paymentStatus)}`}
                >
                  {trx.paymentStatus.replaceAll("_", " ")}
                </span>
              </td>
              <td className="hidden px-4 py-3.5 md:table-cell">
                {trx.paymentProofUrl ? (
                  <a
                    href={trx.paymentProofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-brand-navy underline underline-offset-4 transition hover:text-brand-orange"
                  >
                    View
                  </a>
                ) : (
                  <span className="text-brand-muted/60">-</span>
                )}
              </td>
              <td className="px-4 py-3.5">
                {trx.paymentStatus === "WAITING_FOR_CONFIRMATION" ? (
                  <div className="flex flex-col gap-2 md:flex-row">
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={confirm.isPending}
                      onClick={() => {
                        if (
                          window.confirm(
                            `Accept payment for order #${trx.id}?`,
                          )
                        ) {
                          confirm.mutate({ orderId: trx.id, action: "accept" });
                        }
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={confirm.isPending}
                      onClick={() => {
                        if (
                          window.confirm(
                            `Reject payment for order #${trx.id}?`,
                          )
                        ) {
                          confirm.mutate({ orderId: trx.id, action: "reject" });
                        }
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                ) : (
                  <span className="text-brand-muted/60">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrganizerTransactionsTable;
