import Link from "next/link";
import { LegacyMappingCallout } from "@/components/shared/LegacyMappingCallout";

const plannedPanels = [
  {
    title: "Case list",
    description: "Server components mirror the Cases.php DataTable with column configuration from cm_columns.",
    resources: [
      { label: "Legacy markup", href: "/documentation/migration#case-list" },
      { label: "Case data loader", href: "https://github.com/ClinicCases/ClinicCases/blob/master/lib/php/data/cases_load.php" }
    ]
  },
  {
    title: "Case detail shell",
    description: "Nested layouts reproduce the tabbed case experience before wiring individual modules.",
    resources: [
      { label: "cases_detail.php", href: "/documentation/migration#case-detail" },
      { label: "cm_columns guidance", href: "/documentation/migration#cm-columns" }
    ]
  }
];

export default function CasesPage() {
  return (
    <div className="space-y-6">
      <LegacyMappingCallout
        title="Cases workspace"
        description="Bootstrap the primary case list and nested layouts that anchor the majority of day-to-day work."
        legacyFile="Cases.php"
      />

      <div className="space-y-4">
        {plannedPanels.map((panel) => (
          <article key={panel.title} className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-xl font-semibold text-white">{panel.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{panel.description}</p>
            <ul className="mt-4 flex flex-wrap gap-3 text-sm">
              {panel.resources.map((resource) => (
                <li key={resource.href}>
                  <Link
                    href={resource.href}
                    className="inline-flex items-center gap-1 rounded-full border border-brand-400/40 bg-brand-500/10 px-3 py-1 text-brand-200"
                  >
                    {resource.label}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
