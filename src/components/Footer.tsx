import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-brand-navy px-5 py-14 text-white md:px-10 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand-orange text-sm font-extrabold text-white shadow-sm shadow-brand-orange/20">
                S
              </span>
              <span className="leading-none">
                <span className="block text-lg font-extrabold tracking-[0.16em]">
                  SEATLY
                </span>
                <span className="mt-1.5 block text-[0.68rem] font-semibold tracking-[0.28em] text-white/60">
                  EVENT TICKETS
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-white/60">
              Simple event ticketing with fair pricing and real human support.
            </p>
          </div>

          <div>
            <h3 className="mb-6 text-base font-semibold text-white">
              Seatly
            </h3>
            <ul className="space-y-4 text-sm text-white/65">
              <li>
                <Link
                  to="/register"
                  className="transition-colors hover:text-brand-orange"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="transition-colors hover:text-brand-orange"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="transition-colors hover:text-brand-orange"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/events/create"
                  className="transition-colors hover:text-brand-orange"
                >
                  Create
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-base font-semibold text-white">
              Help & Support
            </h3>
            <ul className="space-y-4 text-sm text-white/65">
              <li>
                <Link
                  to="/help"
                  className="transition-colors hover:text-brand-orange"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="transition-colors hover:text-brand-orange"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/developers"
                  className="transition-colors hover:text-brand-orange"
                >
                  Developers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-base font-semibold text-white">
              Follow Us
            </h3>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.facebook.com/"
                aria-label="Facebook"
                className="flex size-11 items-center justify-center rounded-full border border-white/20 text-sm font-bold text-white/80 transition-colors hover:border-brand-orange hover:bg-brand-orange hover:text-white"
              >
                f
              </a>

              <a
                href="https://www.instagram.com/"
                aria-label="Instagram"
                className="flex size-11 items-center justify-center rounded-full border border-white/20 text-sm font-bold text-white/80 transition-colors hover:border-brand-orange hover:bg-brand-orange hover:text-white"
              >
                ig
              </a>

              <a
                href="https://x.com/"
                aria-label="X"
                className="flex size-11 items-center justify-center rounded-full border border-white/20 text-sm font-bold text-white/80 transition-colors hover:border-brand-orange hover:bg-brand-orange hover:text-white"
              >
                X
              </a>

              <a
                href="https://www.linkedin.com/"
                aria-label="LinkedIn"
                className="flex size-11 items-center justify-center rounded-full border border-white/20 text-sm font-bold text-white/80 transition-colors hover:border-brand-orange hover:bg-brand-orange hover:text-white"
              >
                in
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-5 md:mt-14 md:pt-6">
          <p className="text-xs text-white/50 md:text-sm">
            © {new Date().getFullYear()} Seatly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
