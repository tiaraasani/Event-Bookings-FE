import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  size?: "md" | "lg";
};

const benefits = [
  "Create and manage events in minutes",
  "Sell tickets with fair pricing",
  "Real human support whenever you need it",
];

function BrandMark() {
  return (
    <Link to="/" className="inline-flex items-center gap-3">
      <span className="flex size-11 items-center justify-center rounded-xl bg-brand-orange text-sm font-extrabold text-white shadow-sm shadow-brand-orange/20">
        S
      </span>
      <span className="leading-none">
        <span className="block text-base font-extrabold tracking-[0.16em] text-white">
          SEATLY
        </span>
        <span className="mt-1.5 block text-[0.65rem] font-semibold tracking-[0.28em] text-white/60">
          EVENT TICKETS
        </span>
      </span>
    </Link>
  );
}

function AuthLayout({ title, subtitle, children, size = "md" }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-brand-neutral lg:grid lg:grid-cols-[0.95fr_1.05fr]">
      <aside className="relative hidden overflow-hidden bg-brand-navy p-12 lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-10 size-80 rounded-full bg-brand-orange/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-white/5 blur-3xl"
        />

        <div className="relative">
          <BrandMark />
        </div>

        <div className="relative max-w-md py-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
            Welcome to Seatly
          </span>

          <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-white xl:text-5xl">
            Make every event
            <br />
            unforgettable.
          </h2>

          <p className="mt-5 text-base leading-7 text-white/65">
            One simple platform for organizers and attendees, built around fair
            pricing and a smooth booking experience.
          </p>

          <ul className="mt-8 space-y-4">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-sm text-white/80">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-3"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 0 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/40">
          © {new Date().getFullYear()} Seatly. All rights reserved.
        </p>
      </aside>

      <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        <div
          className={`w-full ${
            size === "lg" ? "max-w-xl" : "max-w-md"
          } rounded-3xl border border-white bg-white p-6 shadow-2xl shadow-brand-navy/10 sm:p-9`}
        >
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-3 lg:hidden"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-brand-orange text-sm font-extrabold text-white">
              S
            </span>
            <span className="leading-none">
              <span className="block text-sm font-extrabold tracking-[0.16em] text-brand-navy">
                SEATLY
              </span>
              <span className="mt-1 block text-[0.6rem] font-semibold tracking-[0.26em] text-brand-muted">
                EVENT TICKETS
              </span>
            </span>
          </Link>

          <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-brand-muted">{subtitle}</p>

          <div className="mt-7">{children}</div>
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
