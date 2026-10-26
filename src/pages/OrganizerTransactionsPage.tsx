import Navbar from "@/components/Navbar";
import OrganizerTransactionsTable from "@/components/OrganizerTransactionsTable";

function OrganizerTransactionsPage() {
  return (
    <div className="min-h-screen bg-brand-neutral">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 md:pt-10">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
            Organizer dashboard
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
            Transactions
          </h1>

          <p className="mt-2 text-sm leading-6 text-brand-text">
            Review payments and confirm orders for your events.
          </p>
        </header>

        <OrganizerTransactionsTable />
      </main>
    </div>
  );
}

export default OrganizerTransactionsPage;
