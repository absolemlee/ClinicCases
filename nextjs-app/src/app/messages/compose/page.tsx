'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: number;
  username: string;
  firstName: string | null;
  lastName: string | null;
}

interface Case {
  id: number;
  caseNumber: string | null;
  firstName: string | null;
  lastName: string | null;
}

function ComposeMessageForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    to: '',
    cc: '',
    subject: '',
    body: '',
    caseId: '',
  });

  useEffect(() => {
    fetchUsers();
    fetchCases();
    
    // Pre-fill from query params if present
    const caseId = searchParams.get('caseId');
    const replyTo = searchParams.get('replyTo');
    const subject = searchParams.get('subject');
    
    if (caseId) {
      setFormData(prev => ({ ...prev, caseId }));
    }
    if (replyTo) {
      setFormData(prev => ({ ...prev, to: replyTo }));
    }
    if (subject) {
      setFormData(prev => ({ 
        ...prev, 
        subject: subject.startsWith('Re:') ? subject : `Re: ${subject}` 
      }));
    }
  }, [searchParams]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchCases = async () => {
    try {
      const res = await fetch('/api/cases');
      const data = await res.json();
      if (data.success) {
        setCases(data.data.slice(0, 50)); // Limit to 50 recent cases
      }
    } catch (err) {
      console.error('Error fetching cases:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.to) {
      setError('Recipient is required');
      return;
    }

    if (!formData.subject) {
      setError('Subject is required');
      return;
    }

    if (!formData.body) {
      setError('Message body is required');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: formData.to,
          cc: formData.cc || null,
          subject: formData.subject,
          body: formData.body,
          caseId: formData.caseId ? parseInt(formData.caseId) : null,
          from: 'current-user', // Should come from session
          timeSent: new Date(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/messages');
      } else {
        setError(data.error || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('An error occurred while sending the message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Compose Message</h1>
            <Link
              href="/messages"
              className="text-slate-400 hover:text-white transition-colors text-sm sm:text-base"
            >
              ← Back to Messages
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
            <p className="text-green-200 text-sm">{success}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-slate-800/40 border border-slate-700 rounded-lg shadow-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Recipient */}
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-slate-300 mb-2">
              To <span className="text-red-400">*</span>
            </label>
            <select
              id="to"
              name="to"
              required
              value={formData.to}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Select recipient</option>
              {users.map(user => (
                <option key={user.id} value={user.username}>
                  {user.firstName} {user.lastName} ({user.username})
                </option>
              ))}
            </select>
          </div>

          {/* CC */}
          <div>
            <label htmlFor="cc" className="block text-sm font-medium text-slate-300 mb-2">
              CC
            </label>
            <input
              type="text"
              id="cc"
              name="cc"
              value={formData.cc}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Comma-separated usernames (optional)"
            />
          </div>

          {/* Associated Case */}
          <div>
            <label htmlFor="caseId" className="block text-sm font-medium text-slate-300 mb-2">
              Associate with Case (Optional)
            </label>
            <select
              id="caseId"
              name="caseId"
              value={formData.caseId}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">No case association</option>
              {cases.map(c => (
                <option key={c.id} value={c.id}>
                  {c.caseNumber} - {c.firstName} {c.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
              Subject <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Enter message subject"
            />
          </div>

          {/* Message Body */}
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-slate-300 mb-2">
              Message <span className="text-red-400">*</span>
            </label>
            <textarea
              id="body"
              name="body"
              required
              value={formData.body}
              onChange={handleChange}
              rows={10}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y"
              placeholder="Enter your message..."
            />
            <p className="mt-1 text-xs text-slate-500">
              Tip: Use clear, professional language
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-3 sm:space-x-4 pt-4 border-t border-slate-700">
            <Link
              href="/messages"
              className="w-full sm:w-auto text-center px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Send Message</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ComposeMessagePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500 mb-4"></div>
              <p className="text-slate-400">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <ComposeMessageForm />
    </Suspense>
  );
}
