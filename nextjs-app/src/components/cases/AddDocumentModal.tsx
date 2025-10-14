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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    displayName: '',
    folder: 'case_documents',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // Auto-populate display name from filename if empty
      if (!formData.displayName) {
        setFormData((prev) => ({ ...prev, displayName: e.target.files![0].name }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }
    
    setLoading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);
      uploadFormData.append('caseId', caseId.toString());
      uploadFormData.append('displayName', formData.displayName || selectedFile.name);
      uploadFormData.append('folder', formData.folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await res.json();

      if (data.success) {
        alert('Document uploaded successfully!');
        setFormData({
          displayName: '',
          folder: 'case_documents',
        });
        setSelectedFile(null);
        onSuccess?.();
        onClose();
        router.refresh();
      } else {
        alert(`Failed to upload document: ${data.error}`);
      }
    } catch (err) {
      console.error('Error uploading document:', err);
      alert('Failed to upload document');
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
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              required
              placeholder="e.g., Client Intake Form, Court Filing"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Folder Category
            </label>
            <select
              name="folder"
              value={formData.folder}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="case_documents">Case Documents</option>
              <option value="correspondence">Correspondence</option>
              <option value="court_filings">Court Filings</option>
              <option value="evidence">Evidence</option>
              <option value="general">General</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              File Upload <span className="text-red-400">*</span>
            </label>
            <div className="mt-2 border-2 border-dashed border-gray-600 rounded-lg p-6">
              <div className="text-center">
                {selectedFile ? (
                  <div className="space-y-2">
                    <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-gray-300 font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-400">
                      Click to select a file or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, DOCX, XLS, XLSX, JPG, PNG up to 10MB
                    </p>
                  </div>
                )}
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                className="hidden"
                id="file-upload"
              />
              {!selectedFile && (
                <label
                  htmlFor="file-upload"
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
                >
                  Choose File
                </label>
              )}
            </div>
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
