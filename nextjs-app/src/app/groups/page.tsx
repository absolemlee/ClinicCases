'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getUserTypeDisplay, 
  getAvailableAbilities, 
  getAbilityDisplay, 
  getAbilityIcon,
  USER_TYPES,
  type UserType 
} from '@/lib/permissions-client';

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
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/groups');
      const data = await res.json();

      if (data.success) {
        setGroups(data.data);
      } else {
        setError(data.error || 'Failed to load groups');
      }
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this group?')) return;

    try {
      const res = await fetch(`/api/groups/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        setGroups(groups.filter((g) => g.id !== id));
      } else {
        alert('Failed to delete group');
      }
    } catch (err) {
      console.error('Error deleting group:', err);
      alert('Failed to delete group');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Group Management</h1>
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
          <p className="mt-4 text-slate-400">Loading groups...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Group Management</h1>
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-200">
          <p className="font-semibold">Error loading groups</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Group Management</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage user groups and permissions
          </p>
        </div>
        <Link
          href="/groups/new"
          className="w-full sm:w-auto text-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
        >
          Add New Group
        </Link>
      </div>

        {/* Groups Table */}
        <div className="bg-slate-800/40 rounded-lg border border-slate-700 shadow-lg overflow-hidden">
          {groups.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No groups found
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    User Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Available Abilities
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Case Permissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-800/20 divide-y divide-slate-700">
                {groups.map((group) => {
                  const isUserType = Object.values(USER_TYPES).includes(group.groupName as UserType);
                  const availableAbilities = isUserType ? getAvailableAbilities(group.groupName as UserType) : [];
                  
                  return (
                    <tr key={group.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {group.displayName}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {group.groupName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-300 max-w-xs">
                          {group.description || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isUserType && availableAbilities.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {availableAbilities.map((ability) => (
                              <span
                                key={ability}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-brand-500/20 text-brand-300 border border-brand-500/30 rounded-md"
                                title={getAbilityDisplay(ability)}
                              >
                                <span>{getAbilityIcon(ability)}</span>
                                <span>{ability}</span>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">Base user type</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {group.addCases === 1 && (
                            <span className="px-2 py-1 text-xs bg-green-500/20 text-green-300 border border-green-500/30 rounded">
                              Add
                            </span>
                          )}
                          {group.editCases === 1 && (
                            <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded">
                              Edit
                            </span>
                          )}
                          {group.deleteCases === 1 && (
                            <span className="px-2 py-1 text-xs bg-red-500/20 text-red-300 border border-red-500/30 rounded">
                              Delete
                            </span>
                          )}
                          {group.viewOthers === 1 && (
                            <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded">
                              View All
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-3">
                          <Link
                            href={`/groups/${group.id}/edit` as any}
                            className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(group.id)}
                            className="text-red-400 hover:text-red-300 font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Add Group Modal (placeholder) */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-white mb-4">Add New Group</h2>
              <p className="text-gray-400 mb-4">
                Group creation form will be implemented in the forms phase.
              </p>
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Edit Group Modal (placeholder) */}
        {editingGroup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-white mb-4">
                Edit Group: {editingGroup.displayName}
              </h2>
              <p className="text-gray-400 mb-4">
                Group edit form will be implemented in the forms phase.
              </p>
              <button
                onClick={() => setEditingGroup(null)}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
