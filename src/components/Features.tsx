import { Link } from "react-router-dom";

function Features() {
  return (
    <div className="min-h-screen bg-[#FFFFFF] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-[#073B4C] sm:text-5xl lg:text-6xl">
            Powering 20,000+ event organizers globally
          </h2>

          <p className="mx-auto mt-8 max-w-5xl text-lg leading-relaxed text-[#111827] sm:text-xl">
            From intimate gatherings to large-scale events, we provide all the
            tools you need to sell tickets and manage your events smoothly, all
            without the complexity or high fees.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-x-20 gap-y-16 lg:grid-cols-2">
          <div className="flex items-start gap-8">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-[#BDEBFA]">
              <img
                src="/ticket-scan.png"
                alt="Ticket scanning"
                className="h-16 w-16 object-contain"
              />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#111111]">
                Free ticket scanning app
              </h3>

              <p className="mt-4 text-lg leading-relaxed text-[#374151]">
                Scan tickets instantly with our free ticket scanning. Keep your
                attendee check-ins smooth, fast, and completely hassle-free.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-8">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-[#FFC9BE]">
              <img
                src="/seat-res.jpg.png"
                alt="Seat reservation"
                className="h-16 w-16 object-contain"
              />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#111111]">
                Seat reservation
              </h3>

              <p className="mt-4 text-lg leading-relaxed text-[#374151]">
                Create and manage your event’s seating plan easily with our
                simple tools. Organize seating layouts, assign seats, and keep
                track of availability without any stress.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-8">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-[#B8F5B8]">
              <img
                src="/customizable.png"
                alt="Registration form"
                className="h-16 w-16 object-contain"
              />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#111111]">
                Customizable registration form
              </h3>

              <p className="mt-4 text-lg leading-relaxed text-[#374151]">
                Collect all the attendee information you need with our
                customizable registration forms. Our configurable order form
                gives you complete control over attendee details.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-8">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-[#BDEBFA]">
              <img
                src="/email-custom.png"
                alt="Email customization"
                className="h-16 w-16 object-contain"
              />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#111111]">
                Email customization
              </h3>

              <p className="mt-4 text-lg leading-relaxed text-[#374151]">
                Customize your emails to match your event’s style and voice.
                From order confirmations to event reminders, personalize any
                emails to make your communication look professional and
                on-brand.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-8">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-[#E9D8FB]">
              <img
                src="/email-camp.png"
                alt="Email campaign"
                className="h-16 w-16 object-contain"
              />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#111111]">
                Free email campaign
              </h3>

              <p className="mt-4 text-lg leading-relaxed text-[#374151]">
                Keep your attendees informed and engaged with our free email
                campaign feature. Reach your audience easily using email
                campaigns to send event updates without any extra cost.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-8">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-[#FFB3B3]">
              <img
                src="/invite.png"
                alt="Invite people"
                className="h-16 w-16 object-contain"
              />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#111111]">
                Invite people to your event
              </h3>

              <p className="mt-4 text-lg leading-relaxed text-[#374151]">
                Grow your event attendance with our invitation feature. Invite
                guests to your event and track RSVP effortlessly.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-8">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-[#A3D0F9]">
              <img
                src="/sell-ticket.png"
                alt="Sell tickets"
                className="h-16 w-16 object-contain"
              />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#111111]">
                Sell tickets with popular payment processors
              </h3>

              <p className="mt-4 text-lg leading-relaxed text-[#374151]">
                Accept payments securely via Stripe, PayPal, Afterpay and other
                popular payment processors. Your attendees can purchase tickets
                using debit/credit cards and digital wallets.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-8">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-[#A3F1F1]">
              <img
                src="/human-cs.png"
                alt="Customer support"
                className="h-16 w-16 object-contain"
              />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#111111]">
                Real human support
              </h3>

              <p className="mt-4 text-lg leading-relaxed text-[#374151]">
                Our friendly support team is available 24/7 to ensure you are
                never stuck managing your event. Get help from real people
                whenever you need it.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 flex justify-center">
          <Link
            to="/"
            className="group text-xl font-bold text-[#073B4C] underline decoration-2 underline-offset-8"
          >
            View All Feature
            <span className="ml-3 inline-block">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Features;
