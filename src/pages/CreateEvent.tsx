import Navbar from "@/components/Navbar";
import useCreateEvent from "@/hooks/api/event/useCreateEvent";
import {
  createEventSchema,
  type CreateEventSchema,
} from "@/schemas/createEvent";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldErrors } from "react-hook-form";
import { useState } from "react";

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

function CreateEvent() {
  const { mutate, isPending } = useCreateEvent();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateEventSchema>({
    resolver: zodResolver(createEventSchema) as any,
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

  const eventName = watch("name");
  const eventType = watch("type");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

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
    <div className="min-h-screen bg-[#f3f6f8] text-[#123638]">
      <Navbar />

      <div className="border-b border-gray-200 bg-white px-5 pb-5 pt-28 md:px-6">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-3xl text-slate-500 hover:text-teal-600"
          >
            ←
          </button>

          <h1 className="text-2xl font-semibold">Create New Event</h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
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

                setValue("categoryId", undefined, { shouldValidate: true });
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

            <p className="mt-2 text-sm text-gray-500">
              Choose the category that best describes your event.
            </p>
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
                  if (imagePreview) {
                    URL.revokeObjectURL(imagePreview);
                  }

                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
              className="w-full rounded border border-gray-300 px-4 py-3 file:mr-4 file:rounded file:border-0 file:bg-teal-500 file:px-4 file:py-2 file:font-semibold file:text-white"
            />

            <p className="mt-2 text-sm text-gray-500">
              Choose an image from your computer. JPG, PNG, or WebP recommended.
            </p>

            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Event preview"
                  className="h-56 w-full rounded-md border object-cover"
                />

                <p className="mt-2 text-sm text-gray-600">
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
        <section className="space-y-8 rounded-md border border-gray-200 bg-white p-5 md:p-10">
          <div>
            <label className="mb-4 block text-xl font-medium">
              Select the event type <span className="text-red-500">*</span>
            </label>

            <div className="flex flex-wrap">
              <button
                type="button"
                onClick={() =>
                  setValue("type", "VENUE", {
                    shouldValidate: true,
                  })
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
                  setValue("type", "ONLINE", {
                    shouldValidate: true,
                  })
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

        {/* Ticket information */}
        <section className="space-y-7 rounded-md border border-gray-200 bg-white p-5 md:p-10">
          <h2 className="text-xl font-medium">Ticket information</h2>

          <div>
            <label className="mb-2 block">Ticket name</label>

            <input
              {...register("tickets.0.name")}
              placeholder="Regular"
              className="w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-teal-500"
            />

            {errors.tickets?.[0]?.name && (
              <p className="mt-2 text-sm text-red-500">
                {errors.tickets[0].name.message}
              </p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block">Ticket price (IDR)</label>

              <input
                type="number"
                min="0"
                {...register("tickets.0.price")}
                className="w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-teal-500"
              />

              {errors.tickets?.[0]?.price && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.tickets[0].price.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block">Ticket quantity</label>

              <input
                type="number"
                min="1"
                {...register("tickets.0.quantity")}
                className="w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-teal-500"
              />

              {errors.tickets?.[0]?.quantity && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.tickets[0].quantity.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Bottom actions */}
        <div className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-between border-t border-gray-200 bg-white px-5 py-3 shadow-sm md:px-8">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded bg-gray-100 px-5 py-3 font-semibold hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="rounded bg-[#20aaa7] px-7 py-3 font-semibold text-white transition hover:bg-[#159794] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;
