'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CaseDetailHeader } from '@/components/cases/CaseDetailHeader';
import { CaseDetailTabs } from '@/components/cases/CaseDetailTabs';

type CaseDetail = {
  id: number;
  caseNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  caseType: string | null;
  clinicType: string | null;
  dateOpen: string | null;
  dateClose: string | null;
  openedBy: string | null;
  assignees: Array<{ id: number; username: string; status: string; dateAssigned: Date | null }>;
  notes: Array<{ id: number; username: string; description: string | null; datestamp: Date | null }>;
  contacts: Array<{ id: number; firstName: string | null; lastName: string | null; type: string | null }>;
  documents: Array<{ id: number; displayName: string | null; extension: string | null }>;
  events: Array<{ id: number; task: string | null; start: Date | null; status: string | null }>;
};

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params?.id as string;
  
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'contacts' | 'documents' | 'events' | 'assignments'>('overview');

  useEffect(() => {
    if (caseId) {
      fetchCaseDetail();
    }
  }, [caseId]);

  const fetchCaseDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cases/${caseId}`);
      if (!response.ok) throw new Error('Failed to fetch case details');
      
      const data = await response.json();
      setCaseData(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Link href="/cases" className="text-sm text-brand-400 hover:text-brand-300">
          ← Back to Cases
        </Link>
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
          <p className="mt-4 text-slate-400">Loading case details...</p>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="space-y-6">
        <Link href="/cases" className="text-sm text-brand-400 hover:text-brand-300">
          ← Back to Cases
        </Link>
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-200">
          <p className="font-semibold">Error loading case</p>
          <p className="mt-1 text-sm">{error || 'Case not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/cases" className="text-sm text-brand-400 hover:text-brand-300">
        ← Back to Cases
      </Link>

      <CaseDetailHeader caseData={caseData} />

      <CaseDetailTabs
        caseData={caseData}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefresh={fetchCaseDetail}
      />
    </div>
  );
}
