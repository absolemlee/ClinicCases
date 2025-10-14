'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getUserType, 
  getUserAbilities, 
  getUserTypeDisplay,
  getAbilityDisplay,
  getAbilityIcon,
  type UserType,
  type Ability
} from '@/lib/permissions-client';

interface User {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  username: string;
  grp: string | null;
  status: string | null;
  mobilePhone: string | null;
  officePhone: string | null;
  dateCreated: string | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter((u) => u.status === statusFilter));
    }
  }, [statusFilter, users]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();

      if (data.success) {
        setUsers(data.data);
        setFilteredUsers(data.data);
      } else {
        setError(data.error || 'Failed to load users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        setUsers(users.filter((u) => u.id !== id));
      } else {
        alert('Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user');
    }
  };

  const handleStatusToggle = async (id: number, currentStatus: string | null) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        setUsers(
          users.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
        );
      } else {
        alert('Failed to update user status');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Failed to update user status');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">User Management</h1>
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
          <p className="mt-4 text-slate-400">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">User Management</h1>
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-200">
          <p className="font-semibold">Error loading users</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">User Management</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage user accounts and permissions
          </p>
        </div>
        <Link
          href="/users/new"
          className="w-full sm:w-auto text-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
        >
          Add New User
        </Link>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === 'all'
              ? 'bg-brand-500 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          All Users ({users.length})
        </button>
        <button
          onClick={() => setStatusFilter('active')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === 'active'
              ? 'bg-brand-500 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Active ({users.filter((u) => u.status === 'active').length})
        </button>
        <button
          onClick={() => setStatusFilter('inactive')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === 'inactive'
              ? 'bg-brand-500 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Inactive ({users.filter((u) => u.status === 'inactive').length})
        </button>
      </div>

      {/* Users Table */}
        <div className="bg-slate-800/40 rounded-lg border border-slate-700 shadow-lg overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No users found
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    User Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    User Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Functional Abilities
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-800/20 divide-y divide-slate-700">
                {filteredUsers.map((user) => {
                  const userType = getUserType({ grp: user.grp });
                  const abilities = getUserAbilities({ grp: user.grp });
                  
                  return (
                    <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            @{user.username}
                          </div>
                          {user.email && (
                            <div className="text-xs text-slate-500 mt-0.5">
                              {user.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {userType ? (
                          <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-brand-500/20 border border-brand-500/30">
                            <span className="text-sm font-medium text-brand-300">
                              {getUserTypeDisplay(userType)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">No type assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {abilities.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {abilities.map((ability) => (
                              <span
                                key={ability}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded"
                                title={getAbilityDisplay(ability)}
                              >
                                <span>{getAbilityIcon(ability)}</span>
                                <span>{ability}</span>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">Base permissions only</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-md ${
                            user.status === 'active'
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleStatusToggle(user.id, user.status)}
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                          >
                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <Link
                            href={`/users/${user.id}/edit` as any}
                            className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(user.id)}
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

        {/* Add User Modal (placeholder) */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-white mb-4">Add New User</h2>
              <p className="text-gray-400 mb-4">
                User creation form will be implemented in the forms phase.
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
    </div>
  );
}
