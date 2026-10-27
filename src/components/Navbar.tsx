import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useAuth } from "@/stores/useAuth";
import { cn } from "cn";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "relative py-2 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-brand-orange after:transition-transform hover:text-white hover:after:scale-x-100",
    isActive ? "text-white after:scale-x-100" : "text-white/75",
  );

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="size-5"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function LoginIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden="true"
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const isOrganizerArea =
    pathname.startsWith("/organizer") || /^\/events\/\d+\/edit$/.test(pathname);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-brand-navy text-white shadow-lg shadow-brand-navy/10">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-brand-orange text-sm font-extrabold tracking-tight text-white shadow-sm shadow-brand-orange/20">
            S
          </span>
          <span className="leading-none">
            <span className="block text-sm font-extrabold tracking-[0.18em]">
              SEATLY
            </span>
            <span className="mt-1 block text-[0.65rem] font-semibold tracking-[0.28em] text-white/65">
              EVENT TICKETS
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          <NavLink to="/events" className={navLinkClass}>
            Events
          </NavLink>
          <NavLink to="/promotions" className={navLinkClass}>
            Promotions
          </NavLink>
          {user?.role === "ORGANIZER" && (
            <NavLink
              to="/organizer/dashboard"
              className={() => navLinkClass({ isActive: isOrganizerArea })}
            >
              Dashboard
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <Link
                to="/profile"
                className="hidden max-w-40 truncate text-sm font-medium text-white/85 transition hover:text-white md:inline"
              >
                Hi,{" "}
                <span className="capitalize">
                  {user.name.trim().split(/\s+/)[0]}
                </span>
              </Link>

              {user.role === "ORGANIZER" && (
                <Link
                  to="/events/create"
                  className="hidden items-center justify-center rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-orange/20 transition hover:bg-brand-orange-dark sm:inline-flex"
                >
                  Create Event
                </Link>
              )}

              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                aria-label="Logout"
                title="Logout"
                className="hidden size-10 items-center justify-center rounded-lg border border-white/20 text-white/85 transition hover:border-white/40 hover:bg-white/10 hover:text-white lg:inline-flex"
              >
                <LogoutIcon />
              </button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Sign in"
                title="Sign in"
                className="hidden size-10 items-center justify-center rounded-lg border border-white/20 text-white outline-none transition hover:border-white/40 hover:bg-white/10 sm:flex"
              >
                <LoginIcon />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="mt-3 w-80 rounded-2xl border border-brand-navy/10 bg-white p-3 text-brand-navy shadow-xl shadow-brand-navy/15"
              >
                <div className="rounded-xl bg-brand-neutral/70 p-4">
                  <p className="text-sm font-semibold text-brand-navy">
                    Welcome to Seatly
                  </p>
                  <p className="mt-1 text-xs leading-5 text-brand-muted">
                    Sign in to book tickets or manage your events.
                  </p>

                  <Link
                    to="/login"
                    className="mt-3 flex h-10 items-center justify-center rounded-lg bg-brand-orange text-sm font-semibold text-white transition hover:bg-brand-orange-dark"
                  >
                    Login
                  </Link>

                  <p className="mt-3 text-center text-xs text-brand-muted">
                    New here?{" "}
                    <Link
                      to="/register"
                      className="font-semibold text-brand-navy underline underline-offset-4 hover:text-brand-orange"
                    >
                      Create an account
                    </Link>
                  </p>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Open navigation menu"
              className="flex size-10 items-center justify-center rounded-lg border border-white/20 text-white outline-none transition hover:border-white/40 hover:bg-white/10 lg:hidden"
            >
              <MenuIcon />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="mt-3 w-64 rounded-2xl border border-brand-navy/10 bg-white p-2 text-brand-navy shadow-xl shadow-brand-navy/15"
            >
              <DropdownMenuItem
                render={<Link to="/events" />}
                className="min-h-10 rounded-lg px-3 text-sm font-medium text-brand-navy focus:bg-brand-neutral focus:text-brand-navy"
              >
                Events
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link to="/promotions" />}
                className="min-h-10 rounded-lg px-3 text-sm font-medium text-brand-navy focus:bg-brand-neutral focus:text-brand-navy"
              >
                Promotions
              </DropdownMenuItem>

              {user?.role === "ORGANIZER" && (
                <DropdownMenuItem
                  render={<Link to="/organizer/dashboard" />}
                  className="min-h-10 rounded-lg px-3 text-sm font-medium text-brand-navy focus:bg-brand-neutral focus:text-brand-navy"
                >
                  Dashboard
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator className="my-2 bg-brand-navy/10" />

              {user ? (
                <>
                  <DropdownMenuItem
                    render={<Link to="/profile" />}
                    className="min-h-10 rounded-lg px-3 text-sm font-medium text-brand-navy focus:bg-brand-neutral focus:text-brand-navy"
                  >
                    My profile
                  </DropdownMenuItem>

                  {user.role === "ORGANIZER" && (
                    <DropdownMenuItem
                      render={<Link to="/events/create" />}
                      className="min-h-10 rounded-lg px-3 text-sm font-semibold text-brand-orange focus:bg-brand-orange-soft focus:text-brand-orange-dark"
                    >
                      Create Event
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={() => setShowLogoutConfirm(true)}
                    className="min-h-10 rounded-lg px-3 text-sm font-medium text-red-600 focus:bg-red-50 focus:text-red-600"
                  >
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem
                    render={<Link to="/login" />}
                    className="min-h-10 rounded-lg px-3 text-sm font-semibold text-brand-orange focus:bg-brand-orange-soft focus:text-brand-orange-dark"
                  >
                    Login
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    render={<Link to="/register" />}
                    className="min-h-10 rounded-lg px-3 text-sm font-medium text-brand-navy focus:bg-brand-neutral focus:text-brand-navy"
                  >
                    Create an account
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Log out?"
        description="You will need to login again to access your account."
        confirmText="Logout"
        destructive
        onConfirm={() => {
          logout();
          setShowLogoutConfirm(false);
        }}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </nav>
  );
}

export default Navbar;
