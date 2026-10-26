import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import Navbar from "@/components/Navbar";

type Promotion = {
  id: number;
  eventId: number;
  code: string;
  discountValue: number;
  quota: number;
  startDate: string;
  endDate: string;
  event: {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    city: string;
    startDate: string;
    endDate: string;
  };
  _count: {
    orders: number;
  };
};

type ApiResponse<T> = {
  message: string;
  data: T;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function PromotionsPage() {
  const [search, setSearch] = useState("");
  const [copiedCode, setCopiedCode] = useState("");

  const {
    data: promotions,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["public-promotions"],
    queryFn: async () => {
      const response =
        await axiosInstance.get<ApiResponse<Promotion[]>>("/vouchers/public");

      return response.data.data;
    },
  });

  const filteredPromotions = promotions?.filter((promotion) => {
    const searchValue = search.toLowerCase();

    return (
      promotion.code.toLowerCase().includes(searchValue) ||
      promotion.event.name.toLowerCase().includes(searchValue) ||
      promotion.event.city.toLowerCase().includes(searchValue)
    );
  });

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
    } catch {
      alert("Unable to copy the code. Please copy it manually.");
    }
  };

  return (
    <div className="min-h-screen bg-brand-neutral">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 md:pt-10">
        {/* Page Heading */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
            Special offers
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
            Available Promotions
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-brand-text">
            Discover exclusive discounts and save on tickets for your next
            event.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 rounded-2xl border border-brand-navy/10 bg-white p-4 shadow-sm shadow-brand-navy/5 sm:p-5">
          <label
            htmlFor="promotionSearch"
            className="mb-2 block text-sm font-semibold text-brand-navy"
          >
            Find a promotion
          </label>

          <input
            id="promotionSearch"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by voucher code, event, or city..."
            className="h-11 w-full rounded-lg border border-brand-disabled/80 bg-white px-3.5 text-sm text-brand-text shadow-sm outline-none transition placeholder:text-brand-muted/60 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15"
          />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="rounded-2xl border border-brand-navy/10 bg-white p-10 text-center text-brand-muted shadow-sm shadow-brand-navy/5">
            Loading available promotions...
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm shadow-brand-navy/5">
            <p className="font-medium text-red-600">
              We couldn't load promotions right now.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-orange-dark"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && filteredPromotions?.length === 0 && (
          <div className="rounded-2xl border border-brand-navy/10 bg-white px-5 py-12 text-center shadow-sm shadow-brand-navy/5">
            <h2 className="text-xl font-bold text-brand-navy">
              No promotions found
            </h2>

            <p className="mt-2 text-sm text-brand-muted">
              {search
                ? "Try searching with a different keyword."
                : "There are no active promotions available right now. Please check again later."}
            </p>
          </div>
        )}

        {/* Promotion Cards */}
        {!isLoading && !isError && filteredPromotions && (
          <>
            {filteredPromotions.length > 0 && (
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-brand-navy">
                  Explore Offers
                </h2>

                <span className="rounded-full bg-brand-orange px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-brand-orange/20">
                  {filteredPromotions.length}{" "}
                  {filteredPromotions.length === 1
                    ? "promotion"
                    : "promotions"}
                </span>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPromotions.map((promotion) => (
                <article
                  key={promotion.id}
                  className="overflow-hidden rounded-2xl border border-brand-navy/10 bg-white shadow-sm shadow-brand-navy/5 transition duration-200 hover:-translate-y-1 hover:border-brand-orange/35 hover:shadow-xl hover:shadow-brand-navy/10"
                >
                  {/* Event Image */}
                  {promotion.event.image ? (
                    <img
                      src={promotion.event.image}
                      alt={promotion.event.name}
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-44 items-center justify-center bg-brand-neutral">
                      <span className="text-5xl font-extrabold text-brand-navy/40">
                        {promotion.event.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  <div className="p-5">
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <span className="rounded-full border border-brand-orange/20 bg-brand-orange-soft px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-orange-dark">
                        Active
                      </span>

                      <span className="text-xs text-brand-muted">
                        Expires {formatDate(promotion.endDate)}
                      </span>
                    </div>

                    {/* Discount */}
                    <p className="text-4xl font-extrabold tracking-tight text-brand-orange">
                      {promotion.discountValue}%
                      <span className="ml-2 text-base font-bold text-brand-navy">
                        OFF
                      </span>
                    </p>

                    <h3 className="mt-3 line-clamp-2 text-xl font-bold leading-snug text-brand-navy">
                      {promotion.event.name}
                    </h3>

                    <p className="mt-1 text-sm text-brand-muted">
                      {promotion.event.city}
                    </p>

                    {/* Voucher Code */}
                    <div className="mt-5 rounded-xl border border-dashed border-brand-navy/25 bg-brand-neutral/60 p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-brand-muted">
                        Voucher code
                      </p>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="break-all font-bold tracking-wide text-brand-navy">
                          {promotion.code}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleCopyCode(promotion.code)}
                          className="shrink-0 rounded-lg border border-brand-navy/25 bg-white px-3 py-2 text-xs font-semibold text-brand-navy transition hover:border-brand-navy hover:bg-brand-navy hover:text-white"
                        >
                          {copiedCode === promotion.code
                            ? "Copied!"
                            : "Copy Code"}
                        </button>
                      </div>
                    </div>

                    {/* Usage */}
                    <div className="mt-4 flex justify-between gap-3 text-sm">
                      <span className="text-brand-muted">
                        Vouchers remaining
                      </span>

                      <span className="font-semibold text-brand-navy">
                        {Math.max(
                          0,
                          promotion.quota - promotion._count.orders,
                        )}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 border-t border-brand-navy/10 pt-4">
                      <Link
                        to={`/events/${promotion.event.id}`}
                        className="flex w-full items-center justify-center rounded-lg border border-brand-navy/25 bg-white px-5 py-2.5 text-center text-sm font-semibold text-brand-navy transition hover:border-brand-navy hover:bg-brand-navy hover:text-white"
                      >
                        View Event
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
export default PromotionsPage;
