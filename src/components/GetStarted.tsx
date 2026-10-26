import { useNavigate } from "react-router-dom";

const GetStarted = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-brand-navy px-5 py-16 text-center text-white md:px-8 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-0 size-72 rounded-full bg-brand-orange/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-0 size-80 rounded-full bg-white/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
          Start today
        </span>

        <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
          Event ticketing just got easier
        </h2>

        <p className="mt-5 text-lg font-semibold text-white/75 md:text-2xl">
          Create your event in 2 minutes
        </p>

        <div className="mt-8 flex justify-center md:mt-10">
          <button
            type="button"
            onClick={() => navigate("/events")}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-white px-8 text-base font-bold text-brand-navy shadow-lg shadow-brand-navy-dark/20 transition hover:bg-brand-neutral focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30 sm:w-auto md:h-14 md:px-10 md:text-lg"
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default GetStarted;
