import { Link } from "react-router-dom";

function Discounting() {
  return (
    <section className="bg-brand-neutral px-5 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white bg-white shadow-sm shadow-brand-navy/5">
        <div className="grid items-center gap-10 p-6 md:p-10 lg:grid-cols-2 lg:gap-16 lg:p-14">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
              Fair pricing
            </span>

            <h2 className="mt-4 max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-brand-navy sm:text-5xl lg:text-6xl">
              Lowest fees
              <br />
              in the industry
            </h2>

            <p className="mt-6 max-w-lg text-xl font-bold leading-relaxed text-brand-navy">
              No contracts, no monthly fees, no worries.
            </p>

            <p className="mt-4 max-w-xl text-base leading-7 text-brand-text md:text-lg">
              Affordable ticket fees that make sense. Sell tickets and keep
              more of your revenue.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/promotions"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-brand-navy/25 bg-white px-7 text-base font-semibold text-brand-navy transition hover:border-brand-navy hover:bg-brand-navy hover:text-white"
              >
                View Promotions
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-brand-navy/10 pt-6 sm:grid-cols-3">
              <div>
                <p className="text-2xl font-extrabold text-brand-navy">0%</p>
                <p className="mt-1 text-xs font-medium text-brand-muted">
                  Monthly fees
                </p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-brand-navy">24/7</p>
                <p className="mt-1 text-xs font-medium text-brand-muted">
                  Human support
                </p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-brand-navy">2 min</p>
                <p className="mt-1 text-xs font-medium text-brand-muted">
                  Event setup
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full rounded-[1.75rem] bg-brand-neutral/70 p-6 md:p-10">
              <img
                src="/discount.jpg.png"
                alt="Discount"
                className="mx-auto max-h-[360px] w-full max-w-md rounded-2xl object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Discounting;
