import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-instagram-purple/20 blur-[100px]" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-instagram-pink/20 blur-[100px]" />
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-instagram-orange/20 blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12">
        <div className="font-heading text-xl font-bold tracking-tight">
          <span className="gradient-text">Sharing</span>
          <span className="text-white/80"> Is Caring</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/events"
            className="text-sm text-white/60 transition-colors hover:text-white"
          >
            Explore
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-instagram-pink" />
          <span className="text-sm text-white/70">Join 10,000+ event-goers</span>
        </div>

        <h1 className="font-heading mb-6 max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          <span className="text-white">Find your perfect</span>
          <br />
          <span className="gradient-text">event roommate</span>
        </h1>

        <p className="mb-10 max-w-xl text-lg text-white/50 md:text-xl">
          Smart matching for festivals, conferences, and events worldwide.
          Split costs. Share experiences. Make memories.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/login"
            className="group relative overflow-hidden rounded-full px-8 py-4 font-medium text-white transition-all"
          >
            <span className="gradient-primary absolute inset-0 transition-all group-hover:scale-105" />
            <span className="relative flex items-center gap-2">
              Get Started Free
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </Link>
          <Link
            href="/events"
            className="rounded-full border border-white/20 bg-white/5 px-8 py-4 font-medium text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
          >
            Browse Events
          </Link>
        </div>

        {/* Event tags */}
        <div className="mt-16 flex flex-wrap justify-center gap-3">
          {['Festivals', 'Conferences', 'Concerts', 'Sports', 'Conventions'].map(
            (tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 backdrop-blur-sm transition-all hover:border-white/20 hover:text-white/80"
              >
                {tag}
              </span>
            )
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="font-heading mb-4 text-3xl font-bold text-white md:text-4xl">
              Why choose us?
            </h2>
            <p className="text-white/50">
              The smarter way to share event accommodations
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon="🎯"
              title="Smart Matching"
              description="AI-powered algorithm matches you based on lifestyle, budget, and preferences for the perfect fit."
            />
            <FeatureCard
              icon="🛡️"
              title="Verified & Safe"
              description="Multi-level verification, reviews, and safety features ensure you connect with trusted people."
            />
            <FeatureCard
              icon="💸"
              title="Split Costs"
              description="Fair cost splitting and secure payments. Save up to 70% on accommodation costs."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 border-y border-white/10 bg-white/5 px-6 py-16 backdrop-blur-sm md:px-12">
        <div className="mx-auto grid max-w-4xl gap-8 text-center md:grid-cols-3">
          <StatCard value="10K+" label="Happy Users" />
          <StatCard value="500+" label="Events Covered" />
          <StatCard value="$2M+" label="Saved on Stays" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading mb-6 text-3xl font-bold text-white md:text-5xl">
            Ready to find your
            <span className="gradient-text"> perfect match</span>?
          </h2>
          <p className="mb-10 text-lg text-white/50">
            Join thousands of event-goers who save money and make friends.
          </p>
          <Link
            href="/login"
            className="group relative inline-flex overflow-hidden rounded-full px-10 py-5 font-medium text-white transition-all"
          >
            <span className="gradient-primary absolute inset-0 transition-all group-hover:scale-105" />
            <span className="relative">Start Matching Now</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-8 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-white/40 md:flex-row">
          <div className="font-heading font-medium">
            <span className="gradient-text">Sharing</span> Is Caring
          </div>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-white/60">
              About
            </Link>
            <Link href="/privacy" className="hover:text-white/60">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white/60">
              Terms
            </Link>
          </div>
          <div>© 2024 Sharing Is Caring</div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="glass glass-hover group rounded-2xl p-8">
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-instagram-soft text-2xl">
        {icon}
      </div>
      <h3 className="font-heading mb-3 text-xl font-semibold text-white">
        {title}
      </h3>
      <p className="text-white/50">{description}</p>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-heading gradient-text text-4xl font-bold md:text-5xl">
        {value}
      </div>
      <div className="mt-2 text-white/50">{label}</div>
    </div>
  );
}
