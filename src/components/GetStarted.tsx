import { useNavigate } from "react-router-dom";

const GetStarted = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-indigo-950 px-5 py-16 text-center text-white md:px-8 md:py-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-6xl">
          Event ticketing just got easier
        </h2>

        <p className="mt-5 text-lg font-semibold md:mt-6 md:text-3xl">
          Create your event in 2 minutes
        </p>

        <div className="mt-8 md:mt-12">
          <button
            type="button"
            onClick={() => navigate("/events")}
            className="w-full bg-emerald-500 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-300 md:w-auto md:px-10 md:py-5 md:text-xl"
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default GetStarted;
