import React from 'react';
import { COLS } from '../data.js';

export function KanbanBoard({ jobs, onSelectJob, onRemoveJob, onAddJob }) {
  return (
    <div style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', padding: '20px 24px' }}>
      <div style={{ display: 'flex', gap: 16, height: '100%', minWidth: 'max-content' }}>
        {COLS.map(col => (
          <Column
            key={col.id}
            col={col}
            jobs={jobs.filter(j => j.status === col.id)}
            onSelectJob={onSelectJob}
            onRemoveJob={onRemoveJob}
            onAddJob={() => onAddJob(col.id)}
          />
        ))}
      </div>
    </div>
  );
}

function Column({ col, jobs, onSelectJob, onRemoveJob, onAddJob }) {
  return (
    <div style={{ width: 240, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px 8px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text2)' }}>
          <span style={{ color: col.color, fontSize: 9 }}>●</span>
          {col.label}
          <span style={{ background: 'var(--surface3)', color: 'var(--text2)', padding: '2px 7px', borderRadius: 20, fontSize: 11, fontFamily: 'DM Mono, monospace' }}>
            {jobs.length}
          </span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 4 }}>
        {jobs.map(j => (
          <JobCard key={j.id} job={j} onSelect={() => onSelectJob(j)} onRemove={() => onRemoveJob(j.id)} />
        ))}
        <div
          onClick={onAddJob}
          style={{
            border: '1px dashed var(--border)', borderRadius: 'var(--radius)',
            padding: 10, textAlign: 'center', fontSize: 12,
            color: 'var(--text3)', cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text2)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text3)'; }}
        >+ Add</div>
      </div>
    </div>
  );
}

function JobCard({ job, onSelect, onRemove }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: 12, cursor: 'pointer',
        transition: 'all 0.15s',
        borderColor: hovered ? 'var(--border2)' : 'var(--border)',
        transform: hovered ? 'translateY(-1px)' : 'none',
      }}
    >
      <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 2 }}>{job.company}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 8, lineHeight: 1.3 }}>{job.role}</div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {job.location && <Badge color="#60a5fa" bg="rgba(96,165,250,0.15)">{job.location}</Badge>}
        {job.salary   && <Badge color="#4ade80" bg="rgba(74,222,128,0.12)">{job.salary}</Badge>}
        {job.score    && <Badge color="#e8c547" bg="rgba(232,197,71,0.15)">{job.score}% match</Badge>}
      </div>

      {hovered && (
        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
          <ActionBtn onClick={e => { e.stopPropagation(); onSelect(); }}>Cover ✍</ActionBtn>
          <ActionBtn onClick={e => { e.stopPropagation(); onSelect(); }}>Prep 🎙</ActionBtn>
          <ActionBtn onClick={e => { e.stopPropagation(); onRemove(); }} danger>×</ActionBtn>
        </div>
      )}

      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8 }}>Applied {job.date || '—'}</div>
    </div>
  );
}

function Badge({ color, bg, children }) {
  return (
    <span style={{
      fontSize: 11, padding: '2px 8px', borderRadius: 20,
      fontFamily: 'DM Mono, monospace', background: bg, color,
    }}>{children}</span>
  );
}

function ActionBtn({ onClick, danger, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 11, padding: '3px 8px', borderRadius: 6,
        border: '1px solid var(--border2)', background: 'transparent',
        color: danger ? 'var(--red)' : 'var(--text2)',
        cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif',
      }}
    >{children}</button>
  );
}
