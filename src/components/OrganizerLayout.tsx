import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import useGetMyOrganization from "@/hooks/api/useGetMyOrganization";
import { buttonVariants } from "@/components/ui/button";

type NavItem = {
  to: string;
  label: string;
  // Extra path fragments that keep this item highlighted (e.g. edit event).
  alsoMatch?: string[];
};

const NAV_ITEMS: NavItem[] = [
  { to: "/organizer/dashboard", label: "Overview" },
  { to: "/organizer/events", label: "My Events", alsoMatch: ["/edit"] },
  { to: "/organizer/transactions", label: "Transactions" },
  { to: "/organizer/attendees", label: "Attendees" },
  { to: "/organizer/promotions", label: "Promotions" },
];

const LINK_BASE =
  "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition";
const LINK_ACTIVE = "bg-white text-brand-navy shadow-sm shadow-brand-navy/5";
const LINK_INACTIVE =
  "text-brand-muted hover:bg-white/70 hover:text-brand-navy";

function OrganizerLayout() {
  const { pathname } = useLocation();
  const { data: organization } = useGetMyOrganization();

  return (
    <div className="min-h-screen bg-brand-neutral">
      <Navbar />

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 md:pt-10 lg:flex lg:gap-10">
        {/* Sidebar on desktop, horizontal tabs on mobile */}
        <aside className="mb-6 shrink-0 lg:mb-0 lg:w-56">
          <div className="lg:sticky lg:top-30">
            <div className="mb-5 hidden lg:block">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
                Organizer
              </p>
              <p className="mt-1 truncate text-base font-extrabold text-brand-navy">
                {organization?.name ?? "My organization"}
              </p>
            </div>

            <Link
              to="/events/create"
              className={buttonVariants({
                className: "mb-4 hidden w-full lg:inline-flex",
              })}
            >
              + Create event
            </Link>

            <nav className="-mx-5 flex gap-1 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-col lg:px-0 lg:pb-0">
              {NAV_ITEMS.map((item) => {
                const forced = item.alsoMatch?.some((p) =>
                  pathname.includes(p),
                );
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `${LINK_BASE} ${
                        isActive || forced ? LINK_ACTIVE : LINK_INACTIVE
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                );
              })}

              {organization?.id && (
                <Link
                  to={`/organizers/${organization.id}/reviews`}
                  className={`${LINK_BASE} ${LINK_INACTIVE}`}
                >
                  Reviews
                </Link>
              )}
            </nav>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default OrganizerLayout;
