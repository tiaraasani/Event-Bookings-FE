const HowItWorks = () => {
  return (
    <section className="bg-slate-50 px-5 py-12 md:px-12 md:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-8 text-3xl font-bold tracking-tight text-teal-950 md:mb-14 md:text-5xl">
          How It Works
        </h2>

        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          {/* Left */}
          <div className="relative mx-auto w-full max-w-xl">
            <img
              src="/howitworks.png"
              alt="how it works"
              className="relative h-auto w-full rounded-3xl object-cover shadow-xl"
            />
          </div>

          {/* Right */}
          <div className="space-y-10 md:space-y-12">
            <div className="flex gap-5 md:gap-7">
              <span className="text-5xl font-bold leading-none text-emerald-400 md:text-7xl">
                1
              </span>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-teal-950 md:text-3xl">
                    Create
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600 md:mt-3 md:text-base md:leading-7">
                  Create your event with a name, date, location, tickets, and
                  description.
                </p>
              </div>
            </div>

            <div className="flex gap-5 md:gap-7">
              <span className="text-5xl font-bold leading-none text-emerald-400 md:text-7xl">
                2
              </span>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-teal-950 md:text-3xl">
                    Customize
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600 md:mt-3 md:text-base md:leading-7">
                  Make your event stand out with images, event details, and
                  everything your attendees need to know.
                </p>
              </div>
            </div>

            <div className="flex gap-5 md:gap-7">
              <span className="text-5xl font-bold leading-none text-emerald-400 md:text-7xl">
                3
              </span>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-teal-950 md:text-3xl">
                    Promote
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600 md:mt-3 md:text-base md:leading-7">
                  Share your event and help more people discover and join your
                  experience.
                </p>
              </div>
            </div>

            <div className="flex gap-5 md:gap-7">
              <span className="text-5xl font-bold leading-none text-emerald-400 md:text-7xl">
                4
              </span>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-teal-950 md:text-3xl">
                    Manage
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600 md:mt-3 md:text-base md:leading-7">
                  Keep track of ticket sales, bookings, and attendees in one
                  convenient place.
                </p>
              </div>
            </div>

            <div className="flex gap-5 md:gap-7">
              <span className="text-5xl font-bold leading-none text-emerald-400 md:text-7xl">
                5
              </span>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-teal-950 md:text-3xl">
                    Enjoy
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600 md:mt-3 md:text-base md:leading-7">
                  Focus on creating a great event while your attendees enjoy a
                  smooth booking experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
