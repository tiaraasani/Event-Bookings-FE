import ConfirmDialog from "@/components/ConfirmDialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useConfirmTransaction } from "@/hooks/api/useConfirmTransaction";
import useGetMyOrganization from "@/hooks/api/useGetMyOrganization";
import { useGetOrganizerStatistics } from "@/hooks/api/useGetOrganizerStatistics";
import { useGetOrganizerTransactions } from "@/hooks/api/useGetOrganizerTransactions";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Period = "year" | "month" | "day";
type Metric = "revenue" | "tickets";

type PendingAction = {
  orderId: number;
  action: "accept" | "reject";
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "year", label: "Year" },
  { value: "month", label: "Month" },
  { value: "day", label: "Day" },
];

const CARD =
  "rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm shadow-brand-navy/5";

// Compact variant for the chart filters
const FILTER_SELECT = "h-10 w-24 font-medium text-brand-navy";

function formatRupiah(amount: number) {
  return "Rp " + amount.toLocaleString("id-ID");
}

function formatAxis(value: number) {
  if (value >= 1_000_000) {
    return (value / 1_000_000).toLocaleString("id-ID") + " jt";
  }
  if (value >= 1_000) {
    return (value / 1_000).toLocaleString("id-ID") + " rb";
  }
  return String(value);
}

