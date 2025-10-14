import { LegacyMappingCallout } from "@/components/shared/LegacyMappingCallout";

export default function JournalsPage() {
  return (
    <div className="space-y-6">
      <LegacyMappingCallout
        title="Journals module"
        description="Outline the case-linked journaling experience with collaborative editing targets."
        legacyFile="Journals.php"
      />
      <article className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-xl font-semibold text-white">Planned feature slices</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-300">
          <li>
            <span className="font-semibold text-brand-200">Entries grid:</span> Server component lists journal entries with
            filters mirrored from the DataTable definition.
          </li>
          <li>
            <span className="font-semibold text-brand-200">Editor:</span> Client component integrates tiptap/Slate to replace
            TinyMCE while persisting HTML to match `cm_case_notes` expectations.
          </li>
          <li>
            <span className="font-semibold text-brand-200">Audit trail:</span> Present author/timestamp metadata sourced from
            journal loader endpoints.
          </li>
        </ul>
      </article>
    </div>
  );
}
