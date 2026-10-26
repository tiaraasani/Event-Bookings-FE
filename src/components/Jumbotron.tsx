import { Link } from "react-router-dom";

function Jumbotron() {
  return (
    <section className="relative overflow-hidden bg-brand-neutral px-5 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-brand-orange/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/4 size-80 rounded-full bg-brand-navy/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/20 bg-brand-orange-soft px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-orange-dark">
            <span className="size-1.5 rounded-full bg-brand-orange" />
            Event ticketing, simplified
          </span>

          <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-brand-navy sm:text-5xl lg:text-6xl">
            Event ticketing
            <br />
            <span className="text-brand-orange">made simple</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-brand-text md:text-lg md:leading-8">
            An easy-to-use event ticketing platform with fair pricing and
            dedicated human support. All the tools you need for a fraction of
            the cost charged by other platforms.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/events"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-orange px-7 text-base font-bold text-white shadow-lg shadow-brand-orange/20 transition hover:bg-brand-orange-dark"
            >
              Book an Event
            </Link>

            <Link
              to="/promotions"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-brand-navy/25 bg-white px-7 text-base font-semibold text-brand-navy transition hover:border-brand-navy hover:bg-brand-navy hover:text-white"
            >
              Browse Promotions
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-brand-navy/10 pt-6">
            <div>
              <p className="text-sm font-bold text-brand-navy md:text-base">
                Capterra 4.7/5
              </p>
              <p className="mt-2 whitespace-nowrap text-sm tracking-tight text-brand-orange md:text-base">
                ★★★★★
              </p>
            </div>

            <div className="border-l border-brand-navy/10 pl-4">
              <p className="text-sm font-bold text-brand-navy md:text-base">
                G2 5/5
              </p>
              <p className="mt-2 whitespace-nowrap text-sm tracking-tight text-brand-orange md:text-base">
                ★★★★★
              </p>
            </div>

            <div className="border-l border-brand-navy/10 pl-4">
              <p className="text-sm font-bold text-brand-navy md:text-base">
                Google 4.7/5
              </p>
              <p className="mt-2 whitespace-nowrap text-sm tracking-tight text-brand-orange md:text-base">
                ★★★★★
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -left-4 -top-4 hidden h-full w-full rounded-[2rem] border border-brand-orange/30 md:block"
          />
          <div className="relative overflow-hidden rounded-[2rem] border-[6px] border-white bg-white shadow-2xl shadow-brand-navy/15">
            <img
              src="/activity.jpg"
              alt="Event activity"
              className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[520px]"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-brand-navy/90 p-4 text-white backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange">
                Trusted by organizers
              </p>
              <p className="mt-1 text-lg font-bold">
                20,000+ events powered worldwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Jumbotron;
