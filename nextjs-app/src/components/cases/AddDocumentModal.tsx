'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AddDocumentModalProps {
  caseId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddDocumentModal({ caseId, isOpen, onClose, onSuccess }: AddDocumentModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fileUrl: '',
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
      const res = await fetch('/api/case-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId,
          name: formData.name,
          description: formData.description,
          fileUrl: formData.fileUrl,
          uploadDate: new Date().toISOString(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('Document added successfully!');
        setFormData({
          name: '',
          description: '',
          fileUrl: '',
        });
        onSuccess?.();
        onClose();
        router.refresh();
      } else {
        alert(`Failed to add document: ${data.error}`);
      }
    } catch (err) {
      console.error('Error adding document:', err);
      alert('Failed to add document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-4">Add Document</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Document Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Client Intake Form, Court Filing"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the document..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              File Upload
            </label>
            <div className="mt-2 border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm text-gray-400">
                File upload functionality will be implemented with storage configuration
              </p>
              <p className="text-xs text-gray-500 mt-1">
                For now, you can provide a file URL below
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              File URL (temporary)
            </label>
            <input
              type="url"
              name="fileUrl"
              value={formData.fileUrl}
              onChange={handleChange}
              placeholder="https://example.com/document.pdf"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Optional: Provide a URL to an existing document
            </p>
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
              {loading ? 'Adding...' : 'Add Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
