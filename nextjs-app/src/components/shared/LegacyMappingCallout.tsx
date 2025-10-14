import Link from "next/link";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export function LegacyMappingCallout({
  title,
  description,
  legacyFile
}: {
  title: string;
  description: string;
  legacyFile: string;
}) {
  return (
    <section className="rounded-xl border border-brand-500/40 bg-brand-500/10 p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-200">{legacyFile}</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">{title}</h2>
          <p className="mt-2 text-sm text-slate-100/80">{description}</p>
        </div>
        <Link
          href="/documentation/migration"
          className="inline-flex items-center gap-1 rounded-md bg-brand-500 px-3 py-2 text-sm font-semibold text-white shadow"
        >
          Review migration tasks
          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
