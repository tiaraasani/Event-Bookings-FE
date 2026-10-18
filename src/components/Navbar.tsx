import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/stores/useAuth";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="absolute left-0 top-0 z-50 w-full bg-[#003238] text-white">
      <div className="flex min-h-20 items-center justify-between gap-3 px-4 py-3 md:h-24 md:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2 md:gap-3">
          <div className="text-2xl font-bold md:text-3xl">EB</div>
          <div className="leading-none">
            <p className="text-base font-bold md:text-xl">EVENT</p>
            <p className="text-base font-bold md:text-xl">BOOKINGS</p>
          </div>
        </Link>

        <div className="flex items-center gap-3 md:gap-6">
          {user ? (
            <div className="flex items-center gap-3 md:gap-4">
              <Link
                to="/profile"
                className="max-w-24 truncate text-sm font-semibold hover:underline md:max-w-none md:text-base"
              >
                Hi, {user.name}
              </Link>
              <button
                onClick={logout}
                className="text-sm font-semibold underline underline-offset-4"
              >
                Logout
              </button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-semibold outline-none md:gap-2 md:text-base">
                Sign in
                <span className="text-xs">▼</span>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="mt-4 w-[calc(100vw-2rem)] max-w-[440px] bg-white p-5 text-black md:p-8"
              >
                <div className="space-y-5">
                  <Link to="/login">
                    <div className="flex h-12 items-center justify-center bg-[#2bb3b3] text-base font-bold text-white transition hover:bg-[#20a3a3] md:h-14 md:text-lg">
                      Login
                    </div>
                  </Link>

                  <p className="text-center text-base md:text-lg">
                    New here?{" "}
                    <Link
                      to="/register"
                      className="font-semibold text-[#2bb3b3] hover:underline"
                    >
                      Register
                    </Link>
                  </p>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Link
            to="/events/create"
            className="flex shrink-0 items-center justify-center bg-green-500 px-3 py-3 text-sm font-bold text-white transition hover:bg-green-600 md:h-14 md:px-8 md:text-lg"
          >
            <span className="mr-1 md:mr-3 md:text-xl">▣</span>
            Create
            <span className="ml-1 hidden md:inline">Event</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