function OrganizerDashboardPage() {
  const { data: organization } = useGetMyOrganization();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [period, setPeriod] = useState<Period>("month");
  const [metric, setMetric] = useState<Metric>("revenue");

  const { data, isPending, isError, refetch } = useGetOrganizerStatistics(
    year,
    month,
  );

  // Orders that need the organizer's decision: shown on the overview so the
  // most important daily task is visible without opening Transactions.
  const pending = useGetOrganizerTransactions({
    page: 1,
    take: 5,
    status: "WAITING_FOR_CONFIRMATION",
  });
  const confirm = useConfirmTransaction();
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );

  const yearOptions: number[] = [];
  for (let y = now.getFullYear() - 4; y <= now.getFullYear(); y++) {
    yearOptions.push(y);
  }

  if (isPending) {
    return <p className="text-brand-muted">Loading statistics...</p>;
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="font-medium text-brand-text">
          Failed to load statistics.
        </p>
        <Button type="button" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const chartData =
    period === "year"
      ? data.byYear
      : period === "month"
        ? data.byMonth
        : data.byDay;

  const chartTitle =
    period === "year"
      ? "All years"
      : period === "month"
        ? `Per month in ${year}`
        : `Per day in ${MONTH_NAMES[month - 1]} ${year}`;

  const pendingCount = pending.data?.meta.total ?? 0;
  const pendingRows = pending.data?.data ?? [];

  return (
    <div>
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
          Organizer dashboard
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
          Overview
        </h1>
        <p className="mt-2 text-sm leading-6 text-brand-text">
          {organization?.name
            ? `How ${organization.name} is doing.`
            : "Track ticket sales and revenue across your events."}
        </p>
      </header>

      {/* Summary stats */}
      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          className={`${CARD} ${
            pendingCount > 0
              ? "border-brand-orange/40 bg-brand-orange-soft/60"
              : ""
          }`}
        >
          <p className="text-sm font-medium text-brand-muted">
            Awaiting confirmation
          </p>
          <p className="mt-2 text-2xl font-extrabold text-brand-navy">
            {pendingCount}
          </p>
          <Link
            to="/organizer/transactions"
            className="mt-2 inline-block text-xs font-semibold text-brand-navy underline underline-offset-4 hover:text-brand-orange"
          >
            Review transactions
          </Link>
        </div>
        <div className={CARD}>
          <p className="text-sm font-medium text-brand-muted">Events</p>
          <p className="mt-2 text-2xl font-extrabold text-brand-navy">
            {data.summary.totalEvents}
          </p>
          <p className="mt-2 text-xs text-brand-muted">Published by you</p>
        </div>
        <div className={CARD}>
          <p className="text-sm font-medium text-brand-muted">Tickets sold</p>
          <p className="mt-2 text-2xl font-extrabold text-brand-navy">
            {data.summary.totalTickets}
          </p>
          <p className="mt-2 text-xs text-brand-muted">
            from {data.summary.totalOrders} paid orders
          </p>
        </div>
        <div className={CARD}>
          <p className="text-sm font-medium text-brand-muted">Total revenue</p>
          <p className="mt-2 break-words text-2xl font-extrabold text-brand-navy">
            {formatRupiah(data.summary.totalRevenue)}
          </p>
          <p className="mt-2 text-xs text-brand-muted">Paid orders only</p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        {/* Chart */}
        <div className={`${CARD} sm:p-6 xl:col-span-2`}>
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-brand-navy">
                {metric === "revenue" ? "Revenue" : "Tickets sold"}
              </h2>
              <p className="mt-1 text-sm text-brand-muted">{chartTitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-lg border border-brand-disabled/80 bg-brand-neutral/70 p-1">
                {PERIOD_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPeriod(option.value)}
                    className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
                      period === option.value
                        ? "bg-white text-brand-navy shadow-sm"
                        : "text-brand-muted hover:text-brand-navy"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {period !== "year" && (
                <Select
                  aria-label="Chart year"
                  value={String(year)}
                  onValueChange={(v) => setYear(Number(v))}
                  className={FILTER_SELECT}
                  options={yearOptions.map((y) => ({
                    value: String(y),
                    label: String(y),
                  }))}
                />
              )}

              {period === "day" && (
                <Select
                  aria-label="Chart month"
                  value={String(month)}
                  onValueChange={(v) => setMonth(Number(v))}
                  className={`${FILTER_SELECT} w-36`}
                  options={MONTH_NAMES.map((name, index) => ({
                    value: String(index + 1),
                    label: name,
                  }))}
                />
              )}

              <Select
                aria-label="Chart metric"
                value={metric}
                onValueChange={(v) => setMetric(v as Metric)}
                className={`${FILTER_SELECT} w-36`}
                options={[
                  { value: "revenue", label: "Revenue" },
                  { value: "tickets", label: "Tickets sold" },
                ]}
              />
            </div>
          </div>

          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#d5dfef"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "#6b7c9b" }}
                  axisLine={{ stroke: "#d5dfef" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6b7c9b" }}
                  tickFormatter={formatAxis}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(37, 60, 109, 0.04)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #d5dfef",
                    boxShadow: "0 10px 30px rgba(37, 60, 109, 0.12)",
                    color: "#253c6d",
                    fontSize: 13,
                  }}
                  formatter={(value) =>
                    metric === "revenue"
                      ? formatRupiah(Number(value))
                      : String(value)
                  }
                />
                <Bar
                  dataKey={metric}
                  fill="#f2842f"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={56}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending confirmations */}
        <div className={CARD}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-brand-navy">
                Needs your confirmation
              </h2>
              <p className="mt-1 text-sm text-brand-muted">
                Customers who uploaded payment proof.
              </p>
            </div>
          </div>

          {pending.isPending ? (
            <p className="text-sm text-brand-muted">Loading...</p>
          ) : pendingRows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-brand-disabled px-4 py-8 text-center">
              <p className="text-sm font-semibold text-brand-navy">
                All caught up
              </p>
              <p className="mt-1 text-xs text-brand-muted">
                No payments are waiting for review.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-brand-navy/10">
              {pendingRows.map((trx) => (
                <li key={trx.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-brand-navy">
                        {trx.user.name}
                      </p>
                      <p className="truncate text-xs text-brand-muted">
                        {trx.ticket.event.name} · {trx.ticket.name} ×{" "}
                        {trx.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-brand-navy">
                      {formatRupiah(trx.finalPrice)}
                    </p>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    {trx.paymentProofUrl && (
                      <a
                        href={trx.paymentProofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mr-auto text-xs font-semibold text-brand-navy underline underline-offset-4 hover:text-brand-orange"
                      >
                        View proof
                      </a>
                    )}
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
                </li>
              ))}
            </ul>
          )}

          <Link
            to="/organizer/transactions"
            className={buttonVariants({
              variant: "outline",
              className: "mt-5 w-full",
            })}
          >
            Go to transactions
          </Link>
        </div>
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

export default OrganizerDashboardPage;
