const steps = [
  {
    title: "Create",
    description:
      "Create your event with a name, date, location, tickets, and description.",
  },
  {
    title: "Customize",
    description:
      "Make your event stand out with images, event details, and everything your attendees need to know.",
  },
  {
    title: "Promote",
    description:
      "Share your event and help more people discover and join your experience.",
  },
  {
    title: "Manage",
    description:
      "Keep track of ticket sales, bookings, and attendees in one convenient place.",
  },
  {
    title: "Enjoy",
    description:
      "Focus on creating a great event while your attendees enjoy a smooth booking experience.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-brand-neutral px-5 pb-20 md:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-brand-navy px-6 py-12 text-white shadow-xl shadow-brand-navy/10 md:px-12 md:py-16">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
              Simple by design
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-5xl">
              How It Works
            </h2>

            <p className="mt-4 max-w-md text-base leading-7 text-white/65">
              From the first idea to the final attendee check-in, manage the
              entire journey from one place.
            </p>

            <div className="relative mt-8">
              <img
                src="/howitworks.png"
                alt="How EventBookings works"
                className="h-auto w-full rounded-2xl border border-white/10 object-cover shadow-2xl"
              />
            </div>
          </div>

          <div className="space-y-7">
            {steps.map((step, index) => (
              <div key={step.title} className="flex gap-5">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-orange text-lg font-extrabold text-white shadow-sm shadow-brand-orange/20 md:size-14 md:text-xl">
                  {index + 1}
                </span>

                <div className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
                  <h3 className="text-xl font-bold text-white md:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/65 md:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
