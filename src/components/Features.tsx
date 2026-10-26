const features = [
  {
    image: "/ticket-scan.png",
    title: "Free ticket scanning app",
    description:
      "Scan tickets instantly with our free ticket scanning. Keep your attendee check-ins smooth, fast, and completely hassle-free.",
  },
  {
    image: "/seat-res.jpg.png",
    title: "Seat reservation",
    description:
      "Create and manage your event’s seating plan easily with our simple tools. Organize seating layouts, assign seats, and keep track of availability without any stress.",
  },
  {
    image: "/customizable.png",
    title: "Customizable registration form",
    description:
      "Collect all the attendee information you need with our customizable registration forms. Our configurable order form gives you complete control over attendee details.",
  },
  {
    image: "/email-custom.png",
    title: "Email customization",
    description:
      "Customize your emails to match your event’s style and voice. From order confirmations to event reminders, personalize any emails to look professional and on-brand.",
  },
  {
    image: "/email-camp.png",
    title: "Free email campaign",
    description:
      "Keep your attendees informed and engaged with our free email campaign feature. Reach your audience easily without any extra cost.",
  },
  {
    image: "/invite.png",
    title: "Invite people to your event",
    description:
      "Grow your event attendance with our invitation feature. Invite guests to your event and track RSVP effortlessly.",
  },
  {
    image: "/sell-ticket.png",
    title: "Sell tickets with popular payment processors",
    description:
      "Accept payments securely via Stripe, PayPal, Afterpay and other popular payment processors. Your attendees can pay using cards and digital wallets.",
  },
  {
    image: "/human-cs.png",
    title: "Real human support",
    description:
      "Our friendly support team is available 24/7 to ensure you are never stuck managing your event. Get help from real people whenever you need it.",
  },
];

function Features() {
  return (
    <section className="bg-brand-neutral px-5 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
            Everything you need
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl lg:text-5xl">
            Powering 20,000+ event organizers globally
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-brand-text sm:text-lg">
            From intimate gatherings to large-scale events, we provide all the
            tools you need to sell tickets and manage your events smoothly,
            without the complexity or high fees.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="group rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm shadow-brand-navy/5 transition duration-200 hover:-translate-y-0.5 hover:border-brand-orange/35 hover:shadow-lg hover:shadow-brand-navy/10 md:p-7"
            >
              <div className="flex items-start gap-5">
                <div
                  className={`flex size-16 shrink-0 items-center justify-center rounded-2xl transition group-hover:bg-brand-orange-soft ${
                    index % 2 === 0 ? "bg-brand-neutral" : "bg-brand-orange-soft"
                  }`}
                >
                  <img
                    src={feature.image}
                    alt=""
                    className="size-9 object-contain"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-bold leading-snug text-brand-navy">
                    {feature.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-6 text-brand-text">
                    {feature.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
