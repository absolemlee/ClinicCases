'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type CaseItem = {
  id: number;
  caseNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  caseType: string | null;
};

export function MyCases() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCases();
  }, []);

  const fetchMyCases = async () => {
    try {
      const response = await fetch('/api/cases?limit=5');
      if (response.ok) {
        const data = await response.json();
        setCases(data.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to fetch cases:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">My Cases</h2>
        <Link href="/cases" className="text-sm text-brand-400 hover:text-brand-300">
          View all →
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"></div>
        </div>
      ) : cases.length > 0 ? (
        <div className="space-y-2">
          {cases.map((caseItem) => (
            <Link
              key={caseItem.id}
              href={`/cases/${caseItem.id}`}
              className="block rounded-lg border border-slate-700/50 bg-slate-900/40 p-3 hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    {caseItem.firstName} {caseItem.lastName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {caseItem.caseNumber || `#${caseItem.id}`}
                    {caseItem.caseType && ` • ${caseItem.caseType}`}
                  </p>
                </div>
                <span className="text-brand-400">→</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center py-8 text-slate-400">No cases assigned</p>
      )}
    </div>
  );
}
