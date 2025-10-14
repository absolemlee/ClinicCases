type CaseData = {
  id: number;
  caseNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  caseType: string | null;
  clinicType: string | null;
  dateOpen: string | null;
  dateClose: string | null;
  openedBy: string | null;
  assignees: Array<{ username: string; status: string; dateAssigned: Date | null }>;
};

type CaseDetailHeaderProps = {
  caseData: CaseData;
};

export function CaseDetailHeader({ caseData }: CaseDetailHeaderProps) {
  const clientName = [caseData.firstName, caseData.lastName]
    .filter(Boolean)
    .join(' ') || 'Unnamed Client';

  const activeAssignees = caseData.assignees.filter((a) => a.status === 'active');

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{clientName}</h1>
            {caseData.dateClose ? (
              <span className="inline-flex items-center rounded-full bg-slate-700 px-3 py-1 text-xs font-medium text-slate-300">
                Closed
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-300">
                Open
              </span>
            )}
          </div>
          <p className="mt-1 font-mono text-sm text-slate-400">
            Case #{caseData.caseNumber || caseData.id}
          </p>
        </div>

        <button className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600 transition-colors">
          Edit Case
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Case Type
          </p>
          <p className="mt-1 text-sm text-slate-200">
            {caseData.caseType || '—'}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Clinic
          </p>
          <p className="mt-1 text-sm text-slate-200">
            {caseData.clinicType || '—'}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Opened
          </p>
          <p className="mt-1 text-sm text-slate-200">
            {caseData.dateOpen || '—'}
            {caseData.openedBy && (
              <span className="text-slate-400"> by {caseData.openedBy}</span>
            )}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Assigned To
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {activeAssignees.length > 0 ? (
              activeAssignees.map((assignee, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded bg-brand-500/20 px-2 py-0.5 text-xs text-brand-200"
                >
                  {assignee.username}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-400">Unassigned</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
