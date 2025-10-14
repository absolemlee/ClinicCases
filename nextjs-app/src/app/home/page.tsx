'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RecentActivity } from '@/components/home/RecentActivity';
import { UpcomingEvents } from '@/components/home/UpcomingEvents';
import { MyCases } from '@/components/home/MyCases';

export default function HomePage() {
  const [stats, setStats] = useState({
    totalCases: 0,
    openCases: 0,
    recentNotes: 0,
    upcomingEvents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-4">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Total Cases
          </p>
          <p className="mt-2 text-2xl font-bold text-white">
            {loading ? '—' : stats.totalCases}
          </p>
          <Link href="/cases" className="mt-2 text-xs text-brand-400 hover:text-brand-300">
            View all →
          </Link>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-4">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Open Cases
          </p>
          <p className="mt-2 text-2xl font-bold text-white">
            {loading ? '—' : stats.openCases}
          </p>
          <Link href="/cases" className="mt-2 text-xs text-brand-400 hover:text-brand-300">
            View open →
          </Link>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-4">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Recent Notes
          </p>
          <p className="mt-2 text-2xl font-bold text-white">
            {loading ? '—' : stats.recentNotes}
          </p>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-4">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Upcoming Events
          </p>
          <p className="mt-2 text-2xl font-bold text-white">
            {loading ? '—' : stats.upcomingEvents}
          </p>
          <Link href="/home#calendar" className="mt-2 text-xs text-brand-400 hover:text-brand-300">
            View calendar →
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MyCases />
        <RecentActivity />
      </div>

      {/* Full Width Section */}
      <UpcomingEvents />
    </div>
  );
}
