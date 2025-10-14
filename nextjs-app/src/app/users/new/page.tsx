'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  getUserTypeDisplay, 
  getAbilityDisplay, 
  getAbilityIcon,
  USER_TYPES,
  ABILITIES,
  getAvailableAbilities 
} from '@/lib/permissions-client';
import type { UserType, Ability } from '@/lib/permissions-client';

interface Group {
  id: number;
  groupName: string;
}

export default function NewUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState<UserType | ''>('');
  const [selectedAbilities, setSelectedAbilities] = useState<Ability[]>([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    email: '',
    mobilePhone: '',
    officePhone: '',
    homePhone: '',
    grp: '',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await fetch('/api/groups');
      const data = await res.json();
      if (data.success) {
        setGroups(data.data);
      }
    } catch (err) {
      console.error('Error fetching groups:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (type: UserType) => {
    setSelectedType(type);
    // Auto-select main ability for this type
    const autoAbilities: Ability[] = [];
    if (type === 'admin') autoAbilities.push('admin');
    else if (type === 'attorney') autoAbilities.push('attorney');
    else if (type === 'paralegal') autoAbilities.push('staff');
    else if (type === 'intern') autoAbilities.push('staff');
    else if (type === 'staff') autoAbilities.push('staff');
    setSelectedAbilities(autoAbilities);
  };

  const handleAbilityToggle = (ability: Ability) => {
    setSelectedAbilities(prev => 
      prev.includes(ability)
        ? prev.filter(a => a !== ability)
        : [...prev, ability]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!formData.username || !formData.firstName || !formData.lastName) {
      setError('Username, first name, and last name are required');
      return;
    }

    setLoading(true);

    try {
      // Build roles string (type:ability1,ability2)
      let rolesString = '';
      if (selectedType) {
        rolesString = selectedAbilities.length > 0 
          ? `${selectedType}:${selectedAbilities.join(',')}`
          : selectedType;
      }

      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email || null,
          mobilePhone: formData.mobilePhone || null,
          officePhone: formData.officePhone || null,
          homePhone: formData.homePhone || null,
          grp: formData.grp || null,
          status: formData.status,
          roles: rolesString || null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/users');
      } else {
        setError(data.error || 'Failed to create user');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setError('An error occurred while creating the user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Create New User</h1>
            <Link
              href="/users"
              className="text-slate-400 hover:text-white transition-colors text-sm sm:text-base"
            >
              ← Back to Users
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-slate-800/40 border border-slate-700 rounded-lg shadow-lg p-4 sm:p-6 space-y-6 sm:space-y-8">
          
          {/* User Type & Roles */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">User Type & Permissions</h2>
            
            {/* User Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">
                User Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {Object.values(USER_TYPES).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeChange(type)}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                      selectedType === type
                        ? 'bg-brand-500/20 border-brand-500 text-white'
                        : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg sm:text-2xl mb-1">
                        {type === 'admin' && '👑'}
                        {type === 'attorney' && '⚖️'}
                        {type === 'paralegal' && '📋'}
                        {type === 'intern' && '🎓'}
                        {type === 'staff' && '👤'}
                      </div>
                      <div className="text-xs sm:text-sm font-medium">
                        {getUserTypeDisplay(type)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Available Abilities */}
            {selectedType && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Additional Abilities
                  <span className="ml-2 text-xs text-slate-500">(Optional)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {getAvailableAbilities(selectedType).map((ability) => {
                    const isAutoIncluded = 
                      (selectedType === 'admin' && ability === 'admin') ||
                      (selectedType === 'attorney' && ability === 'attorney') ||
                      (selectedType !== 'admin' && selectedType !== 'attorney' && ability === 'staff');
                    
                    return (
                      <label
                        key={ability}
                        className={`flex items-center p-3 sm:p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedAbilities.includes(ability)
                            ? 'bg-purple-500/10 border-purple-500/50'
                            : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                        } ${isAutoIncluded ? 'opacity-75' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedAbilities.includes(ability)}
                          onChange={() => handleAbilityToggle(ability)}
                          disabled={isAutoIncluded}
                          className="mr-3 h-4 w-4 rounded border-slate-600 text-purple-600 focus:ring-purple-500 disabled:opacity-50"
                        />
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-lg">{getAbilityIcon(ability)}</span>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {getAbilityDisplay(ability)}
                            </div>
                            {isAutoIncluded && (
                              <div className="text-xs text-slate-400">
                                Auto-included for {getUserTypeDisplay(selectedType)}
                              </div>
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Account Information */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                  Username <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Enter password"
                />
                <p className="mt-1 text-xs text-slate-500">Minimum 6 characters</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Confirm password"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="grp" className="block text-sm font-medium text-slate-300 mb-2">
                  Group
                </label>
                <select
                  id="grp"
                  name="grp"
                  value={formData.grp}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Select a group (optional)</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.groupName}>
                      {group.groupName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-2">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-2">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Enter last name"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="user@example.com"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="mobilePhone" className="block text-sm font-medium text-slate-300 mb-2">
                  Mobile Phone
                </label>
                <input
                  type="tel"
                  id="mobilePhone"
                  name="mobilePhone"
                  value={formData.mobilePhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="(555) 555-5555"
                />
              </div>

              <div>
                <label htmlFor="officePhone" className="block text-sm font-medium text-slate-300 mb-2">
                  Office Phone
                </label>
                <input
                  type="tel"
                  id="officePhone"
                  name="officePhone"
                  value={formData.officePhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="(555) 555-5555"
                />
              </div>

              <div>
                <label htmlFor="homePhone" className="block text-sm font-medium text-slate-300 mb-2">
                  Home Phone
                </label>
                <input
                  type="tel"
                  id="homePhone"
                  name="homePhone"
                  value={formData.homePhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="(555) 555-5555"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-3 sm:space-x-4 pt-4 border-t border-slate-700">
            <Link
              href="/users"
              className="w-full sm:w-auto text-center px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create User</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
