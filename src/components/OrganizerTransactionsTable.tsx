import ConfirmDialog from "@/components/ConfirmDialog";
import GlobalPagination from "@/components/GlobalPagination";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useGetOrganizerTransactions } from "@/hooks/api/useGetOrganizerTransactions";
import { useConfirmTransaction } from "@/hooks/api/useConfirmTransaction";
import type { PaymentStatus } from "@/types/organizer-transaction";
import { getMyOrganizedEvents } from "@/services/event";
import { useQuery } from "@tanstack/react-query";
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

const STATUS_OPTIONS: { value: PaymentStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "WAITING_FOR_CONFIRMATION", label: "Waiting for confirmation" },
  { value: "WAITING_FOR_PAYMENT", label: "Waiting for payment" },
  { value: "PAID", label: "Paid" },
  { value: "REJECTED", label: "Rejected" },
  { value: "EXPIRED", label: "Expired" },
  { value: "CANCELED", label: "Canceled" },
];

// Text shown in the Action column once no decision is needed
// Same labels and chip colours as the customer's My Orders page, so both
// sides of a transaction read the same way.
const STATUS_LABEL: Record<PaymentStatus, string> = {
  WAITING_FOR_PAYMENT: "Waiting for payment",
  WAITING_FOR_CONFIRMATION: "Waiting for confirmation",
  PAID: "Paid",
  REJECTED: "Rejected",
  EXPIRED: "Expired",
  CANCELED: "Canceled",
};

const STATUS_STYLE: Record<PaymentStatus, string> = {
  WAITING_FOR_PAYMENT: "bg-amber-50 text-amber-700 ring-amber-200",
  WAITING_FOR_CONFIRMATION: "bg-blue-50 text-blue-700 ring-blue-200",
  PAID: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  REJECTED: "bg-red-50 text-red-700 ring-red-200",
  EXPIRED: "bg-brand-neutral text-brand-muted ring-brand-disabled/60",
  CANCELED: "bg-brand-neutral text-brand-muted ring-brand-disabled/60",
};

const TAKE = 10;

function OrganizerTransactionsTable() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<PaymentStatus | "">("");
  const [eventId, setEventId] = useState<number | undefined>(undefined);

  // Organizer's own events, for the event filter
  const events = useQuery({
    queryKey: ["my-organized-events"],
    queryFn: getMyOrganizedEvents,
  });

  const { data, isPending, isError, isPlaceholderData } =
    useGetOrganizerTransactions({
      page,
      take: TAKE,
      status,
      eventId,
    });
  const confirm = useConfirmTransaction();
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );

  const filterBar = (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Select
          aria-label="Filter by event"
          value={eventId ? String(eventId) : "ALL"}
          onValueChange={(v) => {
            setEventId(v === "ALL" ? undefined : Number(v));
            setPage(1);
          }}
          className="h-10 w-64 font-medium text-brand-navy"
          options={[
            { value: "ALL", label: "All events" },
            ...(events.data ?? []).map((event) => ({
              value: String(event.id),
              label: event.name,
            })),
          ]}
        />

        <Select
          aria-label="Filter by status"
          value={status || "ALL"}
          onValueChange={(v) => {
            setStatus(v === "ALL" ? "" : (v as PaymentStatus));
            setPage(1);
          }}
          className="h-10 w-60 font-medium text-brand-navy"
          options={STATUS_OPTIONS.map((option) => ({
            value: option.value || "ALL",
            label: option.label,
          }))}
        />
      </div>

      {data && (
        <p className="text-sm text-brand-muted">
          {data.meta.total} transactions
        </p>
      )}
    </div>
  );

  if (isPending) {
    return (
      <div>
        {filterBar}
        <p className="text-sm text-brand-muted">Loading transactions...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div>
        {filterBar}
        <p className="text-sm font-medium text-red-600">
          Failed to load transactions.
        </p>
      </div>
    );
  }

  const transactions = data.data;
  const totalPage = Math.max(1, Math.ceil(data.meta.total / data.meta.take));

  if (transactions.length === 0) {
    return (
      <div>
        {filterBar}
        <div className="rounded-2xl border border-brand-navy/10 bg-white p-10 text-center shadow-sm shadow-brand-navy/5">
          <p className="font-semibold text-brand-navy">
            {status || eventId
              ? "No transactions match these filters"
              : "No transactions yet"}
          </p>
          <p className="mt-2 text-sm text-brand-muted">
            {status || eventId
              ? "Try another event or status."
              : "Orders will appear here when customers book your events."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {filterBar}

      <div
        className={`overflow-x-auto rounded-2xl border border-brand-navy/10 bg-white shadow-sm shadow-brand-navy/5 transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}
      >
        <table className="w-full min-w-[720px] text-sm lg:min-w-0">
          <thead className="bg-brand-neutral/70 text-left text-xs font-bold uppercase tracking-wider text-brand-muted">
            <tr>
              <th className="w-12 px-3 py-3">No</th>
              <th className="px-3 py-3">Date</th>
              <th className="min-w-40 px-3 py-3">Customer</th>
              <th className="min-w-32 px-3 py-3">Event</th>
              <th className="hidden px-3 py-3 lg:table-cell">Ticket</th>
              <th className="px-3 py-3">Total</th>
              <th className="px-3 py-3">Proof</th>
              <th className="px-3 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-brand-text">
            {transactions.map((trx, index) => (
              <tr
                key={trx.id}
                className="border-t border-brand-navy/10 align-middle transition hover:bg-brand-neutral/40"
              >
                {/* Keep numbering continuous across pages: page 2 starts at 11 */}
                <td className="px-3 py-3">
                  {(data.meta.page - 1) * data.meta.take + index + 1}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {formatDate(trx.createdAt)}
                </td>
                <td className="px-3 py-3">
                  <p>{trx.user.name}</p>
                  <p className="mt-0.5 text-xs text-brand-muted">
                    {trx.user.email}
                  </p>
                </td>
                <td className="px-3 py-3">{trx.ticket.event.name}</td>
                <td className="hidden whitespace-nowrap px-3 py-3 lg:table-cell">
                  {trx.ticket.name} x {trx.quantity}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <p>{formatRupiah(trx.finalPrice)}</p>
                  {trx.pointsUsed > 0 && (
                    <p>{trx.pointsUsed.toLocaleString("id-ID")} points used</p>
                  )}
                </td>
                <td className="px-3 py-3">
                  {trx.paymentProofUrl ? (
                    <a
                      href={trx.paymentProofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-4 transition hover:text-brand-orange"
                    >
                      View
                    </a>
                  ) : (
                    <span>-</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <div className="flex items-center gap-2">
                    {trx.paymentStatus === "WAITING_FOR_CONFIRMATION" ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={confirm.isPending}
                          onClick={() =>
                            setPendingAction({
                              orderId: trx.id,
                              action: "accept",
                            })
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
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
                      <span
                        className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ring-1 ${STATUS_STYLE[trx.paymentStatus]}`}
                      >
                        {STATUS_LABEL[trx.paymentStatus]}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
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
            ? "This order will be marked as paid and the customer will receive a confirmation email."
            : "This order will be rejected. The customer's seats, points, and coupon will be returned."
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
