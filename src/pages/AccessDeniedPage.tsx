import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-brand-neutral">
      <Navbar />

      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-5 py-12">
        <div className="w-full max-w-lg rounded-3xl border border-white bg-white p-8 text-center shadow-xl shadow-brand-navy/10 sm:p-12">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-brand-orange-soft text-4xl">
            🔒
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
            Access Denied
          </p>

          <h1 className="mb-4 text-2xl font-extrabold text-brand-navy sm:text-3xl">
            You can't create events yet
          </h1>

          <p className="mb-8 leading-7 text-brand-text">
            Creating and managing events is only available to organizer
            accounts. Please use an organizer account to access this feature.
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/" className={buttonVariants({ className: "w-full sm:w-auto" })}>
              Back to Home
            </Link>

            <Link
              to="/events"
              className={buttonVariants({
                variant: "outline",
                className: "w-full sm:w-auto",
              })}
            >
              Explore Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccessDeniedPage;
