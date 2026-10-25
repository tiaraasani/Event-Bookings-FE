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
    <div className="min-h-screen bg-[#F3F6F8] text-[#123B43]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8">
        {/* Page Heading */}
        <div className="mb-8 border-b border-slate-200 pb-6">
          <p className="mb-2 text-sm font-medium text-teal-600">
            SPECIAL OFFERS
          </p>

          <h1 className="text-3xl font-semibold sm:text-4xl">
            Available Promotions
          </h1>

          <p className="mt-3 max-w-2xl text-base text-slate-500">
            Discover exclusive discounts and save on tickets for your next
            event.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <label
            htmlFor="promotionSearch"
            className="mb-2 block text-sm font-medium"
          >
            Find a promotion
          </label>

          <input
            id="promotionSearch"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by voucher code, event, or city..."
            className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500">
            Loading available promotions...
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="rounded-lg border border-red-200 bg-white p-6 text-center">
            <p className="text-red-600">
              We couldn't load promotions right now.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-md bg-[#20AAA8] px-5 py-2.5 font-semibold text-white transition hover:bg-[#189896]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && filteredPromotions?.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-white px-5 py-12 text-center shadow-sm">
            <h2 className="text-xl font-medium">No promotions found</h2>

            <p className="mt-2 text-sm text-slate-500">
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
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-medium">Explore Offers</h2>

                <span className="text-sm text-slate-500">
                  {filteredPromotions.length}{" "}
                  {filteredPromotions.length === 1 ? "promotion" : "promotions"}
                </span>
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPromotions.map((promotion) => (
                <article
                  key={promotion.id}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Event Image */}
                  {promotion.event.image ? (
                    <img
                      src={promotion.event.image}
                      alt={promotion.event.name}
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-44 items-center justify-center bg-[#E3F2F1]">
                      <span className="text-5xl font-bold text-teal-700">
                        {promotion.event.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  <div className="p-5">
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <span className="rounded-md border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
                        Active
                      </span>

                      <span className="text-xs text-slate-500">
                        Expires {formatDate(promotion.endDate)}
                      </span>
                    </div>

                    {/* Discount */}
                    <p className="text-4xl font-semibold tracking-tight text-teal-600">
                      {promotion.discountValue}%
                      <span className="ml-2 text-base font-medium">OFF</span>
                    </p>

                    <h3 className="mt-3 line-clamp-2 text-xl font-semibold text-[#123B43]">
                      {promotion.event.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {promotion.event.city}
                    </p>

                    {/* Voucher Code */}
                    <div className="mt-5 rounded-md border border-dashed border-teal-300 bg-teal-50 p-3">
                      <p className="text-xs text-slate-500">VOUCHER CODE</p>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="break-all font-bold tracking-wide text-[#123B43]">
                          {promotion.code}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleCopyCode(promotion.code)}
                          className="shrink-0 rounded-md border border-teal-300 bg-white px-3 py-2 text-sm font-medium text-teal-700 transition hover:bg-teal-100"
                        >
                          {copiedCode === promotion.code
                            ? "Copied!"
                            : "Copy Code"}
                        </button>
                      </div>
                    </div>

                    {/* Usage */}
                    <div className="mt-4 flex justify-between text-sm">
                      <span className="text-slate-500">Vouchers remaining</span>

                      <span className="font-medium text-[#123B43]">
                        {Math.max(0, promotion.quota - promotion._count.orders)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 border-t border-slate-200 pt-4">
                      <Link
                        to={`/events/${promotion.event.id}`}
                        className="flex w-full items-center justify-center rounded-md bg-[#20AAA8] px-5 py-3 text-center font-semibold text-white transition hover:bg-[#189896]"
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
