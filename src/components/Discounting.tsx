import { Link } from "react-router-dom";

function Discounting() {
  return (
    <div className="min-h-screen bg-[#E8FFFF] px-6 py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-10 text-center md:min-h-[calc(100vh-8rem)] md:flex-row md:gap-8 md:text-left">
        {/* Left */}
        <div className="w-full lg:w-1/2">
          <h2 className="max-w-xl text-5xl font-bold leading-tight tracking-tight text-[#073B4C] sm:text-6xl lg:text-7xl">
            Lowest fees
            <br />
            in the industry
          </h2>

          <p className="mt-8 max-w-lg text-2xl font-bold leading-relaxed text-[#111827]">
            No contracts, no monthly fees, no worries.
          </p>

          <p className="mt-8 max-w-xl text-lg flex-col items-center justify-center leading-relaxed text-[#374151]">
            Affordable ticket fees that make sense. Sell
            <br className="hidden sm:block" />
            tickets and keep more of your revenue.
          </p>

          <div className="mt-10">
            <div className="mt-8 flex flex-wrap flex-col items-center justify-center gap-4 md:mt-10 md:gap-10">
              <Link
                to="/events"
                className="inline-block bg-[#0CC85A] px-6 py-4 text-base font-bold text-white transition hover:bg-[#0AAF4D] md:px-8 md:py-5 md:text-lg"
              >
                Book an Event
              </Link>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="hidden w-full items-center justify-center lg:flex lg:w-1/2">
          <img
            src="/discount.jpg.png"
            alt="Discount"
            className="max-w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default Discounting;
