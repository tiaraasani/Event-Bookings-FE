import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-[#F7FAFA]">
      <div className="flex min-h-[75vh] items-center justify-center px-6">
        <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-4xl">
            🔒
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-teal-600">
            Access Denied
          </p>

          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            You can't create events yet
          </h1>

          <p className="mb-8 leading-7 text-gray-500">
            Creating and managing events is only available to organizer
            accounts. Please use an organizer account to access this feature.
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button className="bg-teal-600 text-white hover:bg-teal-700">
              <Link to="/">Back to Home</Link>
            </Button>

            <Button
              variant="outline"
              className="border-teal-600 text-teal-700 hover:bg-teal-50"
            >
              <Link to="/events">Explore Events</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccessDeniedPage;
