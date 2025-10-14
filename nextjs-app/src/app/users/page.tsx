import { LegacyMappingCallout } from "@/components/shared/LegacyMappingCallout";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <LegacyMappingCallout
        title="User administration"
        description="Plan Prisma models and UI scaffolding for managing cm_users and related associations."
        legacyFile="Users.php"
      />
      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-xl font-semibold text-white">Initial milestones</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-6 text-sm text-slate-300">
          <li>Model <code>cm_users</code> with Prisma including password hash + key metadata.</li>
          <li>Stand up protected API routes for listing and updating users.</li>
          <li>Rebuild the legacy DataTable as a paginated React server component.</li>
        </ol>
      </section>
    </div>
  );
}
