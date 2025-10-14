'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="text-center text-gray-400">Loading users...</div>
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
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add New User
          </button>
        </div>

        {/* Status Filter */}
        <div className="mb-6 flex space-x-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-4 py-2 rounded ${
              statusFilter === 'active'
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Active ({users.filter((u) => u.status === 'active').length})
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            className={`px-4 py-2 rounded ${
              statusFilter === 'inactive'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Inactive ({users.filter((u) => u.status === 'inactive').length})
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No users found
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.grp || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          user.status === 'active'
                            ? 'bg-green-900 text-green-200'
                            : 'bg-yellow-900 text-yellow-200'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusToggle(user.id, user.status)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <Link
                          href={`/users/${user.id}/edit` as any}
                          className="text-green-400 hover:text-green-300"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(user.id)}
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
    </div>
  );
}
