'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Group {
  id: number;
  groupName: string;
}

interface User {
  id: number;
  username: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  mobilePhone: string | null;
  officePhone: string | null;
  homePhone: string | null;
  grp: string | null;
  status: string | null;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobilePhone: '',
    officePhone: '',
    homePhone: '',
    grp: '',
    status: 'active' as 'active' | 'inactive',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchGroups();
    fetchUser();
  }, [userId]);

  const fetchGroups = async () => {
    try {
      const res = await fetch('/api/groups');
      const data = await res.json();
      if (data.success) {
        setGroups(data.data);
      }
    } catch (err) {
      console.error('Error fetching groups:', err);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();
      
      if (data.success) {
        const user: User = data.data;
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          mobilePhone: user.mobilePhone || '',
          officePhone: user.officePhone || '',
          homePhone: user.homePhone || '',
          grp: user.grp || '',
          status: (user.status as 'active' | 'inactive') || 'active',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setError('User not found');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation for password change
    if (formData.newPassword || formData.confirmPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.newPassword.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    if (!formData.firstName || !formData.lastName) {
      setError('First name and last name are required');
      return;
    }

    setSaving(true);

    try {
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email || null,
        mobilePhone: formData.mobilePhone || null,
        officePhone: formData.officePhone || null,
        homePhone: formData.homePhone || null,
        grp: formData.grp || null,
        status: formData.status,
      };

      // Only include password if user entered a new one
      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }

      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/users');
      } else {
        setError(data.error || 'Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      setError('An error occurred while updating the user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="text-center text-gray-400">Loading user...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Edit User</h1>
            <Link
              href="/users"
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Users
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
          {/* Account Status */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Account Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label htmlFor="grp" className="block text-sm font-medium text-gray-300 mb-2">
                  Group
                </label>
                <select
                  id="grp"
                  name="grp"
                  value={formData.grp}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a group</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.groupName}>
                      {group.groupName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter last name"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="user@example.com"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="mobilePhone" className="block text-sm font-medium text-gray-300 mb-2">
                  Mobile Phone
                </label>
                <input
                  type="tel"
                  id="mobilePhone"
                  name="mobilePhone"
                  value={formData.mobilePhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(555) 555-5555"
                />
              </div>

              <div>
                <label htmlFor="officePhone" className="block text-sm font-medium text-gray-300 mb-2">
                  Office Phone
                </label>
                <input
                  type="tel"
                  id="officePhone"
                  name="officePhone"
                  value={formData.officePhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(555) 555-5555"
                />
              </div>

              <div>
                <label htmlFor="homePhone" className="block text-sm font-medium text-gray-300 mb-2">
                  Home Phone
                </label>
                <input
                  type="tel"
                  id="homePhone"
                  name="homePhone"
                  value={formData.homePhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(555) 555-5555"
                />
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Change Password</h2>
            <p className="text-sm text-gray-400 mb-4">Leave blank to keep current password</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-700">
            <Link
              href="/users"
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
