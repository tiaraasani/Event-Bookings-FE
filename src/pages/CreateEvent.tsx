import Navbar from "@/components/Navbar";
import useCreateEvent from "@/hooks/api/event/useCreateEvent";
import {
  createEventSchema,
  type CreateEventSchema,
} from "@/schemas/createEvent";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  useWatch,
  type FieldErrors,
  type Resolver,
} from "react-hook-form";
import { useState } from "react";
import { Select } from "@/components/ui/select";

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

function CreateEvent() {
  const { mutate, isPending } = useCreateEvent();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateEventSchema>({
    resolver: zodResolver(createEventSchema) as Resolver<CreateEventSchema>,
    defaultValues: {
      categoryId: undefined,
      customCategory: "",
      name: "",
      description: "",
      city: "",
      type: "VENUE",
      slug: "",
      image: "",
      startDate: "",
      endDate: "",
      tickets: [
        {
          name: "Regular",
          price: 0,
          quantity: 100,
        },
      ],
    },
  });

  const eventName = useWatch({ control, name: "name" });
  const eventType = useWatch({ control, name: "type" });
  const startDate = useWatch({ control, name: "startDate" });
  const endDate = useWatch({ control, name: "endDate" });

  function createSlug(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function onSubmit(data: CreateEventSchema) {
    const categoryName =
      selectedCategory === "Others" ? customCategory.trim() : selectedCategory;

    if (!categoryName) {
      alert("Please select or enter an event category.");
      return;
    }

    mutate({
      ...data,
      city: data.type === "ONLINE" ? "Online" : data.city?.trim(),
      categoryId: undefined,
      customCategory: categoryName,
      imageFile,
    });
  }

  function onInvalid(errors: FieldErrors<CreateEventSchema>) {
    console.error("Form validation errors:", errors);

    const firstError = Object.entries(errors).find(
      ([, error]) => error && "message" in error,
    );

    if (firstError) {
      alert(`${firstError[0]}: ${firstError[1].message}`);
    } else {
      alert("Please check your form fields.");
    }
  }

  return (
    <div className="min-h-screen bg-brand-neutral">
      <Navbar />

      <div className="border-b border-brand-navy/10 bg-white px-5 py-6 md:px-8">
        <div className="mx-auto flex max-w-5xl items-center gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            aria-label="Go back"
            className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-brand-navy/15 text-xl text-brand-navy transition hover:border-brand-navy hover:bg-brand-neutral"
          >
            ←
          </button>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
              Organizer tools
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
              Create New Event
            </h1>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="mx-auto max-w-5xl space-y-5 px-4 pb-32 pt-8 md:px-5 md:pt-10"
      >
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

          {/* Category dropdown */}
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

                setValue("categoryId", undefined, { shouldValidate: true });
              }}
              placeholder="Select a category"
              options={categoryOptions.map((category) => ({
                value: category,
                label: category,
              }))}
            />

            {selectedCategory === "Others" && (
              <div className="mt-4">
                <label
                  htmlFor="custom-category"
                  className="mb-2 block text-sm font-semibold text-brand-navy"
                >
                  Custom category
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
              </div>
            )}

            <p className={hintClass}>
              Choose the category that best describes your event.
            </p>
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

          {/* Event image */}
          <div>
            <label htmlFor="event-image" className={labelClass}>
              Event image
            </label>

            <input
              id="event-image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  if (imagePreview) {
                    URL.revokeObjectURL(imagePreview);
                  }

                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
              className="block w-full rounded-lg border border-brand-disabled/80 bg-white text-sm text-brand-muted shadow-sm file:mr-4 file:border-0 file:bg-brand-orange-soft file:px-4 file:py-3 file:text-sm file:font-semibold file:text-brand-navy hover:file:bg-brand-orange/20"
            />

            <p className={hintClass}>
              Choose an image from your computer. JPG, PNG, or WebP recommended.
            </p>

            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Event preview"
                  className="h-56 w-full rounded-xl border border-brand-navy/10 object-cover"
                />

                <p className="mt-2 text-sm text-brand-text">
                  Selected file: {imageFile?.name}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    URL.revokeObjectURL(imagePreview);
                    setImageFile(null);
                    setImagePreview("");
                  }}
                  className="mt-2 text-sm font-semibold text-red-600 hover:underline"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Event type and location */}
        <section className={sectionClass}>
          <div>
            <p className={labelClass}>
              Select the event type <span className="text-red-600">*</span>
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  setValue("type", "VENUE", {
                    shouldValidate: true,
                  })
                }
                className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                  eventType === "VENUE"
                    ? "border-brand-navy bg-brand-navy text-white shadow-sm shadow-brand-navy/15"
                    : "border-brand-navy/20 bg-white text-brand-navy hover:border-brand-navy/50 hover:bg-brand-neutral/70"
                }`}
              >
                Venue Event
              </button>

              <button
                type="button"
                onClick={() =>
                  setValue("type", "ONLINE", {
                    shouldValidate: true,
                  })
                }
                className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                  eventType === "ONLINE"
                    ? "border-brand-navy bg-brand-navy text-white shadow-sm shadow-brand-navy/15"
                    : "border-brand-navy/20 bg-white text-brand-navy hover:border-brand-navy/50 hover:bg-brand-neutral/70"
                }`}
              >
                Online Event
              </button>
            </div>
          </div>

          {eventType === "VENUE" && (
            <div>
              <label htmlFor="event-city" className={labelClass}>
                Select a venue / city <span className="text-red-600">*</span>
              </label>

              <input
                id="event-city"
                {...register("city")}
                placeholder="Enter venue city, e.g. Bandung"
                className={inputClass}
              />

              {errors.city && (
                <p className={errorClass}>{errors.city.message}</p>
              )}
            </div>
          )}

          {eventType === "ONLINE" && (
            <div>
              <label htmlFor="event-location" className={labelClass}>
                Event location
              </label>

              <input
                id="event-location"
                value="Online"
                disabled
                className={inputClass}
              />
            </div>
          )}

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
          </div>
        </section>

        {/* Event dates */}
        <section className={sectionClass}>
          <h2 className="text-xl font-bold text-brand-navy">
            Select event date &amp; time <span className="text-red-600">*</span>
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="event-start" className={labelClass}>
                Start date &amp; time
              </label>

              <input
                id="event-start"
                type="datetime-local"
                {...register("startDate", {
                  onChange: (e) => {
                    const newStartDate = e.target.value;

                    if (endDate && endDate < newStartDate) {
                      setValue("endDate", "", {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }
                  },
                })}
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

        {/* Ticket information */}
        <section className={sectionClass}>
          <h2 className="text-xl font-bold text-brand-navy">
            Ticket information
          </h2>

          <div>
            <label htmlFor="ticket-name" className={labelClass}>
              Ticket name
            </label>

            <input
              id="ticket-name"
              {...register("tickets.0.name")}
              placeholder="Regular"
              className={inputClass}
            />

            {errors.tickets?.[0]?.name && (
              <p className={errorClass}>{errors.tickets[0].name.message}</p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="ticket-price" className={labelClass}>
                Ticket price (IDR)
              </label>

              <input
                id="ticket-price"
                type="number"
                min="0"
                {...register("tickets.0.price")}
                className={inputClass}
              />

              {errors.tickets?.[0]?.price && (
                <p className={errorClass}>{errors.tickets[0].price.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="ticket-quantity" className={labelClass}>
                Ticket quantity
              </label>

              <input
                id="ticket-quantity"
                type="number"
                min="1"
                {...register("tickets.0.quantity")}
                className={inputClass}
              />

              {errors.tickets?.[0]?.quantity && (
                <p className={errorClass}>
                  {errors.tickets[0].quantity.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Bottom actions */}
        <div className="fixed bottom-0 left-0 z-40 w-full border-t border-brand-navy/10 bg-white/95 px-5 py-3 shadow-lg shadow-brand-navy/10 backdrop-blur md:px-8">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-lg border border-brand-navy/25 bg-white px-5 py-2.5 text-sm font-semibold text-brand-navy transition hover:border-brand-navy hover:bg-brand-neutral/70"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-brand-orange px-7 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-orange/20 transition hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:bg-brand-disabled disabled:text-[#5b6b88] disabled:shadow-none"
            >
              {isPending ? "Creating..." : "Create Event"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;
