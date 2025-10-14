import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(process.cwd(), "..");
const guidePath = path.join(repoRoot, "documentation", "nextjs-migration-guide.md");

function readGuideExcerpt(): string {
  try {
    const contents = fs.readFileSync(guidePath, "utf8");
    return contents;
  } catch (error) {
    console.error("Unable to read migration guide", error);
    return "";
  }
}

const guideExcerpt = readGuideExcerpt();

const phases = [
  {
    id: "project-setup",
    title: "Project setup",
    description:
      "Spin up the Next.js workspace with TypeScript, ESLint, and Tailwind to mirror the PHP app's global styles.",
    guideSummary:
      "Section 3.1 recommends \"npx create-next-app\" with supporting tooling such as TypeScript, ESLint, and Tailwind CSS."
  },
  {
    id: "cm-columns",
    title: "Dynamic case columns",
    description:
      "Design Prisma models for cm and cm_columns so case forms remain configurable without redeploying the app.",
    guideSummary:
      "Section 1.2 explains how cm_columns metadata is paired with cm values to power dynamic case forms."
  },
  {
    id: "case-list",
    title: "Case list and filters",
    description:
      "Rebuild the Cases.php DataTable as a server component that respects role-based filters from cm_case_assignees.",
    guideSummary:
      "Section 1.3 describes how cm_case_assignees controls the default case query while Section 2.1 inventories Cases.php."
  },
  {
    id: "case-detail",
    title: "Case detail shell",
    description:
      "Create nested routes for notes, contacts, documents, and messages following the interior templates inventory.",
    guideSummary:
      "Section 2.2 lists the interior templates required to reproduce the tabbed case detail experience."
  }
];

export default function MigrationDocumentationPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Next.js migration playbook</h1>
        <p className="text-sm text-slate-300">
          The original research file that anchors this project lives at
          {" "}
          <code className="rounded bg-slate-800 px-1 py-0.5">documentation/nextjs-migration-guide.md</code>.
          The excerpts below reference key sections as we phase functionality into the React codebase.
        </p>
      </header>

      <section className="space-y-3" id="guide-excerpt">
        <h2 className="text-2xl font-semibold text-white">Guide excerpt</h2>
        <p className="text-sm text-slate-400">
          A raw copy of the guide is embedded below for quick reference while implementing features.
        </p>
        <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-300">
          {guideExcerpt || "Migration guide could not be loaded in this environment."}
        </pre>
      </section>

      <section className="space-y-4" id="phased-plan">
        <h2 className="text-2xl font-semibold text-white">Phased implementation map</h2>
        <ol className="space-y-4">
          {phases.map((phase) => (
            <li key={phase.id} id={phase.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-200">{phase.id}</p>
              <h3 className="mt-1 text-xl font-semibold text-white">{phase.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{phase.description}</p>
              <p className="mt-2 text-xs text-slate-400">{phase.guideSummary}</p>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
