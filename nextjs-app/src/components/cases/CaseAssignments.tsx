'use client';

import { useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  firstName: string | null;
  lastName: string | null;
}

interface CaseAssignee {
  id: number;
  username: string;
  status: string;
  timeAssigned: Date | null;
}

interface Props {
  caseId: number;
  initialAssignees: CaseAssignee[];
}

export function CaseAssignments({ caseId, initialAssignees }: Props) {
  const [assignees, setAssignees] = useState<CaseAssignee[]>(initialAssignees);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users?status=active');
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleAssignUser = async () => {
    if (!selectedUser) return;

    // Check if user already assigned
    if (assignees.some(a => a.username === selectedUser)) {
      alert('User is already assigned to this case');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/cases/${caseId}/assignees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: selectedUser,
          status: 'active',
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Add to local state
        setAssignees([...assignees, {
          id: data.data.id,
          username: selectedUser,
          status: 'active',
          timeAssigned: new Date(),
        }]);
        setSelectedUser('');
      } else {
        alert('Failed to assign user');
      }
    } catch (err) {
      console.error('Error assigning user:', err);
      alert('Failed to assign user');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (username: string) => {
    if (!confirm(`Remove ${username} from this case?`)) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/cases/${caseId}/assignees/${username}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        setAssignees(assignees.filter(a => a.username !== username));
      } else {
        alert('Failed to remove user');
      }
    } catch (err) {
      console.error('Error removing user:', err);
      alert('Failed to remove user');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (username: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    setLoading(true);

    try {
      const res = await fetch(`/api/cases/${caseId}/assignees/${username}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (data.success) {
        setAssignees(assignees.map(a => 
          a.username === username ? { ...a, status: newStatus } : a
        ));
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Assignment */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Assign User to Case</h3>
        <div className="flex space-x-2">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="">Select a user...</option>
            {users.map(user => (
              <option key={user.id} value={user.username}>
                {user.firstName} {user.lastName} ({user.username})
              </option>
            ))}
          </select>
          <button
            onClick={handleAssignUser}
            disabled={!selectedUser || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Assigning...' : 'Assign'}
          </button>
        </div>
      </div>

      {/* Current Assignments */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Assigned Users</h3>
        {assignees.length === 0 ? (
          <p className="text-gray-400 text-sm">No users assigned to this case yet.</p>
        ) : (
          <div className="space-y-2">
            {assignees.map((assignee) => (
              <div
                key={assignee.id}
                className="flex items-center justify-between p-3 bg-gray-700 rounded"
              >
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="text-white font-medium">{assignee.username}</p>
                    {assignee.timeAssigned && (
                      <p className="text-xs text-gray-400">
                        Assigned: {new Date(assignee.timeAssigned).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      assignee.status === 'active'
                        ? 'bg-green-900 text-green-200'
                        : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {assignee.status}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleStatus(assignee.username, assignee.status)}
                    disabled={loading}
                    className="text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50"
                  >
                    {assignee.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleRemoveUser(assignee.username)}
                    disabled={loading}
                    className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
