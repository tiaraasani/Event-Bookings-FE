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

  // Calculate pagination after filtering the events.
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const startIndex = (currentPage - 1) * eventsPerPage;

  const paginatedEvents = filteredEvents.slice(
    startIndex,
    startIndex + eventsPerPage,
  );

  // Reset to page 1 when the search or filters change.
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, location, selectedCategory, period]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="relative flex min-h-[620px] items-center overflow-hidden px-5 pb-12 pt-32 text-white md:px-12">
        <img
          src="/events.png"
          alt="People attending an event"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="relative z-10 w-full max-w-4xl">
          <p className="font-semibold tracking-widest text-teal-300">
            FIND YOUR NEXT EXPERIENCE
          </p>

          <h1 className="my-5 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            Discover Events For All The Things You Love
          </h1>

          <form
            className="flex max-w-4xl flex-col bg-white text-gray-800 md:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="⌖  Enter Location"
              aria-label="Search by location"
              className="min-w-0 flex-1 border-b px-5 py-5 outline-none focus:ring-2 focus:ring-teal-500 md:border-b-0 md:border-r"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="⌕  Search Event"
              aria-label="Search event name"
              className="min-w-0 flex-1 px-5 py-5 outline-none focus:ring-2 focus:ring-teal-500"
            />

            <Button
              type="submit"
              className="h-auto rounded-none bg-green-500 px-8 py-5 text-base font-bold text-white hover:bg-green-600"
            >
              Find Events
            </Button>
          </form>
        </div>
      </div>

      <div className="px-5 py-8 md:px-10">
        <div
          id="categories"
          className="flex gap-7 overflow-x-auto border-b pb-4"
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 pb-2 ${
                selectedCategory === category
                  ? "border-b-2 border-teal-500 font-semibold text-teal-600"
                  : "text-gray-700 hover:text-teal-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <section id="events">
          <div className="mb-6 flex items-center justify-between py-4">
            <h2 className="text-2xl font-bold">Explore Events</h2>

            <span className="text-sm text-gray-500">
              {filteredEvents.length} events
            </span>
          </div>

          <div className="mb-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setPeriod("UPCOMING")}
              className={`rounded-full px-5 py-2 ${
                period === "UPCOMING"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Upcoming
            </button>

            <button
              type="button"
              onClick={() => setPeriod("ONGOING")}
              className={`rounded-full px-5 py-2 ${
                period === "ONGOING"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Ongoing
            </button>

            <button
              type="button"
              onClick={() => setPeriod("ENDED")}
              className={`rounded-full px-5 py-2 ${
                period === "ENDED"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Ended
            </button>
          </div>

          {isPending && <p>Loading events...</p>}

          {isError && (
            <p className="text-red-600">
              Unable to load events. Check that your backend is running.
            </p>
          )}

          {!isPending && !isError && filteredEvents.length === 0 && (
            <p className="py-8 text-gray-500">
              No events found. Try another search.
            </p>
          )}

          {!isPending && !isError && filteredEvents.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
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
