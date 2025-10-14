import Link from 'next/link';
import type { CaseWithDetails } from '@/app/cases/page';

type CaseListTableProps = {
  cases: CaseWithDetails[];
  onRefresh: () => void;
};

export function CaseListTable({ cases, onRefresh }: CaseListTableProps) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/40 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800/60 border-b border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Case #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Client Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Opened
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Assigned
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {cases.map((caseItem) => (
              <tr
                key={caseItem.id}
                className="hover:bg-slate-700/20 transition-colors"
              >
                <td className="px-4 py-3 text-sm">
                  <Link
                    href={`/cases/${caseItem.id}`}
                    className="font-mono text-brand-400 hover:text-brand-300 hover:underline"
                  >
                    {caseItem.caseNumber || `#${caseItem.id}`}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-slate-200">
                  {caseItem.firstName || caseItem.lastName
                    ? `${caseItem.firstName || ''} ${caseItem.lastName || ''}`.trim()
                    : '—'}
                </td>
                <td className="px-4 py-3 text-sm text-slate-300">
                  {caseItem.caseType || '—'}
                </td>
                <td className="px-4 py-3 text-sm text-slate-300">
                  {caseItem.dateOpen || '—'}
                </td>
                <td className="px-4 py-3 text-sm">
                  {caseItem.dateClose ? (
                    <span className="inline-flex items-center rounded-full bg-slate-700 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                      Closed
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-medium text-green-300">
                      Open
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-slate-300">
                  {caseItem.assignees.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {caseItem.assignees
                        .filter((a) => a.status === 'active')
                        .map((assignee, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded bg-brand-500/20 px-2 py-0.5 text-xs text-brand-200"
                          >
                            {assignee.username}
                          </span>
                        ))}
                    </div>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <Link
                    href={`/cases/${caseItem.id}`}
                    className="text-brand-400 hover:text-brand-300 hover:underline"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with refresh button */}
      <div className="border-t border-slate-700 bg-slate-800/30 px-4 py-3 flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Showing {cases.length} {cases.length === 1 ? 'case' : 'cases'}
        </p>
        <button
          onClick={onRefresh}
          className="text-sm text-brand-400 hover:text-brand-300 hover:underline"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
