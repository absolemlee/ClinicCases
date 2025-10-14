'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface AddDocumentModalProps {
  caseId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/rtf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed'
];

export function AddDocumentModal({ caseId, isOpen, onClose, onSuccess }: AddDocumentModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');

  if (!isOpen) return null;

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`;
    }
    if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt|rtf|jpg|jpeg|png|gif|bmp|xls|xlsx|csv|zip|rar|7z)$/i)) {
      return `File type not allowed. Allowed: PDF, DOC, DOCX, TXT, RTF, JPG, PNG, GIF, BMP, XLS, XLSX, CSV, ZIP, RAR, 7Z`;
    }
    return null;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setSelectedFile(file);
      if (!displayName) {
        setDisplayName(file.name);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setSelectedFile(file);
      // Auto-populate display name from filename if empty
      if (!displayName) {
        setDisplayName(file.name);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }
    
    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);
      uploadFormData.append('displayName', displayName || selectedFile.name);

      const res = await fetch(`/api/cases/${caseId}/documents`, {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await res.json();

      if (data.success) {
        setUploadProgress(100);
        // Reset form
        setDisplayName('');
        setSelectedFile(null);
        onSuccess?.();
        onClose();
        router.refresh();
      } else {
        setError(data.error || 'Failed to upload document');
      }
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Add Document</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Document Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              placeholder="e.g., Client Intake Form, Court Filing"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              File Upload <span className="text-red-400">*</span>
            </label>
            <div 
              className={`mt-2 border-2 border-dashed rounded-lg p-6 transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center">
                {selectedFile ? (
                  <div className="space-y-2">
                    <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-gray-300 font-medium break-all px-2">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {selectedFile.size < 1024 * 1024 
                        ? `${(selectedFile.size / 1024).toFixed(2)} KB`
                        : `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                      }
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setError(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-sm text-red-400 hover:text-red-300 font-medium"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div>
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-300 font-medium">
                      {dragActive ? 'Drop file here' : 'Drag and drop a file here, or click to select'}
                    </p>
                    <p className="text-xs text-gray-500 mt-2 px-4">
                      Allowed: PDF, DOC, DOCX, TXT, RTF, JPG, PNG, GIF, BMP, XLS, XLSX, CSV, ZIP, RAR, 7Z
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum file size: 10MB
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.rtf,.jpg,.jpeg,.png,.gif,.bmp,.xls,.xlsx,.csv,.zip,.rar,.7z"
                className="hidden"
                id="file-upload"
              />
              {!selectedFile && (
                <div className="mt-4 text-center">
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors font-medium"
                  >
                    Choose File
                  </label>
                </div>
              )}
            </div>
          </div>

          {loading && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={() => {
                onClose();
                setError(null);
                setSelectedFile(null);
                setDisplayName('');
              }}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedFile}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
