import { LegacyMappingCallout } from "@/components/shared/LegacyMappingCallout";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <LegacyMappingCallout
        title="Personal home"
        description="Blend calendars, timers, and activity feeds with personalized data providers."
        legacyFile="Home.php"
      />
      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-xl font-semibold text-white">Integration focus</h2>
        <p className="mt-2 text-sm text-slate-300">
          Start by mirroring the availability calendar and case timer components, exposing them as standalone React widgets
          consumable across the dashboard and case detail views.
        </p>
      </section>
    </div>
  );
}
