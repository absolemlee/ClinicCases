'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewJournalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [journalId, setJournalId] = useState<number | null>(null);
  const [readers, setReaders] = useState<Array<{ username: string; name: string }>>([]);
  const [formData, setFormData] = useState({
    text: '',
    reader: [] as string[],
  });

  useEffect(() => {
    fetchReaders();
    createJournal();
  }, []);

  useEffect(() => {
    if (journalId && formData.text) {
      const timer = setTimeout(() => {
        autoSave();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [formData.text, formData.reader, journalId]);

  const fetchReaders = async () => {
    try {
      const response = await fetch('/api/users?filter=journal_readers');
      if (response.ok) {
        const data = await response.json();
        setReaders(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching readers:', error);
    }
  };

  const createJournal = async () => {
    try {
      const response = await fetch('/api/journals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: '', reader: '' }),
      });

      if (response.ok) {
        const data = await response.json();
        setJournalId(data.data.id);
      }
    } catch (error) {
      console.error('Error creating journal:', error);
    }
  };

  const autoSave = async () => {
    if (!journalId) return;

    setSaving(true);
    try {
      await fetch(`/api/journals/${journalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: formData.text,
          reader: formData.reader.join(','),
        }),
      });
    } catch (error) {
      console.error('Error saving journal:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, text: e.target.value }));
  };

  const handleReaderToggle = (username: string) => {
    setFormData((prev) => ({
      ...prev,
      reader: prev.reader.includes(username)
        ? prev.reader.filter((r) => r !== username)
        : [...prev.reader, username],
    }));
  };

  const handleDone = () => {
    router.push('/journals');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">New Journal</h1>
          <p className="mt-1 text-sm text-slate-400">
            {saving ? 'Saving...' : 'Auto-saved'} • Write your journal entry below
          </p>
        </div>
        <button
          onClick={handleDone}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Done
        </button>
      </div>

      {/* Send To */}
      <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-6">
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Send To: <span className="text-red-400">*</span>
        </label>
        <div className="space-y-2">
          {readers.length === 0 && (
            <p className="text-sm text-slate-400">Loading readers...</p>
          )}
          {readers.map((reader) => (
            <label key={reader.username} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.reader.includes(reader.username)}
                onChange={() => handleReaderToggle(reader.username)}
                className="w-4 h-4 text-brand-500 border-slate-600 rounded focus:ring-brand-500 focus:ring-offset-slate-900"
              />
              <span className="text-sm text-white">{reader.name || reader.username}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Journal Text */}
      <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-6">
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Journal Entry
        </label>
        <textarea
          value={formData.text}
          onChange={handleTextChange}
          rows={20}
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          placeholder="Write your journal entry here..."
        />
        <p className="mt-2 text-xs text-slate-500">
          Your journal is automatically saved as you type.
        </p>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between border-t border-slate-700 pt-4">
        <Link
          href="/journals"
          className="text-sm text-slate-400 hover:text-white"
        >
          ← Back to Journals
        </Link>
        <button
          onClick={handleDone}
          className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
        >
          Finish & Return
        </button>
      </div>
    </div>
  );
}
