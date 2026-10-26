import Navbar from "@/components/Navbar";
import { useGetOrganizerStatistics } from "@/hooks/api/useGetOrganizerStatistics";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useNavigate } from "react-router-dom";
import useGetMyOrganization from "@/hooks/api/useGetMyOrganization";

type Period = "year" | "month" | "day";
type Metric = "revenue" | "tickets";

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

const selectClass =
  "h-10 rounded-lg border border-brand-disabled/80 bg-white px-3 text-sm font-medium text-brand-navy outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15";

function OrganizerDashboardPage() {
  const navigate = useNavigate();
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

  const yearOptions: number[] = [];
  for (let y = now.getFullYear() - 4; y <= now.getFullYear(); y++) {
    yearOptions.push(y);
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-brand-neutral">
        <Navbar />
        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
          <p className="text-brand-muted">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-brand-neutral">
        <Navbar />
        <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center gap-3 px-4 text-center">
          <p className="font-medium text-brand-text">
            Failed to load statistics.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-orange-dark"
          >
            Try again
          </button>
        </div>
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

  const summaryCards = [
    { label: "Total Events", value: data.summary.totalEvents },
    { label: "Paid Orders", value: data.summary.totalOrders },
    { label: "Tickets Sold", value: data.summary.totalTickets },
    {
      label: "Total Revenue",
      value: formatRupiah(data.summary.totalRevenue),
    },
  ];

  return (
    <div className="min-h-screen bg-brand-neutral">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 md:pt-10">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
              Organizer dashboard
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm leading-6 text-brand-text">
              Track ticket sales and revenue across your events.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                navigate(`/organizers/${organization?.id}/reviews`)
              }
              disabled={!organization?.id}
              className="rounded-lg border border-brand-navy/25 bg-white px-5 py-2.5 text-sm font-semibold text-brand-navy shadow-sm transition hover:border-brand-navy hover:bg-brand-navy hover:text-white disabled:cursor-not-allowed disabled:border-brand-disabled disabled:bg-brand-disabled disabled:text-[#5b6b88]"
            >
              View Organizer Reviews
            </button>

            <button
              type="button"
              onClick={() => navigate("/organizer/promotions")}
              className="rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-orange/20 transition hover:bg-brand-orange-dark"
            >
              Manage Promotions
            </button>
          </div>
        </header>

        <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        <div className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm shadow-brand-navy/5 sm:p-6">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as Period)}
              className={selectClass}
              aria-label="Chart period"
            >
              <option value="year">Per year</option>
              <option value="month">Per month</option>
              <option value="day">Per day</option>
            </select>

            {period !== "year" && (
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className={selectClass}
                aria-label="Chart year"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            )}

            {period === "day" && (
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className={selectClass}
                aria-label="Chart month"
              >
                {MONTH_NAMES.map((name, index) => (
                  <option key={name} value={index + 1}>
                    {name}
                  </option>
                ))}
              </select>
            )}

            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value as Metric)}
              className={selectClass}
              aria-label="Chart metric"
            >
              <option value="revenue">Revenue</option>
              <option value="tickets">Tickets sold</option>
            </select>
          </div>

          <h2 className="mb-4 text-lg font-bold text-brand-navy">
            {chartTitle}
          </h2>

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
      </main>
    </div>
  );
}

export default OrganizerDashboardPage;
