'use client';

import { useEffect, useState } from 'react';

type Activity = {
  id: number;
  type: 'note' | 'case_opened' | 'case_closed';
  description: string;
  username: string;
  timestamp: Date;
};

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch('/api/dashboard/activity');
      if (response.ok) {
        const data = await response.json();
        setActivities(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'note':
        return '📝';
      case 'case_opened':
        return '✅';
      case 'case_closed':
        return '🔒';
      default:
        return '•';
    }
  };

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"></div>
        </div>
      ) : activities.length > 0 ? (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <span className="text-lg">{getActivityIcon(activity.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200">{activity.description}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-medium">{activity.username}</span>
                  <span>•</span>
                  <span>
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-8 text-slate-400">No recent activity</p>
      )}
    </div>
  );
}
