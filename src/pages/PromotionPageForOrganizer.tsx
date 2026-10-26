import { useState } from "react";
import { Select } from "@/components/ui/select";
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

const inputClass =
  "h-11 w-full rounded-lg border border-brand-disabled/80 bg-white px-3.5 text-sm text-brand-text shadow-sm outline-none transition placeholder:text-brand-muted/60 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15 disabled:cursor-not-allowed disabled:bg-brand-disabled/30 disabled:text-brand-muted";

const labelClass = "mb-2 block text-sm font-semibold text-brand-navy";

const hintClass = "mt-2 text-xs leading-5 text-brand-muted";

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

    // The custom Select has no native "required", so guard it here.
    if (!editingVoucher && !form.eventId) {
      alert("Please choose an event for this promotion.");
      return;
    }

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

  return (
    <div className="min-h-screen bg-brand-neutral">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 md:pt-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
            Organizer dashboard
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
            Promotions
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-brand-text">
            Create and manage voucher discounts for your events.
          </p>
        </div>

        <section className="mb-10 rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm shadow-brand-navy/5 sm:p-8">
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-brand-navy">
              {editingVoucher ? "Edit Promotion" : "Create New Promotion"}
            </h2>

            <p className="mt-2 text-sm text-brand-muted">
              Fill in the details below to set up your event promotion.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!editingVoucher && (
              <div>
                <label htmlFor="eventId" className={labelClass}>
                  Event <span className="text-red-600">*</span>
                </label>

                <Select
                  id="eventId"
                  value={form.eventId}
                  onValueChange={(value) => handleChange("eventId", value)}
                  disabled={eventsLoading || isSaving}
                  placeholder={
                    eventsLoading ? "Loading events..." : "Select an event"
                  }
                  options={(events ?? []).map((event) => ({
                    value: String(event.id),
                    label: event.name,
                  }))}
                />

                <p className={hintClass}>
                  Choose the event this promotion applies to.
                </p>

                {!eventsLoading && events?.length === 0 && (
                  <p className="mt-2 text-sm font-medium text-amber-700">
                    Create an event first before adding a promotion.
                  </p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="code" className={labelClass}>
                Voucher Code <span className="text-red-600">*</span>
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

              <p className={hintClass}>
                Example: EARLYBIRD20. Customers enter this code at checkout.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="discountValue" className={labelClass}>
                  Discount (%) <span className="text-red-600">*</span>
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

                <p className={hintClass}>Enter a value between 1% and 100%.</p>
              </div>

              <div>
                <label htmlFor="quota" className={labelClass}>
                  Voucher Quota <span className="text-red-600">*</span>
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

                <p className={hintClass}>
                  Set the maximum number of uses for this voucher.
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="startDate" className={labelClass}>
                  Start Date &amp; Time <span className="text-red-600">*</span>
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
                  End Date &amp; Time <span className="text-red-600">*</span>
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

            <div className="flex flex-wrap justify-end gap-3 border-t border-brand-navy/10 pt-6">
              {editingVoucher && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSaving}
                  className="rounded-lg border border-brand-navy/25 bg-white px-6 py-2.5 text-sm font-semibold text-brand-navy transition hover:border-brand-navy hover:bg-brand-neutral/70 disabled:cursor-not-allowed disabled:border-transparent disabled:bg-brand-disabled disabled:text-[#5b6b88]"
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
                className="rounded-lg bg-brand-orange px-7 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-orange/20 transition hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:bg-brand-disabled disabled:text-[#5b6b88] disabled:shadow-none"
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
            <h2 className="text-2xl font-bold text-brand-navy">
              Your Promotions
            </h2>

            <p className="mt-2 text-sm text-brand-muted">
              View and manage the voucher codes you have created.
            </p>
          </div>

          {isLoading && (
            <div className="rounded-2xl border border-brand-navy/10 bg-white p-8 text-center text-brand-muted shadow-sm shadow-brand-navy/5">
              Loading promotions...
            </div>
          )}

          {isError && (
            <div className="rounded-2xl border border-red-200 bg-white p-5 font-medium text-red-600 shadow-sm shadow-brand-navy/5">
              Failed to load promotions. Please refresh and try again.
            </div>
          )}

          {!isLoading && !isError && vouchers?.length === 0 && (
            <div className="rounded-2xl border border-brand-navy/10 bg-white px-5 py-12 text-center shadow-sm shadow-brand-navy/5">
              <h3 className="text-lg font-bold text-brand-navy">
                No promotions yet
              </h3>

              <p className="mt-2 text-sm text-brand-muted">
                Create your first promotion using the form above.
              </p>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {vouchers?.map((voucher) => {
              const now = new Date();
              const start = new Date(voucher.startDate);
              const end = new Date(voucher.endDate);
              const used = voucher._count?.orders ?? 0;

              let status = "Upcoming";
              let statusClass = "border-blue-200 bg-blue-50 text-blue-700";

              if (now >= start && now <= end) {
                status = "Active";
                statusClass =
                  "border-brand-orange/20 bg-brand-orange-soft text-brand-orange-dark";
              } else if (now > end) {
                status = "Expired";
                statusClass =
                  "border-brand-disabled/60 bg-brand-neutral text-brand-muted";
              }

              if (used >= voucher.quota) {
                status = "Quota reached";
                statusClass = "border-amber-200 bg-amber-50 text-amber-700";
              }

              return (
                <article
                  key={voucher.id}
                  className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm shadow-brand-navy/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-navy/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-brand-muted">
                        {voucher.event.name}
                      </p>

                      <h3 className="mt-2 break-all text-xl font-bold text-brand-navy">
                        {voucher.code}
                      </h3>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass}`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="my-5 border-b border-brand-navy/10 pb-5">
                    <span className="text-4xl font-extrabold tracking-tight text-brand-orange">
                      {voucher.discountValue}%
                    </span>

                    <span className="ml-2 text-sm font-medium text-brand-muted">
                      discount
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-brand-muted">Voucher usage</span>

                      <span className="font-semibold text-brand-navy">
                        {used} / {voucher.quota}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-brand-muted">Starts</span>

                      <span className="text-brand-text">
                        {formatDate(voucher.startDate)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-brand-muted">Ends</span>

                      <span className="text-brand-text">
                        {formatDate(voucher.endDate)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3 border-t border-brand-navy/10 pt-5">
                    <button
                      type="button"
                      onClick={() => handleEdit(voucher)}
                      className="rounded-lg border border-brand-navy/25 bg-white px-4 py-2 text-sm font-semibold text-brand-navy transition hover:border-brand-navy hover:bg-brand-navy hover:text-white"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(voucher)}
                      disabled={deleteVoucher.isPending}
                      className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:border-transparent disabled:bg-brand-disabled disabled:text-[#5b6b88]"
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
