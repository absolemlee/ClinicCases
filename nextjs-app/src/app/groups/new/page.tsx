'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const AVAILABLE_TABS = [
  { value: 'home', label: 'Home', icon: '🏠' },
  { value: 'cases', label: 'Cases', icon: '📁' },
  { value: 'messages', label: 'Messages', icon: '✉️' },
  { value: 'journals', label: 'Journals', icon: '📝' },
  { value: 'board', label: 'Board', icon: '📋' },
  { value: 'users', label: 'Users', icon: '👥' },
  { value: 'groups', label: 'Groups', icon: '👨‍👩‍👧‍👦' },
  { value: 'utilities', label: 'Utilities', icon: '⚙️' },
];

export default function NewGroupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTabs, setSelectedTabs] = useState<string[]>(['home', 'cases', 'messages']);
  const [formData, setFormData] = useState({
    groupName: '',
    displayName: '',
    description: '',
    addCases: false,
    editCases: false,
    deleteCases: false,
    viewOthers: false,
    writesJournals: false,
    readsJournals: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleTabToggle = (tab: string) => {
    setSelectedTabs(prev =>
      prev.includes(tab) ? prev.filter(t => t !== tab) : [...prev, tab]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.groupName || !formData.displayName) {
      setError('Group name and display name are required');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupName: formData.groupName,
          displayName: formData.displayName,
          description: formData.description || null,
          allowedTabs: selectedTabs.join(','),
          addCases: formData.addCases ? 1 : 0,
          editCases: formData.editCases ? 1 : 0,
          deleteCases: formData.deleteCases ? 1 : 0,
          viewOthers: formData.viewOthers ? 1 : 0,
          writesJournals: formData.writesJournals ? 1 : 0,
          readsJournals: formData.readsJournals ? 1 : 0,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/groups');
      } else {
        setError(data.error || 'Failed to create group');
      }
    } catch (err) {
      console.error('Error creating group:', err);
      setError('An error occurred while creating the group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Create New Group</h1>
            <Link
              href="/groups"
              className="text-slate-400 hover:text-white transition-colors text-sm sm:text-base"
            >
              ← Back to Groups
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-slate-800/40 border border-slate-700 rounded-lg shadow-lg p-4 sm:p-6 space-y-6 sm:space-y-8">
          
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="groupName" className="block text-sm font-medium text-slate-300 mb-2">
                  Group Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="groupName"
                  name="groupName"
                  required
                  value={formData.groupName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g., attorneys"
                />
                <p className="mt-1 text-xs text-slate-500">Internal identifier (lowercase, no spaces)</p>
              </div>

              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-slate-300 mb-2">
                  Display Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  required
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g., Attorneys"
                />
                <p className="mt-1 text-xs text-slate-500">Friendly name shown in UI</p>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y"
                  placeholder="Brief description of this group's purpose..."
                />
              </div>
            </div>
          </div>

          {/* Tab Access Permissions */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Tab Access Permissions</h2>
            <p className="text-sm text-slate-400 mb-4">
              Select which tabs members of this group can access
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {AVAILABLE_TABS.map((tab) => (
                <label
                  key={tab.value}
                  className={`flex items-center p-3 sm:p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedTabs.includes(tab.value)
                      ? 'bg-brand-500/10 border-brand-500/50'
                      : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedTabs.includes(tab.value)}
                    onChange={() => handleTabToggle(tab.value)}
                    className="mr-3 h-4 w-4 rounded border-slate-600 text-brand-600 focus:ring-brand-500"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{tab.icon}</span>
                    <span className="text-sm font-medium text-white">{tab.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Case Permissions */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Case Permissions</h2>
            <p className="text-sm text-slate-400 mb-4">
              Define what case operations this group can perform
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`flex items-start p-4 rounded-lg border cursor-pointer transition-all ${
                formData.addCases
                  ? 'bg-green-500/10 border-green-500/50'
                  : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
              }`}>
                <input
                  type="checkbox"
                  name="addCases"
                  checked={formData.addCases}
                  onChange={handleChange}
                  className="mt-1 mr-3 h-4 w-4 rounded border-slate-600 text-green-600 focus:ring-green-500"
                />
                <div>
                  <div className="text-sm font-medium text-white mb-1">
                    ➕ Add Cases
                  </div>
                  <div className="text-xs text-slate-400">
                    Create new cases in the system
                  </div>
                </div>
              </label>

              <label className={`flex items-start p-4 rounded-lg border cursor-pointer transition-all ${
                formData.editCases
                  ? 'bg-blue-500/10 border-blue-500/50'
                  : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
              }`}>
                <input
                  type="checkbox"
                  name="editCases"
                  checked={formData.editCases}
                  onChange={handleChange}
                  className="mt-1 mr-3 h-4 w-4 rounded border-slate-600 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="text-sm font-medium text-white mb-1">
                    ✏️ Edit Cases
                  </div>
                  <div className="text-xs text-slate-400">
                    Modify existing case information
                  </div>
                </div>
              </label>

              <label className={`flex items-start p-4 rounded-lg border cursor-pointer transition-all ${
                formData.deleteCases
                  ? 'bg-red-500/10 border-red-500/50'
                  : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
              }`}>
                <input
                  type="checkbox"
                  name="deleteCases"
                  checked={formData.deleteCases}
                  onChange={handleChange}
                  className="mt-1 mr-3 h-4 w-4 rounded border-slate-600 text-red-600 focus:ring-red-500"
                />
                <div>
                  <div className="text-sm font-medium text-white mb-1">
                    🗑️ Delete Cases
                  </div>
                  <div className="text-xs text-slate-400">
                    Remove cases from the system
                  </div>
                </div>
              </label>

              <label className={`flex items-start p-4 rounded-lg border cursor-pointer transition-all ${
                formData.viewOthers
                  ? 'bg-purple-500/10 border-purple-500/50'
                  : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
              }`}>
                <input
                  type="checkbox"
                  name="viewOthers"
                  checked={formData.viewOthers}
                  onChange={handleChange}
                  className="mt-1 mr-3 h-4 w-4 rounded border-slate-600 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <div className="text-sm font-medium text-white mb-1">
                    👁️ View Others' Cases
                  </div>
                  <div className="text-xs text-slate-400">
                    See cases assigned to other users
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Journal Permissions */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Journal Permissions</h2>
            <p className="text-sm text-slate-400 mb-4">
              Control journal access for this group
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`flex items-start p-4 rounded-lg border cursor-pointer transition-all ${
                formData.writesJournals
                  ? 'bg-yellow-500/10 border-yellow-500/50'
                  : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
              }`}>
                <input
                  type="checkbox"
                  name="writesJournals"
                  checked={formData.writesJournals}
                  onChange={handleChange}
                  className="mt-1 mr-3 h-4 w-4 rounded border-slate-600 text-yellow-600 focus:ring-yellow-500"
                />
                <div>
                  <div className="text-sm font-medium text-white mb-1">
                    ✍️ Write Journals
                  </div>
                  <div className="text-xs text-slate-400">
                    Create and edit journal entries
                  </div>
                </div>
              </label>

              <label className={`flex items-start p-4 rounded-lg border cursor-pointer transition-all ${
                formData.readsJournals
                  ? 'bg-teal-500/10 border-teal-500/50'
                  : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
              }`}>
                <input
                  type="checkbox"
                  name="readsJournals"
                  checked={formData.readsJournals}
                  onChange={handleChange}
                  className="mt-1 mr-3 h-4 w-4 rounded border-slate-600 text-teal-600 focus:ring-teal-500"
                />
                <div>
                  <div className="text-sm font-medium text-white mb-1">
                    📖 Read Others' Journals
                  </div>
                  <div className="text-xs text-slate-400">
                    View journal entries from other users
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-3 sm:space-x-4 pt-4 border-t border-slate-700">
            <Link
              href="/groups"
              className="w-full sm:w-auto text-center px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create Group</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
