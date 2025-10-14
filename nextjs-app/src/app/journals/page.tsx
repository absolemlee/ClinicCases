'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Journal {
  id: number;
  username: string;
  reader: string | null;
  text: string | null;
  dateAdded: string | null;
  archived: string | null;
  read: string | null;
  commented: string | null;
  comments: string | null;
}

interface JournalPermissions {
  writesJournals: boolean;
  readsJournals: boolean;
}

export default function JournalsPage() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'unread' | 'read' | 'all' | 'archived'>('unread');
  const [permissions, setPermissions] = useState<JournalPermissions>({
    writesJournals: false,
    readsJournals: false,
  });

  useEffect(() => {
    fetchJournals();
  }, [filter]);

  const fetchJournals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/journals?filter=${filter}`);
      if (!response.ok) throw new Error('Failed to fetch journals');
      
      const data = await response.json();
      setJournals(data.data || []);
      setPermissions(data.permissions || { writesJournals: false, readsJournals: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      {/* Header - Mobile responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Journals</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            {permissions.writesJournals && 'Write and manage your journals'}
            {permissions.readsJournals && 'Read and comment on student journals'}
            {!permissions.writesJournals && !permissions.readsJournals && 'View journals'}
          </p>
        </div>
        {permissions.writesJournals && (
          <Link
            href="/journals/new"
            className="w-full sm:w-auto text-center rounded-lg bg-brand-500 px-4 py-2.5 sm:py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
          >
            + New Journal
          </Link>
        )}
      </div>

      {/* Filters - Scrollable on mobile */}
      <div className="flex items-center gap-2 border-b border-slate-700 pb-3 sm:pb-4 overflow-x-auto">
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
            filter === 'unread'
              ? 'bg-brand-500 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
            filter === 'read'
              ? 'bg-brand-500 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          Read
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
            filter === 'all'
              ? 'bg-brand-500 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('archived')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'archived'
              ? 'bg-brand-500 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          Archived
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-200">
          <p className="font-semibold">Error loading journals</p>
          <p className="mt-1 text-sm">{error}</p>
          <button
            onClick={fetchJournals}
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
          <p className="mt-4 text-slate-400">Loading journals...</p>
        </div>
      )}

      {/* Journals List */}
      {!loading && !error && journals.length === 0 && (
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-8 sm:p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-4xl mb-4">📔</div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
              {filter === 'unread' && 'No Unread Journals'}
              {filter === 'read' && 'No Read Journals'}
              {filter === 'archived' && 'No Archived Journals'}
              {filter === 'all' && 'No Journals Yet'}
            </h3>
            <p className="text-sm sm:text-base text-slate-400 mb-6">
              {filter === 'unread' && 'You\'re all caught up! Check back later for new entries.'}
              {filter === 'read' && 'No journals have been marked as read yet.'}
              {filter === 'archived' && 'No journals have been archived yet.'}
              {filter === 'all' && permissions.writesJournals && 'Start documenting your work and learning by creating your first journal entry.'}
              {filter === 'all' && !permissions.writesJournals && 'No journal entries are available yet.'}
            </p>
            {permissions.writesJournals && (filter === 'unread' || filter === 'all') && (
              <Link
                href="/journals/new"
                className="inline-block px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-sm sm:text-base font-medium"
              >
                ✏️ Create Your First Journal Entry
              </Link>
            )}
          </div>
        </div>
      )}

      {!loading && !error && journals.length > 0 && (
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Preview
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {journals.map((journal) => (
                <tr key={journal.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{journal.username}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-300 line-clamp-2">
                      {journal.text?.substring(0, 100) || 'No content'}
                      {journal.text && journal.text.length > 100 && '...'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-400">
                      {journal.dateAdded
                        ? formatDistanceToNow(new Date(journal.dateAdded), { addSuffix: true })
                        : 'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {journal.commented === 'yes' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                        Commented
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/journals/${journal.id}`}
                      className="text-brand-400 hover:text-brand-300"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
