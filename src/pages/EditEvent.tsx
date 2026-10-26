import ConfirmDialog from "@/components/ConfirmDialog";
import { Select } from "@/components/ui/select";
import useGetEventsById from "@/hooks/api/event/useGetEventById";
import useUpdateEvent from "@/hooks/api/event/useUpdateEvent";
import {
  updateEventSchema,
  type UpdateEventSchema,
} from "@/schemas/updateEvent";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";

const categoryOptions = [
  "Sports",
  "Technology",
  "Concert",
  "Arts",
  "Business",
  "Community & Culture",
  "Education & Training",
  "Others",
];

const fieldClass =
  "h-11 w-full rounded-lg border border-brand-disabled/80 px-3.5 text-sm shadow-sm outline-none transition placeholder:text-brand-muted/60 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15 disabled:cursor-not-allowed disabled:border-brand-disabled disabled:bg-brand-disabled/40 disabled:text-brand-muted";
const inputClass = `${fieldClass} bg-white text-brand-text`;
const mutedInputClass = `${fieldClass} bg-brand-neutral/70 text-brand-muted`;
const textareaClass =
  "w-full resize-y rounded-lg border border-brand-disabled/80 bg-white px-3.5 py-3 text-sm text-brand-text shadow-sm outline-none transition placeholder:text-brand-muted/60 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15";
const labelClass = "mb-2 block text-sm font-semibold text-brand-navy";
const hintClass = "mt-2 text-xs leading-5 text-brand-muted";
const errorClass = "mt-2 text-sm font-medium text-red-600";
const sectionClass =
  "space-y-7 rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm shadow-brand-navy/5 md:p-8";

