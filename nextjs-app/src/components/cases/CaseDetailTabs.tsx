'use client';

import { useState } from 'react';
import { AddNoteModal } from './AddNoteModal';
import { AddContactModal } from './AddContactModal';
import { AddDocumentModal } from './AddDocumentModal';
import { AddEventModal } from './AddEventModal';

type CaseData = {
  id: number;
  caseNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  notes: Array<{ id: number; username: string; description: string | null; datestamp: Date | null }>;
  contacts: Array<{ id: number; firstName: string | null; lastName: string | null; type: string | null }>;
  documents: Array<{ id: number; displayName: string | null; extension: string | null }>;
  events: Array<{ id: number; task: string | null; start: Date | null; status: string | null }>;
};

type CaseDetailTabsProps = {
  caseData: CaseData;
  activeTab: 'overview' | 'notes' | 'contacts' | 'documents' | 'events';
  onTabChange: (tab: 'overview' | 'notes' | 'contacts' | 'documents' | 'events') => void;
  onRefresh: () => void;
};

export function CaseDetailTabs({
  caseData,
  activeTab,
  onTabChange,
  onRefresh,
}: CaseDetailTabsProps) {
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);

  const tabs = [
    { id: 'overview' as const, label: 'Overview', count: null },
    { id: 'notes' as const, label: 'Notes', count: caseData.notes.length },
    { id: 'contacts' as const, label: 'Contacts', count: caseData.contacts.length },
    { id: 'documents' as const, label: 'Documents', count: caseData.documents.length },
    { id: 'events' as const, label: 'Events', count: caseData.events.length },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-slate-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-500 text-brand-400'
                  : 'border-transparent text-slate-400 hover:border-slate-600 hover:text-slate-300'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="ml-2 rounded-full bg-slate-700 px-2 py-0.5 text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-6">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Case Overview</h2>
            <div className="space-y-2 text-sm">
              <p className="text-slate-300">
                <span className="font-medium">Client:</span> {caseData.firstName} {caseData.lastName}
              </p>
              <p className="text-slate-300">
                <span className="font-medium">Case Number:</span> {caseData.caseNumber || `#${caseData.id}`}
              </p>
              <p className="text-slate-300">
                <span className="font-medium">Recent Activity:</span> {caseData.notes.length > 0 ? `${caseData.notes.length} notes` : 'No notes yet'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Case Notes</h2>
              <button 
                onClick={() => setShowAddNote(true)}
                className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600"
              >
                + Add Note
              </button>
            </div>
            
            {caseData.notes.length > 0 ? (
              <div className="space-y-3">
                {caseData.notes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-lg border border-slate-700/50 bg-slate-900/40 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-slate-200">{note.description || 'No description'}</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                          <span className="font-medium">{note.username}</span>
                          <span>•</span>
                          <span>
                            {note.datestamp
                              ? new Date(note.datestamp).toLocaleString()
                              : 'No date'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-slate-400">No notes added yet</p>
            )}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Contacts</h2>
              <button 
                onClick={() => setShowAddContact(true)}
                className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600"
              >
                + Add Contact
              </button>
            </div>
            
            {caseData.contacts.length > 0 ? (
              <div className="space-y-2">
                {caseData.contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-900/40 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        {contact.firstName} {contact.lastName}
                      </p>
                      {contact.type && (
                        <p className="text-xs text-slate-400">{contact.type}</p>
                      )}
                    </div>
                    <button className="text-sm text-brand-400 hover:text-brand-300">
                      View
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-slate-400">No contacts added yet</p>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Documents</h2>
              <button 
                onClick={() => setShowAddDocument(true)}
                className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600"
              >
                + Upload
              </button>
            </div>
            
            {caseData.documents.length > 0 ? (
              <div className="space-y-2">
                {caseData.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-900/40 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded bg-slate-700 px-2 py-1 text-xs font-mono text-slate-300">
                        {doc.extension || 'FILE'}
                      </div>
                      <p className="text-sm text-slate-200">
                        {doc.displayName || 'Untitled Document'}
                      </p>
                    </div>
                    <button className="text-sm text-brand-400 hover:text-brand-300">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-slate-400">No documents uploaded yet</p>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Events & Tasks</h2>
              <button 
                onClick={() => setShowAddEvent(true)}
                className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600"
              >
                + Add Event
              </button>
            </div>
            
            {caseData.events.length > 0 ? (
              <div className="space-y-2">
                {caseData.events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-900/40 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        {event.task || 'Untitled Event'}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                        <span>
                          {event.start
                            ? new Date(event.start).toLocaleDateString()
                            : 'No date'}
                        </span>
                        {event.status && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{event.status}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button className="text-sm text-brand-400 hover:text-brand-300">
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-slate-400">No events scheduled yet</p>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddNoteModal 
        caseId={caseData.id}
        isOpen={showAddNote}
        onClose={() => setShowAddNote(false)}
        onSuccess={onRefresh}
      />
      <AddContactModal 
        caseId={caseData.id}
        isOpen={showAddContact}
        onClose={() => setShowAddContact(false)}
        onSuccess={onRefresh}
      />
      <AddDocumentModal 
        caseId={caseData.id}
        isOpen={showAddDocument}
        onClose={() => setShowAddDocument(false)}
        onSuccess={onRefresh}
      />
      <AddEventModal 
        caseId={caseData.id}
        isOpen={showAddEvent}
        onClose={() => setShowAddEvent(false)}
        onSuccess={onRefresh}
      />
    </div>
  );
}
