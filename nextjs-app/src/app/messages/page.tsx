import { LegacyMappingCallout } from "@/components/shared/LegacyMappingCallout";

const roadmapItems = [
  {
    title: "Inbox list",
    detail: "Streamlined list component with filters mirroring Messages.php tabs.",
    legacy: "html/templates/Messages.php"
  },
  {
    title: "Thread viewer",
    detail: "Client-side rendering for composer + thread using modern rich text editors.",
    legacy: "html/templates/interior/messages_display.php"
  }
];

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <LegacyMappingCallout
        title="Unified messaging"
        description="Carve out API routes and client components for the case-aware messaging workflow."
        legacyFile="Messages.php"
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {roadmapItems.map((item) => (
          <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-200">{item.legacy}</p>
            <h2 className="mt-2 text-lg font-semibold text-white">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
