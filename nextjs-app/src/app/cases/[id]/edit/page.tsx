'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface CaseType {
  id: number;
  code: string;
  name: string;
}

interface ClinicType {
  id: number;
  code: string;
  name: string;
}

interface CaseData {
  id: number;
  caseNumber: string | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  caseType: string | null;
  clinicType: string | null;
  dateOpen: string | null;
  dateClose: string | null;
  timeOpened: string | null;
  timeClosed: string | null;
  openedBy: string | null;
  closedBy: string | null;
  assignedUsers: string | null;
  adverseParties: string | null;
  open: number;
  deleted: number;
}

export default function EditCasePage() {
  const router = useRouter();
  const params = useParams();
  const caseId = params.id as string;

  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [caseTypes, setCaseTypes] = useState<CaseType[]>([]);
  const [clinicTypes, setClinicTypes] = useState<ClinicType[]>([]);
  
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    caseType: '',
    clinicType: '',
  });

  useEffect(() => {
    fetchCase();
    fetchCaseTypes();
    fetchClinicTypes();
  }, [caseId]);

  const fetchCase = async () => {
    try {
      const res = await fetch(`/api/cases/${caseId}`);
      const data = await res.json();

      if (data.success) {
        const caseData: CaseData = data.data;
        
        // Pre-populate form with existing data
        setFormData({
          firstName: caseData.firstName || '',
          middleName: caseData.middleName || '',
          lastName: caseData.lastName || '',
          caseType: caseData.caseType || '',
          clinicType: caseData.clinicType || '',
        });
      } else {
        setError('Case not found');
      }
    } catch (err) {
      console.error('Error fetching case:', err);
      setError('Failed to load case');
    } finally {
      setFetching(false);
    }
  };

  const fetchCaseTypes = async () => {
    try {
      const res = await fetch('/api/case-types');
      const data = await res.json();
      if (data.success) {
        setCaseTypes(data.data);
      }
    } catch (err) {
      console.error('Error fetching case types:', err);
    }
  };

  const fetchClinicTypes = async () => {
    try {
      const res = await fetch('/api/clinic-types');
      const data = await res.json();
      if (data.success) {
        setClinicTypes(data.data);
      }
    } catch (err) {
      console.error('Error fetching clinic types:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.caseType || !formData.clinicType) {
      setError('Please fill in all required fields');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/cases/${caseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/cases/${caseId}`);
      } else {
        setError(data.error || 'Failed to update case');
      }
    } catch (err) {
      console.error('Error updating case:', err);
      setError('An error occurred while updating the case');
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-900 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500 mb-4"></div>
              <p className="text-slate-400">Loading case...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Edit Case</h1>
              <p className="text-slate-400 mt-2">Update client information and case details</p>
            </div>
            <Link
              href={`/cases/${caseId}`}
              className="text-brand-400 hover:text-brand-300 transition-colors text-sm sm:text-base"
            >
              ← Back to Case
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg shadow-lg p-4 sm:p-8">
          {/* Client Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 pb-3 border-b border-slate-700">
              Client Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="mt-4 sm:mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
              <p className="text-sm text-slate-400">
                <strong className="text-slate-300">Note:</strong> Additional client information (contact details, address, DOB, SSN) is managed through the case contacts feature. Use the main case detail page to add or edit contact information for this client.
              </p>
            </div>
          </div>

          {/* Case Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 pb-3 border-b border-slate-700">
              Case Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Case Type <span className="text-red-400">*</span>
                </label>
                <select
                  name="caseType"
                  value={formData.caseType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                >
                  <option value="">Select a case type...</option>
                  {caseTypes.map((type) => (
                    <option key={type.id} value={type.code}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Clinic Type <span className="text-red-400">*</span>
                </label>
                <select
                  name="clinicType"
                  value={formData.clinicType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                >
                  <option value="">Select a clinic type...</option>
                  {clinicTypes.map((type) => (
                    <option key={type.id} value={type.code}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-slate-700">
            <Link
              href={`/cases/${caseId}`}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-center font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>✓</span>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
