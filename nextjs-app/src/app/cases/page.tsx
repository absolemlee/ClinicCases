'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CaseListTable } from '@/components/cases/CaseListTable';
import { CaseFilters } from '@/components/cases/CaseFilters';
import { usePermissions } from '@/hooks/usePermissions';

export type CaseWithDetails = {
  id: number;
  caseNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  caseType: string | null;
  dateOpen: string | null;
  dateClose: string | null;
  assignedUsers: string | null;
  assignees: Array<{ username: string; status: string }>;
  notes: Array<{ id: number; description: string | null; datestamp: Date | null }>;
};

export default function CasesPage() {
  const [cases, setCases] = useState<CaseWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');
  const { permissions, loading: permissionsLoading } = usePermissions();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cases');
      if (!response.ok) throw new Error('Failed to fetch cases');
      
      const data = await response.json();
      setCases(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter((c) => {
    if (filter === 'open') return !c.dateClose;
    if (filter === 'closed') return !!c.dateClose;
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Cases</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage and track client cases
          </p>
        </div>
        {permissions.addCases && (
          <Link
            href="/cases/new"
            className="w-full sm:w-auto text-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
          >
            + New Case
          </Link>
        )}
      </div>

      {/* Filters */}
      <CaseFilters
        currentFilter={filter}
        onFilterChange={setFilter}
        totalCases={cases.length}
        openCases={cases.filter((c) => !c.dateClose).length}
        closedCases={cases.filter((c) => !!c.dateClose).length}
      />

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-200">
          <p className="font-semibold">Error loading cases</p>
          <p className="mt-1 text-sm">{error}</p>
          <button
            onClick={fetchCases}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
          <p className="mt-4 text-slate-400">Loading cases...</p>
        </div>
      )}

      {/* Cases Table */}
      {!loading && !error && (
        <CaseListTable cases={filteredCases} onRefresh={fetchCases} />
      )}

      {/* Empty State */}
      {!loading && !error && filteredCases.length === 0 && (
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-12 text-center">
          <p className="text-lg text-slate-300">No cases found</p>
          <p className="mt-2 text-sm text-slate-400">
            {filter !== 'all'
              ? `No ${filter} cases available. Try changing the filter.`
              : 'Get started by creating your first case.'}
          </p>
          {filter === 'all' && (
            <Link
              href="/cases/new"
              className="mt-4 inline-block rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
            >
              Create First Case
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
