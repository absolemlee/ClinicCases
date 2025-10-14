'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DynamicFormField } from '@/components/forms/DynamicFormField';

interface CaseColumn {
  id: number;
  dbName: string;
  displayName: string;
  inputType: string;
  selectOptions: string | null;
  required: number;
  displayOrder: number;
  includeInCaseTable: number;
  displayByDefault: number;
}

export default function DynamicNewCasePage() {
  const router = useRouter();
  const [columns, setColumns] = useState<CaseColumn[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchColumns();
  }, []);

  const fetchColumns = async () => {
    try {
      const res = await fetch('/api/case-columns');
      const data = await res.json();
      if (data.success) {
        setColumns(data.data);
        // Initialize form data with empty values
        const initialData: Record<string, any> = {};
        data.data.forEach((col: CaseColumn) => {
          initialData[col.dbName] = '';
        });
        setFormData(initialData);
      } else {
        setError('Failed to load form configuration');
      }
    } catch (err) {
      console.error('Error fetching columns:', err);
      setError('Failed to load form configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Validate required fields
    const missingFields = columns
      .filter((col) => col.required === 1 && !formData[col.dbName])
      .map((col) => col.displayName);

    if (missingFields.length > 0) {
      setError(`Please fill in required fields: ${missingFields.join(', ')}`);
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          timeOpened: new Date().toISOString(),
          open: 1,
          deleted: 0,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/cases/${data.data.id}`);
      } else {
        setError(data.error || 'Failed to create case');
      }
    } catch (err) {
      console.error('Error creating case:', err);
      setError('An error occurred while creating the case');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-gray-400">Loading form...</div>
        </div>
      </div>
    );
  }

  if (error && columns.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
            <p className="text-red-200">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Create New Case (Dynamic Form)</h1>
            <p className="text-gray-400 mt-2">Form fields generated from database configuration</p>
          </div>
          <Link href="/cases" className="text-gray-400 hover:text-white">
            ← Back to Cases
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {columns.map((column) => (
              <div
                key={column.id}
                className={column.inputType === 'textarea' ? 'md:col-span-2' : ''}
              >
                <DynamicFormField
                  column={column}
                  value={formData[column.dbName]}
                  onChange={handleFieldChange}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-700">
            <Link
              href="/cases"
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating Case...' : 'Create Case'}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">
            <strong className="text-gray-300">Note:</strong> This form is dynamically generated from the{' '}
            <code className="text-blue-400">cm_columns</code> table. Admins can customize fields via the
            Utilities page.
          </p>
        </div>
      </div>
    </div>
  );
}
