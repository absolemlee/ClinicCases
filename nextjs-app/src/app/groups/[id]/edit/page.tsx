'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Group {
  id: number;
  groupName: string;
  addCases: number;
  editCases: number;
  deleteCases: number;
  viewOthersCases: number;
}

export default function EditGroupPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    groupName: '',
    addCases: false,
    editCases: false,
    deleteCases: false,
    viewOthersCases: false,
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
          addCases: group.addCases === 1,
          editCases: group.editCases === 1,
          deleteCases: group.deleteCases === 1,
          viewOthersCases: group.viewOthersCases === 1,
        });
      } else {
        setError('Group not found');
      }
    } catch (err) {
      console.error('Error fetching group:', err);
      setError('Failed to load group');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.groupName) {
      setError('Group name is required');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/groups/${groupId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupName: formData.groupName,
          addCases: formData.addCases ? 1 : 0,
          editCases: formData.editCases ? 1 : 0,
          deleteCases: formData.deleteCases ? 1 : 0,
          viewOthersCases: formData.viewOthersCases ? 1 : 0,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="text-center text-gray-400">Loading group...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Edit Group</h1>
            <Link
              href="/groups"
              className="text-gray-400 hover:text-white transition-colors"
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
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
          {/* Group Name */}
          <div>
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-300 mb-2">
              Group Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="groupName"
              name="groupName"
              required
              value={formData.groupName}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter group name"
            />
          </div>

          {/* Permissions */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Permissions</h2>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="addCases"
                  checked={formData.addCases}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div>
                  <span className="text-white font-medium">Add Cases</span>
                  <p className="text-sm text-gray-400">Allow members to create new cases</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="editCases"
                  checked={formData.editCases}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div>
                  <span className="text-white font-medium">Edit Cases</span>
                  <p className="text-sm text-gray-400">Allow members to modify case details</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="deleteCases"
                  checked={formData.deleteCases}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div>
                  <span className="text-white font-medium">Delete Cases</span>
                  <p className="text-sm text-gray-400">Allow members to delete cases</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="viewOthersCases"
                  checked={formData.viewOthersCases}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div>
                  <span className="text-white font-medium">View Others' Cases</span>
                  <p className="text-sm text-gray-400">Allow members to see cases not assigned to them</p>
                </div>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-700">
            <Link
              href="/groups"
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
