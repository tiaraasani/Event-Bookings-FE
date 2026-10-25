import ConfirmDialog from "@/components/ConfirmDialog";
import GlobalPagination from "@/components/GlobalPagination";
import { Button } from "@/components/ui/button";
import { useGetOrganizerTransactions } from "@/hooks/api/useGetOrganizerTransactions";
import { useConfirmTransaction } from "@/hooks/api/useConfirmTransaction";
import type { PaymentStatus } from "@/types/organizer-transaction";
import { useState } from "react";

type PendingAction = {
  orderId: number;
  action: "accept" | "reject";
};

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

const STATUS_OPTIONS: { value: PaymentStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "WAITING_FOR_CONFIRMATION", label: "Waiting for confirmation" },
  { value: "WAITING_FOR_PAYMENT", label: "Waiting for payment" },
  { value: "PAID", label: "Paid" },
  { value: "REJECTED", label: "Rejected" },
  { value: "EXPIRED", label: "Expired" },
  { value: "CANCELED", label: "Canceled" },
];

const TAKE = 10;

function OrganizerTransactionsTable() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<PaymentStatus | "">("");

  const { data, isPending, isError, isPlaceholderData } =
    useGetOrganizerTransactions({
      page,
      take: TAKE,
      status,
    });
  const confirm = useConfirmTransaction();
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );

  const filterBar = (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value as PaymentStatus | "");
          setPage(1);
        }}
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {data && (
        <p className="text-sm text-gray-500">{data.meta.total} transactions</p>
      )}
    </div>
  );

  if (isPending) {
    return (
      <div>
        {filterBar}
        <p className="text-sm text-gray-500">Loading transactions...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div>
        {filterBar}
        <p className="text-sm text-red-500">Failed to load transactions.</p>
      </div>
    );
  }

  const transactions = data.data;
  const totalPage = Math.max(1, Math.ceil(data.meta.total / data.meta.take));

  if (transactions.length === 0) {
    return (
      <div>
        {filterBar}
        <p className="text-sm text-gray-500">
          {status
            ? "No transactions match this status."
            : "No transactions yet."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {filterBar}

      <div
        className={`overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}
      >
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Event</th>
              <th className="hidden px-4 py-3 md:table-cell">Ticket</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="hidden px-4 py-3 md:table-cell">Proof</th>
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
                <td className="hidden px-4 py-3 md:table-cell">
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
                    className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(trx.paymentStatus)}`}
                  >
                    {trx.paymentStatus.replaceAll("_", " ")}
                  </span>
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
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
                    <div className="flex flex-col gap-2 md:flex-row">
                      <Button
                        size="sm"
                        disabled={confirm.isPending}
                        onClick={() =>
                          setPendingAction({
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
                          setPendingAction({
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

      <div className="mt-4">
        <GlobalPagination
          currentPage={data.meta.page}
          totalPage={totalPage}
          onChangePage={(p) => setPage(p)}
        />
      </div>

      <ConfirmDialog
        open={pendingAction !== null}
        title={
          pendingAction?.action === "accept"
            ? "Accept this payment?"
            : "Reject this payment?"
        }
        description={
          pendingAction?.action === "accept"
            ? `Order #${pendingAction?.orderId} will be marked as paid and the customer will receive a confirmation email.`
            : `Order #${pendingAction?.orderId} will be rejected. Seats, points, and coupons will be returned to the customer.`
        }
        confirmText={pendingAction?.action === "accept" ? "Accept" : "Reject"}
        destructive={pendingAction?.action === "reject"}
        isPending={confirm.isPending}
        onConfirm={() => {
          if (!pendingAction) return;
          confirm.mutate(pendingAction, {
            onSettled: () => setPendingAction(null),
          });
        }}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
}

export default OrganizerTransactionsTable;
