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
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Messages</h1>
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
          <p className="mt-4 text-slate-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Messages</h1>
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-200">
          <p className="font-semibold">Error loading messages</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Messages</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your communications
          </p>
        </div>
        <Link
          href="/messages/compose"
          className="w-full sm:w-auto text-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
        >
          Compose New
        </Link>
      </div>

      {/* Folder Navigation */}
      <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFolder('inbox')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              folder === 'inbox'
                ? 'bg-brand-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Inbox
          </button>
          <button
            onClick={() => setFolder('sent')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              folder === 'sent'
                ? 'bg-brand-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Sent
          </button>
          <button
            onClick={() => setFolder('archived')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              folder === 'archived'
                ? 'bg-brand-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
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
  );
}
