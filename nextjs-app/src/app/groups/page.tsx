import { LegacyMappingCallout } from "@/components/shared/LegacyMappingCallout";

export default function GroupsPage() {
  return (
    <div className="space-y-6">
      <LegacyMappingCallout
        title="Group permissions"
        description="Design a role-based access control surface aligned with cm_groups and NextAuth session claims."
        legacyFile="Group.php"
      />
      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-xl font-semibold text-white">RBAC checklist</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          <li>Mirror existing role definitions and tab entitlements.</li>
          <li>Map PHP permission checks to reusable React hooks.</li>
          <li>Expose admin-only configuration screens behind server actions.</li>
        </ul>
      </section>
    </div>
  );
}
