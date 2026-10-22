import Navbar from "@/components/Navbar";
import OrganizerTransactionsTable from "@/components/OrganizerTransactionsTable";

function OrganizerTransactionsPage() {
  return (
    <div className="min-h-screen bg-[#F7FAFA] text-gray-800">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pb-16 pt-32 sm:px-10">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Transactions</h1>
        <OrganizerTransactionsTable />
      </main>
    </div>
  );
}

export default OrganizerTransactionsPage;
