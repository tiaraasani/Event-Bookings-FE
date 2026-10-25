import Navbar from "@/components/Navbar";
import useGetOrganizationReviews from "@/hooks/api/useGetOrganizationReviews";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useGetMyTransactions } from "@/hooks/api/useGetMyTransaction";
import useCreateReview from "@/hooks/api/useCreateReviews";

function OrganizerReviewsPage() {
  const { organizationId } = useParams();
  const navigate = useNavigate();
  const { data: transactions } = useGetMyTransactions();
  const createReview = useCreateReview();

  const [selectedEventId, setSelectedEventId] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const eligibleEvents = (transactions ?? []).filter(
    (order) =>
      order.paymentStatus === "PAID" &&
      String(order.ticket.event.organization?.id) === organizationId &&
      new Date(order.ticket.event.endDate) <= new Date(),
  );

  const {
    data: reviews,
    isLoading,
    isError,
  } = useGetOrganizationReviews(organizationId);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 py-12 md:px-12">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-8 font-semibold text-teal-700 hover:text-teal-800"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold md:text-4xl">Organizer Reviews</h1>

        <p className="mt-3 text-gray-500">
          See what customers think about this organizer.
        </p>

        <div className="mt-8 rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold">Write an Organizer Review</h2>
          <p className="mt-2 text-sm text-gray-500">
            Select an eligible event and share your experience.
          </p>

          {eligibleEvents.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">
              No eligible paid orders for this organizer's ended events were
              found.
            </p>
          ) : (
            <form
              className="mt-5 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();

                if (!selectedEventId) return;

                createReview.mutate(
                  {
                    eventId: Number(selectedEventId),
                    type: "ORGANIZER",
                    rating,
                    title,
                    comment,
                  },
                  {
                    onSuccess: () => {
                      setTitle("");
                      setComment("");
                      setRating(5);
                    },
                  },
                );
              }}
            >
              <div>
                <label
                  htmlFor="review-event"
                  className="mb-2 block font-medium"
                >
                  Select event
                </label>
                <select
                  id="review-event"
                  required
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-3"
                >
                  <option value="">Choose an event</option>
                  {eligibleEvents.map((order) => (
                    <option key={order.id} value={order.ticket.event.id}>
                      {order.ticket.event.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-2 font-medium">Rating</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-3xl ${
                        star <= rating ? "text-amber-400" : "text-gray-300"
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
                  Title
                </label>
                <input
                  id="review-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  minLength={3}
                  maxLength={100}
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-3"
                  placeholder="Summarize your experience"
                />
              </div>

              <div>
                <label
                  htmlFor="review-comment"
                  className="mb-2 block font-medium"
                >
                  Comment
                </label>
                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  minLength={10}
                  maxLength={1000}
                  required
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-4 py-3"
                  placeholder="Tell others about your experience"
                />
              </div>

              {createReview.isError && (
                <p className="text-sm text-red-600">
                  Failed to publish review. Check your eligibility and try
                  again.
                </p>
              )}

              {createReview.isSuccess && (
                <p className="text-sm text-green-600">
                  Review published successfully.
                </p>
              )}

              <button
                type="submit"
                disabled={createReview.isPending}
                className="rounded-md bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
              >
                {createReview.isPending ? "Publishing..." : "Publish Review"}
              </button>
            </form>
          )}
        </div>

        {isLoading && <p className="mt-8 text-gray-500">Loading reviews...</p>}

        {isError && (
          <p className="mt-8 text-red-600">
            Failed to load reviews. Please try again.
          </p>
        )}

        {!isLoading && !isError && reviews?.length === 0 && (
          <div className="mt-8 rounded-xl border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold">No reviews yet</h2>
            <p className="mt-2 text-gray-500">
              This organizer has not received any reviews yet.
            </p>
          </div>
        )}

        {!isLoading && !isError && reviews && reviews.length > 0 && (
          <div className="mt-8 space-y-5">
            <div className="rounded-xl border border-gray-200 p-6">
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

            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-xl border border-gray-200 p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  <div>
                    <h2 className="text-lg font-bold">{review.title}</h2>
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

                <p className="mt-4 text-sm text-gray-400">
                  Event: {review.order.ticket.event.name}
                </p>

                <p className="mt-1 text-xs text-gray-400">
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
      </section>
    </main>
  );
}

export default OrganizerReviewsPage;
