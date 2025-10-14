'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AddEventModalProps {
  caseId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddEventModal({ caseId, isOpen, onClose, onSuccess }: AddEventModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    date: '',
    time: '',
    location: '',
    notes: '',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Combine date and time
      const eventDateTime = formData.time 
        ? new Date(`${formData.date}T${formData.time}`)
        : new Date(formData.date);

      const res = await fetch('/api/case-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId,
          description: formData.description,
          date: eventDateTime.toISOString(),
          location: formData.location,
          notes: formData.notes,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('Event added successfully!');
        setFormData({
          description: '',
          date: '',
          time: '',
          location: '',
          notes: '',
        });
        onSuccess?.();
        onClose();
        router.refresh();
      } else {
        alert(`Failed to add event: ${data.error}`);
      }
    } catch (err) {
      console.error('Error adding event:', err);
      alert('Failed to add event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-4">Add Event</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Event Description <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="e.g., Court Hearing, Client Meeting, Deadline"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Courthouse, Office, Virtual"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional event details..."
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
              {loading ? 'Adding...' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
