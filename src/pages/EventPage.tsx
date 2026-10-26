import EventCard from "@/components/EventCard";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import useGetEvents from "@/hooks/api/event/useGetEvents";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const standardCategories = [
  "Sports",
  "Technology",
  "Concert",
  "Arts",
  "Business",
  "Community & Culture",
  "Education & Training",
  "Others",
];

function EventsPage() {
  const { data: events, isPending, isError } = useGetEvents();

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  type EventPeriod = "UPCOMING" | "ONGOING" | "ENDED";

  const [period, setPeriod] = useState<EventPeriod>("UPCOMING");

  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const customCategories = [
    ...new Set(
      (events ?? [])
        .map((event) => event.category?.name)
        .filter(
          (name): name is string =>
            Boolean(name) &&
            !standardCategories.some(
              (category) => category.toLowerCase() === name.toLowerCase(),
            ),
        ),
    ),
  ];

  const categories = ["All", ...standardCategories, ...customCategories];

  const filteredEvents = (events ?? []).filter((event) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    const matchesPeriod =
      period === "UPCOMING"
        ? startDate > now
        : period === "ONGOING"
          ? startDate <= now && endDate > now
          : endDate <= now;

    const matchesName = event.name
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());

    const matchesLocation = event.city
      .toLowerCase()
      .includes(location.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      event.category?.name.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory === "Others" &&
        !standardCategories.some(
          (category) =>
            category !== "Others" &&
            category.toLowerCase() === event.category?.name.toLowerCase(),
        ));

    return matchesPeriod && matchesName && matchesLocation && matchesCategory;
  });

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const paginatedEvents = filteredEvents.slice(
    startIndex,
    startIndex + eventsPerPage,
  );

  const periods: { label: string; value: EventPeriod }[] = [
    { label: "Upcoming", value: "UPCOMING" },
    { label: "Ongoing", value: "ONGOING" },
    { label: "Ended", value: "ENDED" },
  ];

  return (
    <div className="min-h-screen bg-brand-neutral">
      <Navbar />

      <section className="relative isolate overflow-hidden bg-brand-navy px-5 py-16 text-white md:px-10 md:py-24">
        <img
          src="/events.png"
          alt="People attending an event"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-brand-navy via-brand-navy/95 to-brand-navy/55" />

        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
            Find your next experience
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
            Discover events for all the things you love
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
            Search by city or event name and find your next unforgettable
            experience.
          </p>

          <form
            className="mt-8 flex max-w-4xl flex-col gap-2 rounded-2xl border border-white/20 bg-white p-2 text-brand-text shadow-2xl shadow-brand-navy/25 md:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2 focus-within:bg-brand-neutral/60 md:py-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 shrink-0 text-brand-muted"
                aria-hidden="true"
              >
                <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <input
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Enter location"
                aria-label="Search by location"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-brand-muted/70"
              />
            </div>

            <div className="hidden w-px bg-brand-navy/10 md:block" />

            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2 focus-within:bg-brand-neutral/60 md:py-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 shrink-0 text-brand-muted"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search event"
                aria-label="Search event name"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-brand-muted/70"
              />
            </div>

            <Button
              type="submit"
              className="h-12 shrink-0 rounded-xl px-7 text-sm font-bold md:h-12"
            >
              Find Events
            </Button>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-10">
        <div
          id="categories"
          className="flex gap-6 overflow-x-auto border-b border-brand-navy/10 pb-0"
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1);
              }}
              className={`relative shrink-0 pb-3 pt-1 text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "text-brand-navy after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-brand-orange"
                  : "text-brand-muted hover:text-brand-navy"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <section id="events" className="pt-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
                Browse events
              </p>
              <h2 className="mt-1 text-2xl font-extrabold text-brand-navy md:text-3xl">
                Explore Events
              </h2>
            </div>

            <span className="rounded-full bg-brand-orange px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-brand-orange/20">
              {filteredEvents.length} events
            </span>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {periods.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setPeriod(item.value);
                  setCurrentPage(1);
                }}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  period === item.value
                    ? "bg-brand-navy text-white shadow-sm shadow-brand-navy/15"
                    : "border border-brand-navy/10 bg-white text-brand-text hover:border-brand-navy/25 hover:text-brand-navy"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {isPending && (
            <div className="rounded-2xl border border-brand-navy/10 bg-white p-8 text-sm text-brand-muted">
              Loading events...
            </div>
          )}

          {isError && (
            <div className="rounded-2xl border border-red-200 bg-white p-6 text-sm font-medium text-red-600">
              Unable to load events. Check that your backend is running.
            </div>
          )}

          {!isPending && !isError && filteredEvents.length === 0 && (
            <div className="rounded-2xl border border-brand-navy/10 bg-white p-10 text-center">
              <p className="font-semibold text-brand-navy">No events found</p>
              <p className="mt-2 text-sm text-brand-muted">
                Try another search or choose a different category.
              </p>
            </div>
          )}

          {!isPending && !isError && filteredEvents.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {paginatedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination className="mt-10">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#events"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((page) => Math.max(1, page - 1));
                        }}
                      />
                    </PaginationItem>

                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1,
                    ).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#events"
                          isActive={currentPage === page}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#events"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((page) =>
                            Math.min(totalPages, page + 1),
                          );
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default EventsPage;
