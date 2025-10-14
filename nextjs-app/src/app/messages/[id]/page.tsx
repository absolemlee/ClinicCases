'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Message {
  id: number;
  assocCase: number | null;
  to: string | null;
  from: string | null;
  subject: string | null;
  body: string | null;
  timeSent: string | null;
  case?: {
    caseNumber: string;
    firstName: string;
    lastName: string;
  };
}

export default function MessageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchMessage();
    }
  }, [params.id]);

  const fetchMessage = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/messages/${params.id}`);
      const data = await res.json();
      
      if (data.success) {
        setMessage(data.data);
      } else {
        setError(data.error || 'Failed to load message');
      }
    } catch (err) {
      console.error('Error fetching message:', err);
      setError('Failed to load message');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const res = await fetch(`/api/messages/${params.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        router.push('/messages');
      } else {
        alert('Failed to delete message');
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('Failed to delete message');
    }
  };

  const handleArchive = async () => {
    try {
      const res = await fetch(`/api/messages/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: true }),
      });
      const data = await res.json();

      if (data.success) {
        router.push('/messages');
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
        <div className="text-center text-gray-400">Loading message...</div>
      </div>
    );
  }

  if (error || !message) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="text-center text-red-400">Error: {error || 'Message not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/messages" className="text-blue-400 hover:text-blue-300">
            ← Back to Messages
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          {/* Message Header */}
          <div className="border-b border-gray-700 pb-4 mb-4">
            <h1 className="text-2xl font-bold text-white mb-4">{message.subject || '(No subject)'}</h1>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">From:</span>
                <span className="ml-2 text-gray-200">{message.from || 'Unknown'}</span>
              </div>
              <div>
                <span className="text-gray-400">To:</span>
                <span className="ml-2 text-gray-200">{message.to || 'Unknown'}</span>
              </div>
              <div>
                <span className="text-gray-400">Date:</span>
                <span className="ml-2 text-gray-200">
                  {message.timeSent ? new Date(message.timeSent).toLocaleString() : '-'}
                </span>
              </div>
              {message.case && (
                <div>
                  <span className="text-gray-400">Case:</span>
                  <Link
                    href={`/cases/${message.assocCase}`}
                    className="ml-2 text-blue-400 hover:text-blue-300"
                  >
                    {message.case.caseNumber} - {message.case.firstName} {message.case.lastName}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Message Body */}
          <div className="prose prose-invert max-w-none mb-6">
            <div className="text-gray-200 whitespace-pre-wrap">
              {message.body || '(No content)'}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-4 border-t border-gray-700">
            <button
              onClick={() => router.push(`/messages/compose?reply=${message.id}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Reply
            </button>
            <button
              onClick={handleArchive}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              Archive
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
