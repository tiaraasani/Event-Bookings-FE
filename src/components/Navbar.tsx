import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 z-50 w-full bg-transparent text-white">
      <div className="flex h-24 items-center justify-between px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="text-3xl font-bold">EB</div>

          <div className="leading-none">
            <p className="text-xl font-bold">EVENT</p>
            <p className="text-xl font-bold">BOOKINGS</p>
          </div>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {/* Sign In Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-base font-semibold outline-none">
              Greetings! Sign in
              <span className="text-xs">▼</span>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="mt-4 w-[440px] bg-white p-8 text-black"
            >
              <div className="space-y-5">
                {/* Sign In Button */}
                <Link to="/login">
                  <div className="flex h-14 items-center justify-center bg-[#2bb3b3] text-lg font-bold text-white transition hover:bg-[#20a3a3]">
                    Sign in
                  </div>
                </Link>

                {/* Sign Up */}
                <p className="text-center text-lg">
                  New here?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-[#2bb3b3] hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Create Event */}
          <Link
            to="/create-event"
            className="flex h-14 items-center bg-[#0fc45b] px-8 text-lg font-bold text-white transition hover:bg-[#0eae52]"
          >
            <span className="mr-3 text-xl">▣</span>
            Create Event
          </Link>
        </div>
      </div>
    </nav>
  );
}
