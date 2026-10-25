import ConfirmDialog from "@/components/ConfirmDialog";
import Navbar from "@/components/Navbar";
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
    return (
      <>
        <Navbar />
        <p className="p-8 pt-32">Loading event...</p>
      </>
    );
  }

  if (isError || !event) {
    return (
      <>
        <Navbar />
        <p className="p-8 pt-32">Failed to load event.</p>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f6f8] text-[#123638]">
      <Navbar />

      <div className="border-b border-gray-200 bg-white px-5 pb-5 pt-28 md:px-6">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <Link
            to="/profile"
            className="text-3xl text-slate-500 hover:text-teal-600"
          >
            ←
          </Link>

          <h1 className="text-2xl font-semibold">Edit Event</h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto max-w-5xl space-y-8 px-4 py-8 pb-28 md:px-5 md:py-10"
      >
        {/* Event details */}
        <section className="space-y-7 rounded-md border border-gray-200 bg-white p-5 md:p-10">
          <div>
            <label className="mb-4 block text-xl font-medium">
              Event name <span className="text-red-500">*</span>
            </label>

            <input
              {...register("name", {
                onChange: (e) => {
                  setValue("slug", createSlug(e.target.value));
                },
              })}
              placeholder="Enter your event name"
              className="w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-teal-500"
            />

            {errors.name && (
              <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Category dropdown */}
          <div>
            <label className="mb-4 block text-xl font-medium">
              Category <span className="text-red-500">*</span>
            </label>

            <select
              value={selectedCategory}
              onChange={(e) => {
                const value = e.target.value;

                setSelectedCategory(value);
                setValue("customCategory", value === "Others" ? "" : value, {
                  shouldValidate: true,
                });
              }}
              className="w-full rounded border border-gray-300 bg-white px-4 py-3 outline-none focus:border-teal-500"
            >
              <option value="">Select a category</option>

              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {selectedCategory === "Others" && (
              <div className="mt-4">
                <label className="mb-2 block font-medium">
                  Custom category
                </label>

                <input
                  value={customCategory}
                  onChange={(e) => {
                    const value = e.target.value;

                    setCustomCategory(value);
                    setValue("customCategory", value, { shouldValidate: true });
                  }}
                  placeholder="Enter your category"
                  className="w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-teal-500"
                />
              </div>
            )}

            {errors.customCategory && (
              <p className="mt-2 text-sm text-red-500">
                {errors.customCategory.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-4 block text-xl font-medium">
              Event description
            </label>

            <textarea
              {...register("description")}
              rows={5}
              placeholder="Describe your event..."
              className="w-full resize-y rounded border border-gray-300 px-4 py-3 outline-none focus:border-teal-500"
            />
          </div>

          {/* Event image */}
          <div>
            <label className="mb-4 block text-xl font-medium">
              Event image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
              className="w-full rounded border border-gray-300 px-4 py-3 file:mr-4 file:rounded file:border-0 file:bg-teal-500 file:px-4 file:py-2 file:font-semibold file:text-white"
            />

            <p className="mt-2 text-sm text-gray-500">
              Leave empty to keep the current image.
            </p>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Event preview"
                className="mt-4 h-56 w-full rounded-md border object-cover"
              />
            )}
          </div>
        </section>

        {/* Event type and location */}
        <section className="space-y-8 rounded-md border border-gray-200 bg-white p-5 md:p-10">
          <div>
            <label className="mb-4 block text-xl font-medium">
              Select the event type <span className="text-red-500">*</span>
            </label>

            <div className="flex flex-wrap">
              <button
                type="button"
                onClick={() =>
                  setValue("type", "VENUE", { shouldValidate: true })
                }
                className={`border border-teal-500 px-4 py-3 font-semibold ${
                  eventType === "VENUE"
                    ? "bg-[#20aaa7] text-white"
                    : "bg-white text-teal-600 hover:bg-teal-50"
                }`}
              >
                Venue Event
              </button>

              <button
                type="button"
                onClick={() =>
                  setValue("type", "ONLINE", { shouldValidate: true })
                }
                className={`border-y border-r border-teal-500 px-4 py-3 font-semibold ${
                  eventType === "ONLINE"
                    ? "bg-[#20aaa7] text-white"
                    : "bg-white text-teal-600 hover:bg-teal-50"
                }`}
              >
                Online Event
              </button>
            </div>
          </div>

          {eventType === "VENUE" && (
            <div>
              <label className="mb-4 block text-xl font-medium">
                Select a venue / city <span className="text-red-500">*</span>
              </label>

              <input
                {...register("city")}
                placeholder="Enter venue city, e.g. Bandung"
                className="w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-teal-500"
              />

              {errors.city && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.city.message}
                </p>
              )}
            </div>
          )}

          {eventType === "ONLINE" && (
            <div>
              <label className="mb-4 block text-xl font-medium">
                Event location
              </label>

              <input
                value="Online"
                disabled
                className="w-full rounded border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500"
              />
            </div>
          )}

          <div>
            <label className="mb-4 block text-xl font-medium">Event slug</label>

            <input
              {...register("slug")}
              value={createSlug(eventName ?? "")}
              readOnly
              className="w-full rounded border border-gray-300 bg-gray-50 px-4 py-3 text-gray-500"
            />
          </div>
        </section>

        {/* Event dates */}
        <section className="space-y-7 rounded-md border border-gray-200 bg-white p-5 md:p-10">
          <h2 className="text-xl font-medium">
            Select event date &amp; time <span className="text-red-500">*</span>
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block">Start date &amp; time</label>

              <input
                type="datetime-local"
                {...register("startDate")}
                max={endDate || undefined}
                className="w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-teal-500"
              />

              {errors.startDate && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block">End date &amp; time</label>

              <input
                type="datetime-local"
                {...register("endDate")}
                min={startDate || undefined}
                className="w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-teal-500"
              />

              {errors.endDate && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Tickets (read-only) */}
        <section className="space-y-4 rounded-md border border-gray-200 bg-white p-5 md:p-10">
          <h2 className="text-xl font-medium">Tickets</h2>

          <p className="text-sm text-gray-500">
            Tickets cannot be changed after the event is published because
            customers may already hold them.
          </p>

          {event.tickets.map((ticket) => (
            <p
              key={ticket.id}
              className="flex justify-between gap-3 rounded border border-gray-100 bg-gray-50 px-4 py-3 text-sm"
            >
              <span>{ticket.name}</span>
              <span>
                Rp {ticket.price.toLocaleString("id-ID")} ·{" "}
                {ticket.availableQuantity} / {ticket.quantity} left
              </span>
            </p>
          ))}
        </section>

        {/* Bottom actions */}
        <div className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-between border-t border-gray-200 bg-white px-5 py-3 shadow-sm md:px-8">
          <Link
            to="/profile"
            className="rounded bg-gray-100 px-5 py-3 font-semibold hover:bg-gray-200"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="rounded bg-[#20aaa7] px-7 py-3 font-semibold text-white transition hover:bg-[#159794] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
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
