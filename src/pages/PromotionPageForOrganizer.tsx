import { useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import {
  useGetMyVouchers,
  useCreateVoucher,
  useUpdateVoucher,
  useDeleteVoucher,
  type Voucher,
} from "@/hooks/api/useVoucher";

type EventOption = {
  id: number;
  name: string;
};

type FormData = {
  eventId: string;
  code: string;
  discountValue: string;
  quota: string;
  startDate: string;
  endDate: string;
};

const emptyForm: FormData = {
  eventId: "",
  code: "",
  discountValue: "",
  quota: "",
  startDate: "",
  endDate: "",
};

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}

function toDateTimeLocal(date: string) {
  const value = new Date(date);
  const offset = value.getTimezoneOffset() * 60000;

  return new Date(value.getTime() - offset).toISOString().slice(0, 16);
}

function PromotionPageForOrganizer() {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);

  const { data: vouchers, isLoading, isError } = useGetMyVouchers();

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["my-organized-events"],
    queryFn: async () => {
      const response = await axiosInstance.get("/events/my");
      return response.data.data as EventOption[];
    },
  });

  const createVoucher = useCreateVoucher();
  const updateVoucher = useUpdateVoucher();
  const deleteVoucher = useDeleteVoucher();

  const isSaving = createVoucher.isPending || updateVoucher.isPending;

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingVoucher(null);
  };

  const handleEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);

    setForm({
      eventId: String(voucher.eventId),
      code: voucher.code,
      discountValue: String(voucher.discountValue),
      quota: String(voucher.quota),
      startDate: toDateTimeLocal(voucher.startDate),
      endDate: toDateTimeLocal(voucher.endDate),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const startDate = new Date(form.startDate);
    const endDate = new Date(form.endDate);
    const discountValue = Number(form.discountValue);
    const quota = Number(form.quota);

    if (endDate <= startDate) {
      alert("End date must be after start date.");
      return;
    }

    if (!editingVoucher && startDate < new Date()) {
      alert("Promotion start date cannot be in the past.");
      return;
    }

    if (discountValue < 1 || discountValue > 100 || quota < 1) {
      alert("Enter a valid discount and quota.");
      return;
    }

    if (editingVoucher) {
      updateVoucher.mutate(
        {
          id: editingVoucher.id,
          data: {
            code: form.code.trim().toUpperCase(),
            discountValue,
            quota,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        },
        { onSuccess: resetForm },
      );
      return;
    }

    createVoucher.mutate(
      {
        eventId: Number(form.eventId),
        code: form.code.trim().toUpperCase(),
        discountValue,
        quota,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      { onSuccess: resetForm },
    );
  };

  const handleDelete = (voucher: Voucher) => {
    if (window.confirm(`Are you sure you want to delete "${voucher.code}"?`)) {
      deleteVoucher.mutate(voucher.id);
    }
  };

  const inputClass =
    "w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base text-[#123B43] placeholder:text-slate-400 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:bg-slate-100";

  const labelClass = "mb-2 block text-base font-medium text-[#123B43]";

  return (
    <div className="min-h-screen bg-[#F3F6F8] text-[#123B43]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8">
        <div className="mb-8 border-b border-slate-200 pb-6">
          <p className="mb-2 text-sm font-medium text-teal-600">
            ORGANIZER DASHBOARD
          </p>

          <h1 className="text-3xl font-semibold sm:text-4xl">Promotions</h1>

          <p className="mt-3 text-base text-slate-500">
            Create and manage voucher discounts for your events.
          </p>
        </div>

        <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-7">
            <h2 className="text-2xl font-medium">
              {editingVoucher ? "Edit Promotion" : "Create New Promotion"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Fill in the details below to set up your event promotion.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!editingVoucher && (
              <div>
                <label htmlFor="eventId" className={labelClass}>
                  Event <span className="text-red-500">*</span>
                </label>

                <select
                  id="eventId"
                  value={form.eventId}
                  onChange={(event) =>
                    handleChange("eventId", event.target.value)
                  }
                  required
                  disabled={eventsLoading || isSaving}
                  className={inputClass}
                >
                  <option value="">
                    {eventsLoading ? "Loading events..." : "Select an event"}
                  </option>

                  {events?.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-sm text-slate-500">
                  Choose the event this promotion applies to.
                </p>

                {!eventsLoading && events?.length === 0 && (
                  <p className="mt-2 text-sm text-amber-700">
                    Create an event first before adding a promotion.
                  </p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="code" className={labelClass}>
                Voucher Code <span className="text-red-500">*</span>
              </label>

              <input
                id="code"
                value={form.code}
                onChange={(event) =>
                  handleChange("code", event.target.value.toUpperCase())
                }
                placeholder="Enter your voucher code"
                minLength={3}
                maxLength={50}
                required
                disabled={isSaving}
                className={inputClass}
              />

              <p className="mt-2 text-sm text-slate-500">
                Example: EARLYBIRD20. Customers enter this code at checkout.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="discountValue" className={labelClass}>
                  Discount (%) <span className="text-red-500">*</span>
                </label>

                <input
                  id="discountValue"
                  type="number"
                  min="1"
                  max="100"
                  step="1"
                  value={form.discountValue}
                  onChange={(event) =>
                    handleChange("discountValue", event.target.value)
                  }
                  placeholder="Enter discount percentage"
                  required
                  disabled={isSaving}
                  className={inputClass}
                />

                <p className="mt-2 text-sm text-slate-500">
                  Enter a value between 1% and 100%.
                </p>
              </div>

              <div>
                <label htmlFor="quota" className={labelClass}>
                  Voucher Quota <span className="text-red-500">*</span>
                </label>

                <input
                  id="quota"
                  type="number"
                  min="1"
                  step="1"
                  value={form.quota}
                  onChange={(event) =>
                    handleChange("quota", event.target.value)
                  }
                  placeholder="Enter maximum uses"
                  required
                  disabled={isSaving}
                  className={inputClass}
                />

                <p className="mt-2 text-sm text-slate-500">
                  Set the maximum number of uses for this voucher.
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="startDate" className={labelClass}>
                  Start Date & Time <span className="text-red-500">*</span>
                </label>

                <input
                  id="startDate"
                  type="datetime-local"
                  value={form.startDate}
                  onChange={(event) =>
                    handleChange("startDate", event.target.value)
                  }
                  required
                  disabled={isSaving}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="endDate" className={labelClass}>
                  End Date & Time <span className="text-red-500">*</span>
                </label>

                <input
                  id="endDate"
                  type="datetime-local"
                  value={form.endDate}
                  onChange={(event) =>
                    handleChange("endDate", event.target.value)
                  }
                  required
                  disabled={isSaving}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-6">
              {editingVoucher && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSaving}
                  className="rounded-md bg-slate-100 px-6 py-3 font-medium text-[#123B43] transition hover:bg-slate-200 disabled:opacity-50"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={
                  isSaving ||
                  eventsLoading ||
                  (!editingVoucher && !events?.length)
                }
                className="rounded-md bg-[#20AAA8] px-7 py-3 font-semibold text-white transition hover:bg-[#189896] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving
                  ? "Saving..."
                  : editingVoucher
                    ? "Save Changes"
                    : "Create Promotion"}
              </button>
            </div>
          </form>
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-medium">Your Promotions</h2>

            <p className="mt-2 text-sm text-slate-500">
              View and manage the voucher codes you have created.
            </p>
          </div>

          {isLoading && (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
              Loading promotions...
            </div>
          )}

          {isError && (
            <div className="rounded-lg border border-red-200 bg-white p-5 text-red-600">
              Failed to load promotions. Please refresh and try again.
            </div>
          )}

          {!isLoading && !isError && vouchers?.length === 0 && (
            <div className="rounded-lg border border-slate-200 bg-white px-5 py-12 text-center shadow-sm">
              <h3 className="text-lg font-medium">No promotions yet</h3>

              <p className="mt-2 text-sm text-slate-500">
                Create your first promotion using the form above.
              </p>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vouchers?.map((voucher) => {
              const now = new Date();
              const start = new Date(voucher.startDate);
              const end = new Date(voucher.endDate);
              const used = voucher._count?.orders ?? 0;

              let status = "Upcoming";
              let statusClass = "border-slate-200 bg-slate-50 text-slate-600";

              if (now >= start && now <= end) {
                status = "Active";
                statusClass = "border-teal-200 bg-teal-50 text-teal-700";
              } else if (now > end) {
                status = "Expired";
                statusClass = "border-slate-200 bg-slate-100 text-slate-500";
              }

              if (used >= voucher.quota) {
                status = "Quota reached";
                statusClass = "border-amber-200 bg-amber-50 text-amber-700";
              }

              return (
                <article
                  key={voucher.id}
                  className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-slate-500">
                        {voucher.event.name}
                      </p>

                      <h3 className="mt-2 break-all text-xl font-semibold text-[#123B43]">
                        {voucher.code}
                      </h3>
                    </div>

                    <span
                      className={`shrink-0 rounded-md border px-2.5 py-1 text-xs font-medium ${statusClass}`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="my-5 border-b border-slate-200 pb-5">
                    <span className="text-4xl font-semibold text-teal-600">
                      {voucher.discountValue}%
                    </span>

                    <span className="ml-2 text-sm text-slate-500">
                      discount
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Voucher usage</span>

                      <span className="font-medium text-[#123B43]">
                        {used} / {voucher.quota}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-slate-500">Starts</span>

                      <span className="text-[#123B43]">
                        {formatDate(voucher.startDate)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-slate-500">Ends</span>

                      <span className="text-[#123B43]">
                        {formatDate(voucher.endDate)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3 border-t border-slate-200 pt-5">
                    <button
                      type="button"
                      onClick={() => handleEdit(voucher)}
                      className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-[#123B43] transition hover:border-teal-500 hover:bg-teal-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(voucher)}
                      disabled={deleteVoucher.isPending}
                      className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
export default PromotionPageForOrganizer;
