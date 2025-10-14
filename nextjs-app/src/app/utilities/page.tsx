'use client';

import { useState, useEffect } from 'react';
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

export default function UtilitiesPage() {
  const [caseTypes, setCaseTypes] = useState<CaseType[]>([]);
  const [clinicTypes, setClinicTypes] = useState<ClinicType[]>([]);
  const [activeTab, setActiveTab] = useState<'case-types' | 'clinic-types' | 'case-columns' | 'system'>('case-types');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'case-types') {
      fetchCaseTypes();
    } else if (activeTab === 'clinic-types') {
      fetchClinicTypes();
    }
  }, [activeTab]);

  const fetchCaseTypes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/case-types');
      const data = await res.json();
      if (data.success) {
        setCaseTypes(data.data);
      }
    } catch (err) {
      console.error('Error fetching case types:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClinicTypes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/clinic-types');
      const data = await res.json();
      if (data.success) {
        setClinicTypes(data.data);
      }
    } catch (err) {
      console.error('Error fetching clinic types:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">System Utilities</h1>
          <p className="text-gray-400 mt-2">Manage system configuration and reference data</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('case-types')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'case-types'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Case Types
            </button>
            <button
              onClick={() => setActiveTab('clinic-types')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'clinic-types'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Clinic Types
            </button>
            <button
              onClick={() => setActiveTab('case-columns')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'case-columns'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Case Columns
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'system'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              System Settings
            </button>
          </nav>
        </div>

        {/* Case Types Tab */}
        {activeTab === 'case-types' && (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Case Types</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Add Case Type
              </button>
            </div>
            {loading ? (
              <div className="text-center text-gray-400 py-8">Loading...</div>
            ) : caseTypes.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                No case types found. Add your first case type to get started.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {caseTypes.map((type) => (
                    <tr key={type.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 text-sm text-gray-300">{type.code}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{type.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        <button className="text-blue-400 hover:text-blue-300 mr-3">Edit</button>
                        <button className="text-red-400 hover:text-red-300">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Clinic Types Tab */}
        {activeTab === 'clinic-types' && (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Clinic Types</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Add Clinic Type
              </button>
            </div>
            {loading ? (
              <div className="text-center text-gray-400 py-8">Loading...</div>
            ) : clinicTypes.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                No clinic types found. Add your first clinic type to get started.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {clinicTypes.map((type) => (
                    <tr key={type.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 text-sm text-gray-300">{type.code}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{type.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        <button className="text-blue-400 hover:text-blue-300 mr-3">Edit</button>
                        <button className="text-red-400 hover:text-red-300">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Case Columns Tab */}
        {activeTab === 'case-columns' && (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Case Form Columns</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Configure dynamic form fields for case creation
                </p>
              </div>
              <div className="space-x-2">
                <Link
                  href="/cases/new-dynamic"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-block"
                >
                  Preview Dynamic Form
                </Link>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Add Column
                </button>
              </div>
            </div>
            <div className="text-center text-gray-400 py-8">
              <p className="mb-4">Dynamic case column management available in this interface.</p>
              <p className="text-sm">
                The <code className="bg-gray-900 px-2 py-1 rounded">cm_columns</code> table controls which
                fields appear in the case form.
              </p>
              <p className="text-sm mt-2">
                Use the "Preview Dynamic Form" button to see the dynamically generated form.
              </p>
            </div>
          </div>
        )}

        {/* System Settings Tab */}
        {activeTab === 'system' && (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">System Settings</h2>
            <div className="space-y-6">
              <div className="border-b border-gray-700 pb-6">
                <h3 className="text-lg font-medium text-gray-200 mb-2">Database</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Current database: <code className="bg-gray-900 px-2 py-1 rounded">SQLite (dev.db)</code>
                </p>
                <Link
                  href={"/utilities/database" as any}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Manage database →
                </Link>
              </div>

              <div className="border-b border-gray-700 pb-6">
                <h3 className="text-lg font-medium text-gray-200 mb-2">Reports</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Export case data, generate statistics, and download reports.
                </p>
                <button className="text-blue-400 hover:text-blue-300 text-sm">
                  View reports →
                </button>
              </div>

              <div className="border-b border-gray-700 pb-6">
                <h3 className="text-lg font-medium text-gray-200 mb-2">Email Configuration</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Configure SMTP settings for outgoing notifications and messages.
                </p>
                <button className="text-blue-400 hover:text-blue-300 text-sm">
                  Configure email →
                </button>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-200 mb-2">Backup & Maintenance</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Schedule backups, perform maintenance tasks, and monitor system health.
                </p>
                <button className="text-blue-400 hover:text-blue-300 text-sm">
                  System maintenance →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
