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

function OrganizerDashboardPage() {
  const navigate = useNavigate();
  const { data: organization } = useGetMyOrganization();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [period, setPeriod] = useState<Period>("month");
  const [metric, setMetric] = useState<Metric>("revenue");

  const { data, isPending, isError } = useGetOrganizerStatistics(year, month);

  const yearOptions: number[] = [];
  for (let y = now.getFullYear() - 4; y <= now.getFullYear(); y++) {
    yearOptions.push(y);
  }

  if (isPending) {
    return (
      <>
        <Navbar />
        <p className="p-8 pt-32">Loading statistics...</p>
      </>
    );
  }

  if (isError || !data) {
    return (
      <>
        <Navbar />
        <p className="p-8 pt-32">Failed to load statistics.</p>
      </>
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

  return (
    <div className="min-h-screen bg-[#F7FAFA] text-gray-800">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pb-16 pt-32 sm:px-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                navigate(`/organizers/${organization?.id}/reviews`)
              }
              disabled={!organization?.id}
              className="rounded-lg bg-teal-600 px-5 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              View Organizer Reviews
            </button>

            <button
              type="button"
              onClick={() => navigate("/organizer/promotions")}
              className="rounded-lg bg-teal-600 px-5 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Manage Promotions
            </button>
          </div>
        </div>
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Events</p>
            <p className="mt-1 text-2xl font-bold">
              {data.summary.totalEvents}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Paid Orders</p>
            <p className="mt-1 text-2xl font-bold">
              {data.summary.totalOrders}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Tickets Sold</p>
            <p className="mt-1 text-2xl font-bold">
              {data.summary.totalTickets}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="mt-1 text-2xl font-bold">
              {formatRupiah(data.summary.totalRevenue)}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as Period)}
              className="rounded border border-gray-300 px-3 py-2"
            >
              <option value="year">Per year</option>
              <option value="month">Per month</option>
              <option value="day">Per day</option>
            </select>

            {period !== "year" && (
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="rounded border border-gray-300 px-3 py-2"
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
                className="rounded border border-gray-300 px-3 py-2"
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
              className="rounded border border-gray-300 px-3 py-2"
            >
              <option value="revenue">Revenue</option>
              <option value="tickets">Tickets sold</option>
            </select>
          </div>

          <h2 className="mb-4 text-lg font-semibold">{chartTitle}</h2>

          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={formatAxis} />
                <Tooltip
                  formatter={(value) =>
                    metric === "revenue"
                      ? formatRupiah(Number(value))
                      : String(value)
                  }
                />
                <Bar dataKey={metric} fill="#159E98" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrganizerDashboardPage;
