'use client';

import { useEffect, useState } from 'react';

type Event = {
  id: number;
  task: string | null;
  start: Date | null;
  status: string | null;
  location: string | null;
};

export function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      const response = await fetch('/api/dashboard/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Upcoming Events</h2>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"></div>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-lg border border-slate-700/50 bg-slate-900/40 p-4"
            >
              <p className="text-sm font-medium text-slate-200">
                {event.task || 'Untitled Event'}
              </p>
              <div className="mt-2 space-y-1 text-xs text-slate-400">
                {event.start && (
                  <p>📅 {new Date(event.start).toLocaleString()}</p>
                )}
                {event.location && <p>📍 {event.location}</p>}
                {event.status && (
                  <span className="inline-block mt-2 rounded-full bg-brand-500/20 px-2 py-0.5 text-xs text-brand-200 capitalize">
                    {event.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-8 text-slate-400">No upcoming events</p>
      )}
    </div>
  );
}
