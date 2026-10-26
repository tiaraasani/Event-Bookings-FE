import { useState } from "react";
import useCreateReview from "@/hooks/api/useCreateReviews";

interface OrganizerReviewFormProps {
  eventId: number;
}

const inputClass =
  "w-full rounded-lg border border-brand-disabled/80 bg-white px-3.5 py-2.5 text-sm text-brand-text shadow-sm outline-none transition placeholder:text-brand-muted/60 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15";

function OrganizerReviewForm({ eventId }: OrganizerReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const createReview = useCreateReview();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createReview.mutate(
      {
        eventId,
        type: "ORGANIZER",
        rating,
        title,
        comment,
      },
      {
        onSuccess: () => {
          setRating(5);
          setTitle("");
          setComment("");
        },
      },
    );
  };

  return (
    <section className="mt-8 border-t border-brand-navy/10 pt-8">
      <h2 className="mb-2 text-2xl font-bold text-brand-navy">
        Review the Organizer
      </h2>

      <p className="mb-5 text-sm leading-6 text-brand-text">
        Share your experience with the organization behind this event.
      </p>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-brand-navy">
            Your rating
          </label>

          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`Rate ${star} out of 5`}
                onClick={() => setRating(star)}
                className={`text-3xl transition ${
                  star <= rating ? "text-brand-orange" : "text-brand-disabled"
                } hover:text-brand-orange`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="organizer-review-title"
            className="mb-2 block text-sm font-semibold text-brand-navy"
          >
            Review title
          </label>

          <input
            id="organizer-review-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            minLength={3}
            maxLength={100}
            required
            className={inputClass}
            placeholder="How was the organizer?"
          />
        </div>

        <div>
          <label
            htmlFor="organizer-review-comment"
            className="mb-2 block text-sm font-semibold text-brand-navy"
          >
            Your review
          </label>

          <textarea
            id="organizer-review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            minLength={10}
            maxLength={1000}
            required
            rows={4}
            className="w-full rounded-lg border border-brand-disabled/80 bg-white px-3.5 py-3 text-sm text-brand-text shadow-sm outline-none transition placeholder:text-brand-muted/60 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15"
            placeholder="Tell others about your experience..."
          />
        </div>

        {createReview.isError && (
          <p className="text-sm font-medium text-red-600">
            Unable to submit your review. You may need an eligible paid order
            for an event that has ended, or you may have already reviewed this
            organizer for this order.
          </p>
        )}

        {createReview.isSuccess && (
          <p className="text-sm font-medium text-emerald-600">
            Your organizer review was submitted successfully.
          </p>
        )}

        <button
          type="submit"
          disabled={createReview.isPending}
          className="rounded-lg bg-brand-orange px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-orange/20 transition hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:bg-brand-disabled disabled:text-[#5b6b88] disabled:shadow-none"
        >
          {createReview.isPending ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </section>
  );
}

export default OrganizerReviewForm;
