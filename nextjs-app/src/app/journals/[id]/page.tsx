'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Journal {
  id: number;
  username: string;
  reader: string | null;
  text: string | null;
  dateAdded: string | null;
  archived: string | null;
  read: string | null;
  commented: string | null;
  comments: string | null;
}

interface Comment {
  username: string;
  text: string;
  date: string;
}

export default function JournalDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const journalId = parseInt(params.id);
  const [journal, setJournal] = useState<Journal | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchJournal();
  }, [journalId]);

  const fetchJournal = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/journals/${journalId}`);
      if (!response.ok) throw new Error('Failed to fetch journal');
      
      const data = await response.json();
      setJournal(data.data);

      // Parse comments
      if (data.data.comments) {
        try {
          setComments(JSON.parse(data.data.comments));
        } catch (e) {
          setComments([]);
        }
      }

      // Mark as read
      await fetch(`/api/journals/${journalId}/mark-read`, {
        method: 'POST',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await fetch(`/api/journals/${journalId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: commentText }),
      });

      if (response.ok) {
        setCommentText('');
        await fetchJournal(); // Refresh to get new comment
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      alert('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleArchive = async () => {
    if (!confirm('Archive this journal?')) return;

    try {
      const response = await fetch(`/api/journals/${journalId}/archive`, {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/journals');
      } else {
        throw new Error('Failed to archive journal');
      }
    } catch (error) {
      alert('Failed to archive journal');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this journal permanently?')) return;

    try {
      const response = await fetch(`/api/journals/${journalId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/journals');
      } else {
        throw new Error('Failed to delete journal');
      }
    } catch (error) {
      alert('Failed to delete journal');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !journal) {
    return (
      <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-6 text-red-200">
        <p className="font-semibold">Error loading journal</p>
        <p className="mt-1 text-sm">{error || 'Journal not found'}</p>
        <Link
          href="/journals"
          className="mt-4 inline-block text-sm underline hover:no-underline"
        >
          ← Back to Journals
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Journal Entry</h1>
          <p className="mt-1 text-sm text-slate-400">
            By {journal.username} •{' '}
            {journal.dateAdded
              ? formatDistanceToNow(new Date(journal.dateAdded), { addSuffix: true })
              : 'Unknown date'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleArchive}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Archive
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Journal Content */}
      <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-6">
        <div className="prose prose-invert max-w-none">
          <div className="text-slate-200 whitespace-pre-wrap">{journal.text || 'No content'}</div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-6 space-y-6">
        <h2 className="text-xl font-semibold text-white">Comments</h2>

        {/* Existing Comments */}
        {comments.length > 0 && (
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <div key={index} className="border-l-2 border-brand-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{comment.username}</span>
                  <span className="text-xs text-slate-400">
                    {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-slate-300 whitespace-pre-wrap">{comment.text}</p>
              </div>
            ))}
          </div>
        )}

        {comments.length === 0 && (
          <p className="text-sm text-slate-400">No comments yet. Be the first to comment!</p>
        )}

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="space-y-3">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            placeholder="Add a comment..."
          />
          <div className="flex items-center justify-between">
            <Link
              href="/journals"
              className="text-sm text-slate-400 hover:text-white"
            >
              ← Back to Journals
            </Link>
            <button
              type="submit"
              disabled={submittingComment || !commentText.trim()}
              className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submittingComment ? 'Adding...' : 'Add Comment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