function toDateTimeLocal(value: string) {
  const date = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function EditEvent() {
  const { id } = useParams();
  const eventId = Number(id);

  const { data: event, isPending, isError } = useGetEventsById(id);
  const { mutate, isPending: isSaving } = useUpdateEvent(eventId);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateEventSchema>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      customCategory: "",
      name: "",
      description: "",
      city: "",
      type: "VENUE",
      slug: "",
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    if (!event) return;

    const isKnownCategory = categoryOptions.includes(event.category.name);

    setSelectedCategory(isKnownCategory ? event.category.name : "Others");
    setCustomCategory(isKnownCategory ? "" : event.category.name);
    setImagePreview(event.image ?? "");

    reset({
      customCategory: event.category.name,
      name: event.name,
      description: event.description ?? "",
      city: event.type === "ONLINE" ? "" : event.city,
      type: event.type,
      slug: event.slug,
      startDate: toDateTimeLocal(event.startDate),
      endDate: toDateTimeLocal(event.endDate),
    });
  }, [event, reset]);

  const eventName = watch("name");
  const eventType = watch("type");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const [pendingValues, setPendingValues] = useState<UpdateEventSchema | null>(
    null,
  );

  function onSubmit(data: UpdateEventSchema) {
    setPendingValues(data);
  }

  function onConfirmSave() {
    if (!pendingValues) return;

    mutate(
      {
        ...pendingValues,
        city:
          pendingValues.type === "ONLINE"
            ? "Online"
            : pendingValues.city?.trim(),
        imageFile,
      },
      {
        onSettled: () => setPendingValues(null),
      },
    );
  }

  if (isPending) {
    return <p className="text-brand-muted">Loading event...</p>;
  }

  if (isError || !event) {
    return <p className="font-medium text-red-600">Failed to load event.</p>;
  }

  return (
    <div className="max-w-4xl pb-24">
      <Link
        to="/organizer/events"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy underline underline-offset-4 transition hover:text-brand-orange"
      >
        <span aria-hidden="true">←</span>
        Back to my events
      </Link>

      <header className="mb-8 mt-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
          Organizer dashboard
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
          Edit Event
        </h1>
        <p className="mt-2 text-sm leading-6 text-brand-text">
          Changes are visible to customers as soon as you save.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Event details */}
        <section className={sectionClass}>
          <div>
            <label htmlFor="event-name" className={labelClass}>
              Event name <span className="text-red-600">*</span>
            </label>

            <input
              id="event-name"
              {...register("name", {
                onChange: (e) => {
                  setValue("slug", createSlug(e.target.value));
                },
              })}
              placeholder="Enter your event name"
              className={inputClass}
            />

            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="event-category" className={labelClass}>
                Category <span className="text-red-600">*</span>
              </label>

              <Select
                id="event-category"
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setValue("customCategory", value === "Others" ? "" : value, {
                    shouldValidate: true,
                  });
                }}
                placeholder="Select a category"
                options={categoryOptions.map((category) => ({
                  value: category,
                  label: category,
                }))}
              />

              {errors.customCategory && selectedCategory !== "Others" && (
                <p className={errorClass}>{errors.customCategory.message}</p>
              )}
            </div>

            {selectedCategory === "Others" && (
              <div>
                <label htmlFor="custom-category" className={labelClass}>
                  Custom category <span className="text-red-600">*</span>
                </label>

                <input
                  id="custom-category"
                  value={customCategory}
                  onChange={(e) => {
                    const value = e.target.value;

                    setCustomCategory(value);
                    setValue("customCategory", value, { shouldValidate: true });
                  }}
                  placeholder="Enter your category"
                  className={inputClass}
                />

                {errors.customCategory && (
                  <p className={errorClass}>{errors.customCategory.message}</p>
                )}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="event-description" className={labelClass}>
              Event description
            </label>

            <textarea
              id="event-description"
              {...register("description")}
              rows={5}
              placeholder="Describe your event..."
              className={textareaClass}
            />
          </div>

          <div>
            <label htmlFor="event-image" className={labelClass}>
              Event image
            </label>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Event preview"
                className="mb-3 h-56 w-full rounded-xl border border-brand-navy/10 object-cover"
              />
            )}

            <input
              id="event-image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
              className="block w-full cursor-pointer rounded-lg border border-brand-disabled/80 bg-white px-3.5 py-2.5 text-sm text-brand-text shadow-sm file:mr-3 file:rounded-md file:border-0 file:bg-brand-orange-soft file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand-navy"
            />

            <p className={hintClass}>Leave empty to keep the current image.</p>
          </div>
        </section>

        {/* Event type and location */}
        <section className={sectionClass}>
          <div>
            <p className={labelClass}>
              Event type <span className="text-red-600">*</span>
            </p>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  { value: "VENUE", label: "Venue Event" },
                  { value: "ONLINE", label: "Online Event" },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setValue("type", option.value, { shouldValidate: true })
                  }
                  className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                    eventType === option.value
                      ? "border-brand-navy bg-brand-navy text-white shadow-sm shadow-brand-navy/15"
                      : "border-brand-navy/20 bg-white text-brand-navy hover:border-brand-navy/50 hover:bg-brand-neutral/70"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="event-city" className={labelClass}>
                {eventType === "VENUE" ? (
                  <>
                    Venue / city <span className="text-red-600">*</span>
                  </>
                ) : (
                  "Event location"
                )}
              </label>

              {eventType === "VENUE" ? (
                <input
                  id="event-city"
                  {...register("city")}
                  placeholder="Enter venue city, e.g. Bandung"
                  className={inputClass}
                />
              ) : (
                <input
                  id="event-city"
                  value="Online"
                  disabled
                  className={mutedInputClass}
                />
              )}

              {eventType === "VENUE" && errors.city && (
                <p className={errorClass}>{errors.city.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="event-slug" className={labelClass}>
                Event slug
              </label>

              <input
                id="event-slug"
                {...register("slug")}
                value={createSlug(eventName ?? "")}
                readOnly
                className={mutedInputClass}
              />

              <p className={hintClass}>Generated from the event name.</p>
            </div>
          </div>
        </section>

        {/* Event dates */}
        <section className={sectionClass}>
          <div>
            <h2 className="text-lg font-bold text-brand-navy">
              Date &amp; time <span className="text-red-600">*</span>
            </h2>
            <p className={hintClass}>When the event starts and ends.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="event-start" className={labelClass}>
                Start date &amp; time
              </label>

              <input
                id="event-start"
                type="datetime-local"
                {...register("startDate")}
                max={endDate || undefined}
                className={inputClass}
              />

              {errors.startDate && (
                <p className={errorClass}>{errors.startDate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="event-end" className={labelClass}>
                End date &amp; time
              </label>

              <input
                id="event-end"
                type="datetime-local"
                {...register("endDate")}
                min={startDate || undefined}
                className={inputClass}
              />

              {errors.endDate && (
                <p className={errorClass}>{errors.endDate.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* Tickets (read-only) */}
        <section className={sectionClass}>
          <div>
            <h2 className="text-lg font-bold text-brand-navy">Tickets</h2>
            <p className={hintClass}>
              Tickets cannot be changed after the event is published because
              customers may already hold them.
            </p>
          </div>

          <ul className="divide-y divide-brand-navy/10 rounded-xl border border-brand-navy/10">
            {event.tickets.map((ticket) => (
              <li
                key={ticket.id}
                className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
              >
                <span className="font-semibold text-brand-navy">
                  {ticket.name}
                </span>
                <span className="text-brand-muted">
                  Rp {ticket.price.toLocaleString("id-ID")} ·{" "}
                  {ticket.availableQuantity} / {ticket.quantity} left
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Bottom actions */}
        <div className="fixed bottom-0 left-0 z-40 w-full border-t border-brand-navy/10 bg-white/95 px-5 py-3 shadow-lg shadow-brand-navy/10 backdrop-blur md:px-8">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-end gap-3">
            <Link
              to="/organizer/events"
              className="rounded-lg border border-brand-navy/25 bg-white px-5 py-2.5 text-sm font-semibold text-brand-navy transition hover:border-brand-navy hover:bg-brand-neutral/70"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-brand-orange px-7 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-orange/20 transition hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:bg-brand-disabled disabled:text-[#5b6b88] disabled:shadow-none"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={pendingValues !== null}
        title="Save changes to this event?"
        description={`"${pendingValues?.name}" will be updated and customers will see the new details.`}
        confirmText="Save Changes"
        isPending={isSaving}
        onConfirm={onConfirmSave}
        onCancel={() => setPendingValues(null)}
      />
    </div>
  );
}

export default EditEvent;
