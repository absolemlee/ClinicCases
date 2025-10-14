import { LegacyMappingCallout } from "@/components/shared/LegacyMappingCallout";

const widgets = [
  {
    title: "Board summary",
    description:
      "Surface announcements, tasks, and timers that power the classic Board.php landing experience.",
    legacySource: "html/templates/Board.php"
  },
  {
    title: "Activity feed",
    description: "Realtime updates blend case notes, messages, and events in a single digest.",
    legacySource: "html/templates/interior/home_activities.php"
  }
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <LegacyMappingCallout
        title="Dashboard modernization"
        description="Recreate the PHP dashboard as modular React widgets backed by unified data loaders."
        legacyFile="Board.php"
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {widgets.map((widget) => (
          <article key={widget.title} className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-300">
              {widget.legacySource}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">{widget.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{widget.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
