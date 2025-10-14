'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AddNoteModalProps {
  caseId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddNoteModal({ caseId, isOpen, onClose, onSuccess }: AddNoteModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/case-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId,
          description: formData.description,
          datestamp: new Date().toISOString(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('Note added successfully!');
        setFormData({ description: '' });
        onSuccess?.();
        onClose();
        router.refresh();
      } else {
        alert(`Failed to add note: ${data.error}`);
      }
    } catch (err) {
      console.error('Error adding note:', err);
      alert('Failed to add note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-4">Add Case Note</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Note Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ description: e.target.value })}
              required
              rows={6}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter case note details..."
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
