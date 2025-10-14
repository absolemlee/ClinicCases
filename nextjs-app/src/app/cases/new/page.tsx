'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

export default function NewCasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [caseTypes, setCaseTypes] = useState<CaseType[]>([]);
  const [clinicTypes, setClinicTypes] = useState<ClinicType[]>([]);
  
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    ssn: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    caseTypeCode: '',
    clinicTypeCode: '',
    summary: '',
  });

  useEffect(() => {
    fetchCaseTypes();
    fetchClinicTypes();
  }, []);

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
    setLoading(true);

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
        alert('Case created successfully!');
        router.push(`/cases/${data.data.id}`);
      } else {
        alert(`Failed to create case: ${data.error}`);
      }
    } catch (err) {
      console.error('Error creating case:', err);
      alert('Failed to create case');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Create New Case</h1>
          <p className="text-gray-400 mt-2">Enter client information to open a new case</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
          {/* Client Information */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Client Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  SSN
                </label>
                <input
                  type="text"
                  name="ssn"
                  value={formData.ssn}
                  onChange={handleChange}
                  placeholder="XXX-XX-XXXX"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  maxLength={2}
                  placeholder="CA"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Case Details */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Case Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Case Type <span className="text-red-400">*</span>
                </label>
                <select
                  name="caseTypeCode"
                  value={formData.caseTypeCode}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Clinic Type <span className="text-red-400">*</span>
                </label>
                <select
                  name="clinicTypeCode"
                  value={formData.clinicTypeCode}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Case Summary
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief summary of the case..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Case'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
