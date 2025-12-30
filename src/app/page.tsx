import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mb-4 text-5xl font-bold">Sharing Is Caring</h1>
        <p className="mb-8 text-xl text-blue-100">
          Find compatible roommates to share accommodation costs for any event worldwide
        </p>

        <div className="mb-12 flex flex-wrap justify-center gap-4">
          <div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur">Festivals</div>
          <div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur">Conferences</div>
          <div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur">Concerts</div>
          <div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur">Sports Events</div>
          <div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur">Conventions</div>
        </div>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Get Started
          </Link>
          <Link
            href="/events"
            className="rounded-lg border border-white px-8 py-3 font-semibold transition hover:bg-white/10"
          >
            Browse Events
          </Link>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-white/10 p-6 backdrop-blur">
            <div className="mb-4 text-4xl">🎯</div>
            <h3 className="mb-2 text-xl font-semibold">Smart Matching</h3>
            <p className="text-blue-100">
              Our algorithm matches you with compatible roommates based on lifestyle, budget, and
              preferences
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-6 backdrop-blur">
            <div className="mb-4 text-4xl">🛡️</div>
            <h3 className="mb-2 text-xl font-semibold">Safe & Verified</h3>
            <p className="text-blue-100">
              Multiple verification levels, reviews, and safety features to ensure trust
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-6 backdrop-blur">
            <div className="mb-4 text-4xl">💰</div>
            <h3 className="mb-2 text-xl font-semibold">Split Costs</h3>
            <p className="text-blue-100">
              Share accommodation costs fairly and save money on your event experience
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
