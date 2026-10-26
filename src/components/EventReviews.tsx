import { useState } from "react";
import { useParams } from "react-router-dom";
import useGetEventReviews from "@/hooks/api/useGetEventReviews";
import useCreateReview from "@/hooks/api/useCreateReviews";
import { useAuth } from "@/stores/useAuth";

function EventReviews() {
  const { id } = useParams();
  const user = useAuth((state) => state.user);

  const { data: reviews, isLoading, isError } = useGetEventReviews(id);

  const createReview = useCreateReview();

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    if (!id) return;

    createReview.mutate(
      {
        eventId: Number(id),
        type: "EVENT",
        rating,
        title,
        comment,
      },
      {
        onSuccess: () => {
          setTitle("");
          setComment("");
          setRating(5);
          setMessage("Your review was submitted successfully.");
        },
        onError: (error: unknown) => {
          const apiMessage = (
            error as { response?: { data?: { message?: string } } }
          ).response?.data?.message;

          setMessage(
            apiMessage ??
              "Failed to submit your review. Please try again.",
          );
        },
      },
    );
  };

  return (
    <section className="pb-4">
      <div className="border-t border-brand-navy/10 pt-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
          Community feedback
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-brand-navy md:text-3xl">
          Event Reviews
        </h2>

        <p className="mt-2 text-sm text-brand-muted">
          Read about other customers' experiences.
        </p>

        {reviews && reviews.length > 0 && (
          <div className="mt-6 inline-flex flex-wrap items-center gap-4 rounded-2xl border border-brand-navy/10 bg-white px-6 py-4 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                Average rating
              </p>
              <p className="mt-1 text-3xl font-extrabold text-brand-navy">
                {(
                  reviews.reduce((total, review) => total + review.rating, 0) /
                  reviews.length
                ).toFixed(1)}
                <span className="ml-1 text-base font-medium text-brand-muted">
                  / 5
                </span>
              </p>
            </div>
            <div className="h-10 w-px bg-brand-navy/10" />
            <p className="text-sm text-brand-muted">
              {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </p>
          </div>
        )}

        {isLoading && <p className="mt-6 text-brand-muted">Loading reviews...</p>}

        {isError && (
          <p className="mt-6 font-medium text-red-600">
            Failed to load event reviews.
          </p>
        )}

        {!isLoading && !isError && reviews?.length === 0 && (
          <p className="mt-6 rounded-2xl border border-brand-navy/10 bg-white p-6 text-brand-muted">
            No reviews for this event yet.
          </p>
        )}

        {reviews && reviews.length > 0 && (
          <div className="mt-6 space-y-4">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm shadow-brand-navy/5"
              >
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  <div>
                    <h3 className="text-lg font-bold text-brand-navy">
                      {review.title}
                    </h3>
                    <p className="mt-1 text-sm text-brand-muted">
                      By {review.order.user.name}
                    </p>
                  </div>

                  <p className="font-semibold text-brand-orange">
                    {"★".repeat(review.rating)}
                    <span className="text-brand-disabled">
                      {"★".repeat(5 - review.rating)}
                    </span>
                    <span className="ml-2 text-brand-text">
                      {review.rating}/5
                    </span>
                  </p>
                </div>

                <p className="mt-4 leading-7 text-brand-text">{review.comment}</p>

                <p className="mt-4 text-xs text-brand-muted">
                  {new Date(review.createdAt).toLocaleDateString("en-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </article>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm shadow-brand-navy/5 md:p-8">
          <h3 className="text-xl font-bold text-brand-navy">Write a Review</h3>

          <p className="mt-2 text-sm text-brand-muted">
            You must have a paid ticket, and the event must have ended.
          </p>

          {!user && (
            <p className="mt-4 rounded-xl bg-brand-neutral px-4 py-3 text-sm text-brand-text">
              Please log in to submit a review.
            </p>
          )}

          {user && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-brand-navy">
                  Your rating
                </label>

                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      aria-label={`Rate ${star} out of 5 stars`}
                      aria-pressed={rating === star}
                      className={`text-3xl transition ${
                        star <= rating
                          ? "text-brand-orange"
                          : "text-brand-disabled"
                      } hover:text-brand-orange`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="review-title"
                  className="mb-2 block text-sm font-medium text-brand-navy"
                >
                  Review title
                </label>

                <input
                  id="review-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  minLength={3}
                  maxLength={100}
                  className="h-11 w-full rounded-lg border border-brand-disabled/80 bg-white px-3.5 text-sm text-brand-text outline-none transition placeholder:text-brand-muted/70 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15"
                  placeholder="Summarize your experience"
                />
              </div>

              <div>
                <label
                  htmlFor="review-comment"
                  className="mb-2 block text-sm font-medium text-brand-navy"
                >
                  Your review
                </label>

                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  minLength={10}
                  maxLength={1000}
                  rows={5}
                  className="w-full rounded-lg border border-brand-disabled/80 bg-white px-3.5 py-3 text-sm text-brand-text outline-none transition placeholder:text-brand-muted/70 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15"
                  placeholder="Tell us about your experience..."
                />
              </div>

              {message && (
                <p
                  role="status"
                  className={
                    createReview.isError
                      ? "text-sm font-medium text-red-600"
                      : "text-sm font-medium text-emerald-600"
                  }
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={createReview.isPending}
                className="rounded-lg bg-brand-orange px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-orange/20 transition hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:bg-brand-disabled disabled:text-[#5b6b88] disabled:shadow-none"
              >
                {createReview.isPending ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default EventReviews;
