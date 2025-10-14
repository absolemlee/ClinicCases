import Link from "next/link";

export default function LandingPage() {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-8 shadow-xl">
      <h2 className="text-3xl font-bold text-white">Welcome to the Next.js migration pilot</h2>
      <p className="text-slate-300">
        This workspace gradually rebuilds the ClinicCases PHP interface within a modern Next.js application.
        Each section of the legacy navigation is reimagined as a route that will be iteratively filled with
        real data and workflows.
      </p>
      <p className="text-slate-300">
        Use the navigation to explore the initial scaffolding, or jump straight to the
        {" "}
        <Link href="/documentation/migration" className="font-semibold text-brand-200">
          migration plan
        </Link>
        {" "}
        for implementation notes mapped directly from the{' '}
        <code className="rounded bg-slate-800 px-1 py-0.5">documentation/nextjs-migration-guide.md</code>
        {" "}
        research file.
      </p>
    </section>
  );
}
