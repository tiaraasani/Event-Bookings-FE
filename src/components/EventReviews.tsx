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
        onError: (error: any) => {
          setMessage(
            error.response?.data?.message ??
              "Failed to submit your review. Please try again.",
          );
        },
      },
    );
  };

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 md:px-12">
      <div className="border-t border-gray-200 pt-10">
        <h2 className="text-2xl font-bold md:text-3xl">Event Reviews</h2>

        <p className="mt-2 text-gray-500">
          Read about other customers' experiences.
        </p>

        {reviews && reviews.length > 0 && (
          <div className="mt-6 rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Average rating</p>

            <p className="mt-2 text-3xl font-bold text-teal-700">
              {(
                reviews.reduce((total, review) => total + review.rating, 0) /
                reviews.length
              ).toFixed(1)}{" "}
              / 5
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </p>
          </div>
        )}

        {isLoading && <p className="mt-6 text-gray-500">Loading reviews...</p>}

        {isError && (
          <p className="mt-6 text-red-600">Failed to load event reviews.</p>
        )}

        {!isLoading && !isError && reviews?.length === 0 && (
          <p className="mt-6 rounded-xl border border-gray-200 p-6 text-gray-500">
            No reviews for this event yet.
          </p>
        )}

        {reviews && reviews.length > 0 && (
          <div className="mt-6 space-y-4">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-xl border border-gray-200 p-6"
              >
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  <div>
                    <h3 className="text-lg font-bold">{review.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      By {review.order.user.name}
                    </p>
                  </div>

                  <p className="font-semibold text-amber-500">
                    {"★".repeat(review.rating)}
                    <span className="text-gray-300">
                      {"★".repeat(5 - review.rating)}
                    </span>
                    <span className="ml-2 text-gray-700">
                      {review.rating}/5
                    </span>
                  </p>
                </div>

                <p className="mt-4 leading-7 text-gray-600">{review.comment}</p>

                <p className="mt-4 text-xs text-gray-400">
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

        <div className="mt-10 rounded-2xl border border-gray-200 p-6 md:p-8">
          <h3 className="text-xl font-bold">Write a Review</h3>

          <p className="mt-2 text-sm text-gray-500">
            You must have a paid ticket, and the event must have ended.
          </p>

          {!user && (
            <p className="mt-4 text-sm text-gray-600">
              Please log in to submit a review.
            </p>
          )}

          {user && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block font-medium">Your rating</label>

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      aria-label={`Rate ${star} out of 5 stars`}
                      aria-pressed={rating === star}
                      className={`text-3xl transition ${
                        star <= rating ? "text-amber-500" : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="review-title"
                  className="mb-2 block font-medium"
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder="Summarize your experience"
                />
              </div>

              <div>
                <label
                  htmlFor="review-comment"
                  className="mb-2 block font-medium"
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder="Tell us about your experience..."
                />
              </div>

              {message && (
                <p
                  role="status"
                  className={
                    createReview.isError ? "text-red-600" : "text-teal-700"
                  }
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={createReview.isPending}
                className="rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
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
