import { Link } from "react-router-dom";

function Jumbotron() {
  return (
    <div className="min-h-screen bg-[#002F36] px-5 pb-12 pt-28 text-white md:px-8 md:pb-16 md:pt-32">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-10 text-center md:min-h-[calc(100vh-8rem)] md:flex-row md:gap-8 md:text-left">
        {/* Left */}
        <div className="w-full md:w-1/2">
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Event ticketing
            <br />
            made simple
          </h1>

          <p className="mt-6 text-base leading-7 text-gray-200 md:mt-8 md:text-xl md:leading-8">
            An easy-to-use event ticketing platform with fair pricing and
            dedicated human support. All the tools you need for a fraction of
            the cost charged by other platforms.
          </p>

          <div className="mt-8 flex flex-wrap flex-col items-center justify-center gap-4 md:mt-10 md:gap-10">
            <Link
              to="/events"
              className="inline-block bg-[#0CC85A] px-6 py-4 text-base font-bold transition hover:bg-[#0AAF4D] md:px-8 md:py-5 md:text-lg"
            >
              Book an Event
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-2 md:mt-12 md:gap-4">
            <div className="min-w-0 md:border-r md:border-gray-500 md:pr-4">
              <p className="text-xs font-bold md:text-base">Capterra 4.7/5</p>
              <p className="mt-2 whitespace-nowrap text-xs tracking-tight text-yellow-400 md:text-base">
                ★★★★★
              </p>
            </div>

            <div className="min-w-0 md:border-r md:border-gray-500 md:pr-4">
              <p className="text-xs font-bold md:text-base">G2 5/5</p>
              <p className="mt-2 whitespace-nowrap text-xs tracking-tight text-yellow-400 md:text-base">
                ★★★★★
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold md:text-base">Google 4.7/5</p>
              <p className="mt-2 whitespace-nowrap text-xs tracking-tight text-yellow-400 md:text-base">
                ★★★★★
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="w-full md:flex md:w-1/2 md:justify-end">
          <div className="w-full max-w-[650px] overflow-hidden rounded-xl">
            <img
              src="/activity.jpg"
              alt="Event activity"
              className="h-auto max-h-[640px] w-full object-cover md:h-[560px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Jumbotron;
