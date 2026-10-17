import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#1C2233] px-5 py-14 text-white md:px-10 md:py-20">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Logo */}
          <div>
            <Link to="/" className="inline-block">
              <div className="text-3xl font-bold tracking-tight">EVENT</div>
              <p className="ml-8 text-sm tracking-[0.25em] text-gray-300">
                BOOKINGS
              </p>
            </Link>
          </div>

          {/* EventBookings */}
          <div>
            <h3 className="mb-6 text-xl font-medium">EventBookings</h3>
            <ul className="space-y-4 text-gray-300">
              <li>
                <Link
                  to="/register"
                  className="transition-colors hover:text-teal-400"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="transition-colors hover:text-teal-400"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="transition-colors hover:text-teal-400"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/events/create"
                  className="transition-colors hover:text-teal-400"
                >
                  Create
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-xl font-medium">Help & Support</h3>
            <ul className="space-y-4 text-gray-300">
              <li>
                <Link
                  to="/help"
                  className="transition-colors hover:text-teal-400"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="transition-colors hover:text-teal-400"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/developers"
                  className="transition-colors hover:text-teal-400"
                >
                  Developers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-xl font-medium">Follow Us</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.facebook.com/"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white text-lg font-bold transition-colors hover:border-teal-400 hover:text-teal-400"
              >
                f
              </a>

              <a
                href="https://www.instagram.com/"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white text-lg font-bold transition-colors hover:border-teal-400 hover:text-teal-400"
              >
                🅾
              </a>

              <a
                href="https://x.com/"
                aria-label="X"
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white text-lg font-bold transition-colors hover:border-teal-400 hover:text-teal-400"
              >
                X
              </a>

              <a
                href="https://www.linkedin.com/"
                aria-label="LinkedIn"
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white text-sm font-bold transition-colors hover:border-teal-400 hover:text-teal-400"
              >
                in
              </a>
            </div>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="mt-10 border-t border-gray-600/60 pt-5 md:mt-14 md:pt-6">
          <p className="text-xs text-gray-400 md:text-sm">
            © {new Date().getFullYear()} EventBookings. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
