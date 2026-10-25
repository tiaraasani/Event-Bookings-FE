import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F7FAFA] px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">
        404
      </p>
      <h1 className="text-3xl font-bold text-gray-900">Page not found</h1>
      <p className="max-w-md text-gray-500">
        The page you are looking for does not exist or has been moved.
      </p>

      <Link to="/">
        <Button>Go to Home</Button>
      </Link>
    </div>
  );
}

export default NotFoundPage;
