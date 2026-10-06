import { Link } from "react-router-dom";

function Jumbotron() {
  return (
    <div className="min-h-screen bg-[#002F36] px-8 pt-32 pb-16 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl items-center">
        {/* Left */}
        <div className="w-full lg:w-1/2">
          <h1 className="max-w-2xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Event ticketing
            <br />
            made simple
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-200 sm:text-xl">
            An easy-to-use event ticketing platform with fair pricing and
            dedicated human support. All the tools you need for a fraction of
            the cost charged by other platforms.
          </p>

          <div className="mt-10 flex items-center gap-10">
            <Link
              to="/create-event"
              className="bg-[#0CC85A] px-8 py-5 text-lg font-bold transition hover:bg-[#0AAF4D]"
            >
              Create Event
            </Link>

            <Link
              to="/demo"
              className="border-b-2 border-white pb-2 text-lg font-bold transition hover:text-gray-300"
            >
              Book A Demo
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-6">
            <div className="pr-6 lg:border-r lg:border-gray-500">
              <p className="font-bold">Capterra 4.7/5</p>

              <p className="mt-2 text-lg tracking-wide text-yellow-400">
                ★ ★ ★ ★ ★
              </p>
            </div>

            <div className="pr-6 lg:border-r lg:border-gray-500">
              <p className="font-bold">G2 5/5</p>

              <p className="mt-2 text-lg tracking-wide text-yellow-400">
                ★ ★ ★ ★ ★
              </p>
            </div>

            <div>
              <p className="font-bold">Google 4.7/5</p>

              <p className="mt-2 text-lg tracking-wide text-yellow-400">
                ★ ★ ★ ★ ★
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="hidden w-1/2 justify-end lg:flex">
          <div className="w-full max-w-[650px] overflow-hidden rounded-xl">
            <img
              src="/activity.jpg"
              alt="People attending an outdoor event"
              className="h-[640px] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Jumbotron;
