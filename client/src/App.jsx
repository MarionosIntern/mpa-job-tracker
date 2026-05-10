import React, { useState } from 'react';
import { INITIAL_JOBS } from './data.js';
import { KanbanBoard } from './components/KanbanBoard.jsx';
import { AIPanel } from './components/AIPanel.jsx';
import { AddJobModal } from './components/AddJobModal.jsx';

export default function App() {
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [selectedJob, setSelectedJob] = useState(INITIAL_JOBS[0]);
  const [modal, setModal] = useState(null); // null | { defaultStatus }
  const [toast, setToast] = useState('');

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function addJob(job) {
    setJobs(prev => [...prev, job]);
    setModal(null);
    showToast('Application added!');
  }

  function removeJob(id) {
    setJobs(prev => prev.filter(j => j.id !== id));
    if (selectedJob?.id === id) setSelectedJob(jobs.find(j => j.id !== id) || null);
  }

  function selectJob(job) {
    setSelectedJob(job);
    showToast(`Selected: ${job.role} @ ${job.company}`);
  }

  const total      = jobs.length;
  const active     = jobs.filter(j => j.status === 'Interview' || j.status === 'Screen').length;
  const offers     = jobs.filter(j => j.status === 'Offer').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0,
        background: 'rgba(15,15,15,0.95)', backdropFilter: 'blur(8px)', zIndex: 100,
      }}>
        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, letterSpacing: '-0.5px' }}>
          <span style={{ color: 'var(--accent)' }}>MPA</span> Job Tracker
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <StatPill><b>{total}</b> total</StatPill>
            <StatPill><b>{active}</b> active</StatPill>
            <StatPill style={{ color: 'var(--green)' }}><b>{offers}</b> offers</StatPill>
          </div>
          <button
            onClick={() => setModal({ defaultStatus: 'Applied' })}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--accent)', color: '#ffffff', border: 'none',
              borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif',
            }}
          >+ Add Job</button>
        </div>
      </header>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar */}
        <aside style={{ width: 220, minWidth: 220, borderRight: '1px solid var(--border)', padding: 16, display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
          <SideLabel>Views</SideLabel>
          <NavItem active>⬜ Kanban</NavItem>

          <SideLabel style={{ marginTop: 8 }}>AI Tools</SideLabel>
          <NavItem>🔍 Parse Job</NavItem>
          <NavItem>📊 Match Score</NavItem>
          <NavItem>✍️ Cover Letter</NavItem>
          <NavItem>🎙️ Interview Prep</NavItem>

        </aside>

        {/* Kanban */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <KanbanBoard
            jobs={jobs}
            onSelectJob={selectJob}
            onRemoveJob={removeJob}
            onAddJob={status => setModal({ defaultStatus: status })}
          />
        </div>

        {/* AI Panel */}
        <AIPanel selectedJob={selectedJob} />
      </div>

      {/* Modal */}
      {modal && (
        <AddJobModal
          defaultStatus={modal.defaultStatus}
          onSave={addJob}
          onClose={() => setModal(null)}
        />
      )}

      {/* Toast */}
      <div style={{
        position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        background: 'var(--surface2)', border: '1px solid var(--border2)',
        borderRadius: 20, padding: '8px 16px', fontSize: 13, color: 'var(--text)',
        zIndex: 300, transition: 'opacity 0.2s',
        opacity: toast ? 1 : 0, pointerEvents: 'none',
      }}>{toast}</div>
    </div>
  );
}

function StatPill({ children, style }) {
  return (
    <div style={{
      background: 'var(--surface2)', border: '1px solid var(--border)',
      padding: '4px 10px', borderRadius: 20, fontSize: 12,
      color: 'var(--text2)', fontFamily: 'DM Mono, monospace', ...style,
    }}>{children}</div>
  );
}

function SideLabel({ children, style }) {
  return (
    <div style={{
      fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase',
      letterSpacing: 1, fontWeight: 500, padding: '8px 8px 4px', ...style,
    }}>{children}</div>
  );
}

function NavItem({ children, active, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
        borderRadius: 'var(--radius)', cursor: 'pointer',
        color: active ? 'var(--accent)' : hovered ? 'var(--text)' : 'var(--text2)',
        background: active || hovered ? 'var(--surface2)' : 'transparent',
        fontSize: 13, transition: 'all 0.15s',
      }}
    >{children}</div>
  );
}
