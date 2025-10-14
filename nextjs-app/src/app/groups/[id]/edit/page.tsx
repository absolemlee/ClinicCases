'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

interface Group {
  id: number;
  groupName: string;
  displayName: string;
  description: string | null;
  allowedTabs: string | null;
  addCases: number;
  editCases: number;
  deleteCases: number;
  viewOthers: number;
  writesJournals: number;
  readsJournals: number;
}

export default function EditGroupPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as string;
  
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedTabs, setSelectedTabs] = useState<string[]>([]);
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

  useEffect(() => {
    fetchGroup();
  }, [groupId]);

  const fetchGroup = async () => {
    try {
      const res = await fetch(`/api/groups/${groupId}`);
      const data = await res.json();
      
      if (data.success) {
        const group: Group = data.data;
        setFormData({
          groupName: group.groupName || '',
          displayName: group.displayName || '',
          description: group.description || '',
          addCases: group.addCases === 1,
          editCases: group.editCases === 1,
          deleteCases: group.deleteCases === 1,
          viewOthers: group.viewOthers === 1,
          writesJournals: group.writesJournals === 1,
          readsJournals: group.readsJournals === 1,
        });
        
        // Parse allowed tabs
        if (group.allowedTabs) {
          setSelectedTabs(group.allowedTabs.split(',').filter(t => t));
        }
      } else {
        setError('Group not found');
      }
    } catch (err) {
      console.error('Error fetching group:', err);
      setError('Failed to load group');
    } finally {
      setFetching(false);
    }
  };

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

    if (!formData.groupName || !formData.displayName) {
      setError('Group name and display name are required');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/groups/${groupId}`, {
        method: 'PUT',
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
        setError(data.error || 'Failed to update group');
      }
    } catch (err) {
      console.error('Error updating group:', err);
      setError('An error occurred while updating the group');
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-900 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500 mb-4"></div>
              <p className="text-slate-400">Loading group...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Edit Group</h1>
            <Link
              href="/groups"
              className="text-brand-400 hover:text-brand-300 transition-colors text-sm sm:text-base"
            >
              ← Back to Groups
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg shadow-lg p-4 sm:p-8">
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 pb-3 border-b border-slate-700">
              Basic Information
            </h2>
            <div className="space-y-6">
              {/* Group Name */}
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
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="e.g., students, faculty, supervisors"
                />
                <p className="mt-1.5 text-xs text-slate-400">
                  Internal identifier for the group (lowercase, no spaces recommended)
                </p>
              </div>

              {/* Display Name */}
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
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="e.g., Students, Faculty Members, Supervisors"
                />
                <p className="mt-1.5 text-xs text-slate-400">
                  User-facing name shown in the interface
                </p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
                  placeholder="Describe the purpose and role of this group..."
                />
                <p className="mt-1.5 text-xs text-slate-400">
                  Optional description to help identify the group's purpose
                </p>
              </div>
            </div>
          </div>

          {/* Tab Access Permissions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 pb-3 border-b border-slate-700">
              Tab Access Permissions
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Select which tabs members of this group can access
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {AVAILABLE_TABS.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => handleTabToggle(tab.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    selectedTabs.includes(tab.value)
                      ? 'bg-brand-500/20 border-brand-500 text-white'
                      : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <div className="text-2xl mb-1">{tab.icon}</div>
                  <div className="text-sm font-medium">{tab.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Case Permissions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 pb-3 border-b border-slate-700">
              Case Permissions
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Control what actions members can perform on cases
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Add Cases */}
              <label className="flex items-start space-x-3 p-4 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors border-2 border-transparent hover:border-green-500/30">
                <input
                  type="checkbox"
                  name="addCases"
                  checked={formData.addCases}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 text-green-600 bg-slate-600 border-slate-500 rounded focus:ring-green-500 focus:ring-2"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">➕</span>
                    <span className="text-white font-medium">Add Cases</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    Create new cases in the system
                  </p>
                </div>
              </label>

              {/* Edit Cases */}
              <label className="flex items-start space-x-3 p-4 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors border-2 border-transparent hover:border-blue-500/30">
                <input
                  type="checkbox"
                  name="editCases"
                  checked={formData.editCases}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 text-blue-600 bg-slate-600 border-slate-500 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✏️</span>
                    <span className="text-white font-medium">Edit Cases</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    Modify existing case details
                  </p>
                </div>
              </label>

              {/* Delete Cases */}
              <label className="flex items-start space-x-3 p-4 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors border-2 border-transparent hover:border-red-500/30">
                <input
                  type="checkbox"
                  name="deleteCases"
                  checked={formData.deleteCases}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 text-red-600 bg-slate-600 border-slate-500 rounded focus:ring-red-500 focus:ring-2"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🗑️</span>
                    <span className="text-white font-medium">Delete Cases</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    Remove cases from the system
                  </p>
                </div>
              </label>

              {/* View Others' Cases */}
              <label className="flex items-start space-x-3 p-4 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors border-2 border-transparent hover:border-purple-500/30">
                <input
                  type="checkbox"
                  name="viewOthers"
                  checked={formData.viewOthers}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 text-purple-600 bg-slate-600 border-slate-500 rounded focus:ring-purple-500 focus:ring-2"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👁️</span>
                    <span className="text-white font-medium">View Others' Cases</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    Access cases created by other users
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Journal Permissions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 pb-3 border-b border-slate-700">
              Journal Permissions
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Control journal access for this group
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Write Journals */}
              <label className="flex items-start space-x-3 p-4 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors border-2 border-transparent hover:border-yellow-500/30">
                <input
                  type="checkbox"
                  name="writesJournals"
                  checked={formData.writesJournals}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 text-yellow-600 bg-slate-600 border-slate-500 rounded focus:ring-yellow-500 focus:ring-2"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📝</span>
                    <span className="text-white font-medium">Write Journals</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    Create and edit journal entries
                  </p>
                </div>
              </label>

              {/* Read Journals */}
              <label className="flex items-start space-x-3 p-4 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors border-2 border-transparent hover:border-teal-500/30">
                <input
                  type="checkbox"
                  name="readsJournals"
                  checked={formData.readsJournals}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 text-teal-600 bg-slate-600 border-slate-500 rounded focus:ring-teal-500 focus:ring-2"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📖</span>
                    <span className="text-white font-medium">Read Journals</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    View journal entries from others
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-slate-700">
            <Link
              href="/groups"
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-center font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>✓</span>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
