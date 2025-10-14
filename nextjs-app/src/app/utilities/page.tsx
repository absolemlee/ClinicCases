import { LegacyMappingCallout } from "@/components/shared/LegacyMappingCallout";

export default function UtilitiesPage() {
  return (
    <div className="space-y-6">
      <LegacyMappingCallout
        title="Administrative utilities"
        description="Break monolithic PHP scripts into focused server actions for configuration management."
        legacyFile="Utilities.php"
      />
      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-xl font-semibold text-white">Utility backlog</h2>
        <p className="mt-2 text-sm text-slate-300">
          Prioritize configuration panels that unblock case entry: case types, clinics, and checklist templates.
        </p>
        <p className="mt-2 text-sm text-slate-300">
          Long term, convert report downloads into incremental static regeneration endpoints for reliability.
        </p>
      </section>
    </div>
  );
}
