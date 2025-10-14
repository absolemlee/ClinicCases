import { LegacyMappingCallout } from "@/components/shared/LegacyMappingCallout";

export default function PreferencesPage() {
  return (
    <div className="space-y-6">
      <LegacyMappingCallout
        title="User preferences"
        description="Translate profile and notification settings into forms backed by new API routes."
        legacyFile="Prefs.php"
      />
      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-xl font-semibold text-white">Next steps</h2>
        <p className="mt-2 text-sm text-slate-300">
          Map legacy PHP form fields to Prisma models, then migrate update workflows using React Hook Form and server actions
          for optimistic updates.
        </p>
      </section>
    </div>
  );
}
