import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import useGetOrganizationReviews from "@/hooks/api/useGetOrganizationReviews";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useGetMyTransactions } from "@/hooks/api/useGetMyTransaction";
import useCreateReview from "@/hooks/api/useCreateReviews";

const inputClass =
  "h-11 w-full rounded-lg border border-brand-disabled/80 bg-white px-3.5 text-sm text-brand-text shadow-sm outline-none transition placeholder:text-brand-muted/60 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15";

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
    <main className="min-h-screen bg-brand-neutral">
      <Navbar />

      <section className="mx-auto max-w-5xl px-5 py-8 sm:px-8 md:py-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-navy underline underline-offset-4 transition hover:text-brand-orange"
        >
          <span aria-hidden="true">←</span>
          Back
        </button>

        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
            Organizer feedback
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy md:text-4xl">
            Organizer Reviews
          </h1>

          <p className="mt-2 text-sm leading-6 text-brand-text">
            See what customers think about this organizer.
          </p>
        </header>

        <div className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm shadow-brand-navy/5 md:p-8">
          <h2 className="text-xl font-bold text-brand-navy">
            Write an Organizer Review
          </h2>
          <p className="mt-2 text-sm text-brand-muted">
            Select an eligible event and share your experience.
          </p>

          {eligibleEvents.length === 0 ? (
            <p className="mt-5 rounded-xl bg-brand-neutral/70 px-4 py-3 text-sm text-brand-text">
              No eligible paid orders for this organizer's ended events were
              found.
            </p>
          ) : (
            <form
              className="mt-6 space-y-5"
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
                  className="mb-2 block text-sm font-semibold text-brand-navy"
                >
                  Select event
                </label>
                <select
                  id="review-event"
                  required
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className={inputClass}
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
                <p className="mb-2 text-sm font-semibold text-brand-navy">
                  Rating
                </p>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      aria-label={`Rate ${star} out of 5`}
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
                  className="mb-2 block text-sm font-semibold text-brand-navy"
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
                  className={inputClass}
                  placeholder="Summarize your experience"
                />
              </div>

              <div>
                <label
                  htmlFor="review-comment"
                  className="mb-2 block text-sm font-semibold text-brand-navy"
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
                  className="w-full rounded-lg border border-brand-disabled/80 bg-white px-3.5 py-3 text-sm text-brand-text shadow-sm outline-none transition placeholder:text-brand-muted/60 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15"
                  placeholder="Tell others about your experience"
                />
              </div>

              {createReview.isError && (
                <p className="text-sm font-medium text-red-600">
                  Failed to publish review. Check your eligibility and try
                  again.
                </p>
              )}

              {createReview.isSuccess && (
                <p className="text-sm font-medium text-emerald-600">
                  Review published successfully.
                </p>
              )}

              <Button type="submit" disabled={createReview.isPending}>
                {createReview.isPending ? "Publishing..." : "Publish Review"}
              </Button>
            </form>
          )}
        </div>

        {isLoading && (
          <p className="mt-8 text-brand-muted">Loading reviews...</p>
        )}

        {isError && (
          <p className="mt-8 font-medium text-red-600">
            Failed to load reviews. Please try again.
          </p>
        )}

        {!isLoading && !isError && reviews?.length === 0 && (
          <div className="mt-6 rounded-2xl border border-brand-navy/10 bg-white p-10 text-center shadow-sm shadow-brand-navy/5">
            <h2 className="text-xl font-bold text-brand-navy">
              No reviews yet
            </h2>
            <p className="mt-2 text-sm text-brand-muted">
              This organizer has not received any reviews yet.
            </p>
          </div>
        )}

        {!isLoading && !isError && reviews && reviews.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm shadow-brand-navy/5">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                Average rating
              </p>
              <p className="mt-2 text-3xl font-extrabold text-brand-navy">
                {(
                  reviews.reduce((total, review) => total + review.rating, 0) /
                  reviews.length
                ).toFixed(1)}
                <span className="ml-1 text-base font-medium text-brand-muted">
                  / 5
                </span>
              </p>
              <p className="mt-1 text-sm text-brand-muted">
                {reviews.length} review{reviews.length === 1 ? "" : "s"}
              </p>
            </div>

            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm shadow-brand-navy/5"
              >
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  <div>
                    <h2 className="text-lg font-bold text-brand-navy">
                      {review.title}
                    </h2>
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

                <p className="mt-4 leading-7 text-brand-text">
                  {review.comment}
                </p>

                <p className="mt-4 text-sm text-brand-muted">
                  Event: {review.order.ticket.event.name}
                </p>

                <p className="mt-1 text-xs text-brand-muted">
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
