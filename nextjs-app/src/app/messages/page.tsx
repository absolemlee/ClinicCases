'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  id: number;
  assocCase: number | null;
  to: string | null;
  from: string | null;
  subject: string | null;
  body: string | null;
  timeSent: string | null;
  archived: number | null;
  case?: {
    caseNumber: string;
    firstName: string;
    lastName: string;
  };
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [folder, setFolder] = useState<'inbox' | 'sent' | 'archived'>('inbox');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, [folder]);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/messages?folder=${folder}`);
      const data = await res.json();
      
      if (data.success) {
        setMessages(data.data);
      } else {
        setError(data.error || 'Failed to load messages');
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        setMessages(messages.filter((m) => m.id !== id));
      } else {
        alert('Failed to delete message');
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('Failed to delete message');
    }
  };

  const handleArchive = async (id: number) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: true }),
      });
      const data = await res.json();

      if (data.success) {
        setMessages(messages.filter((m) => m.id !== id));
      } else {
        alert('Failed to archive message');
      }
    } catch (err) {
      console.error('Error archiving message:', err);
      alert('Failed to archive message');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="text-center text-gray-400">Loading messages...</div>
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
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <Link
            href="/messages/compose"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Compose New
          </Link>
        </div>

        {/* Folder Navigation */}
        <div className="mb-6 flex space-x-2">
          <button
            onClick={() => setFolder('inbox')}
            className={`px-4 py-2 rounded ${
              folder === 'inbox'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Inbox
          </button>
          <button
            onClick={() => setFolder('sent')}
            className={`px-4 py-2 rounded ${
              folder === 'sent'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Sent
          </button>
          <button
            onClick={() => setFolder('archived')}
            className={`px-4 py-2 rounded ${
              folder === 'archived'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Archived
          </button>
        </div>

        {/* Messages List */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No messages in {folder}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {folder === 'sent' ? 'To' : 'From'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Case
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {messages.map((message) => (
                  <tr key={message.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {folder === 'sent' ? message.to : message.from}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <Link
                        href={`/messages/${message.id}`}
                        className="hover:text-blue-400"
                      >
                        {message.subject || '(No subject)'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {message.case && (
                        <Link
                          href={`/cases/${message.assocCase}`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {message.case.caseNumber}
                        </Link>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {message.timeSent ? new Date(message.timeSent).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex space-x-2">
                        {folder !== 'archived' && (
                          <button
                            onClick={() => handleArchive(message.id)}
                            className="text-yellow-400 hover:text-yellow-300"
                          >
                            Archive
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(message.id)}
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
      </div>
    </div>
  );
}
