'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="text-center text-gray-400">Loading groups...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="text-center text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Group Management</h1>
          <Link
            href="/groups/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add New Group
          </Link>
        </div>

        {/* Groups Table */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {groups.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No groups found
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Display Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Group Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {groups.map((group) => (
                  <tr key={group.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                      {group.displayName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {group.groupName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {group.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div className="flex flex-wrap gap-1">
                        {group.addCases === 1 && (
                          <span className="px-2 py-1 text-xs bg-green-900 text-green-200 rounded">
                            Add
                          </span>
                        )}
                        {group.editCases === 1 && (
                          <span className="px-2 py-1 text-xs bg-blue-900 text-blue-200 rounded">
                            Edit
                          </span>
                        )}
                        {group.deleteCases === 1 && (
                          <span className="px-2 py-1 text-xs bg-red-900 text-red-200 rounded">
                            Delete
                          </span>
                        )}
                        {group.viewOthers === 1 && (
                          <span className="px-2 py-1 text-xs bg-purple-900 text-purple-200 rounded">
                            View Others
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex space-x-2">
                        <Link
                          href={`/groups/${group.id}/edit` as any}
                          className="text-green-400 hover:text-green-300"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(group.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
    </div>
  );
}
