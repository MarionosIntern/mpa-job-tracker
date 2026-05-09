import { useState } from 'react';

const STATUSES = ['Applied', 'Screen', 'Interview', 'Offer', 'Rejected'];

export function AddJobModal({ defaultStatus = 'Applied', onSave, onClose }) {
  const [form, setForm] = useState({
    company: '', role: '', location: '', salary: '',
    status: defaultStatus, date: new Date().toISOString().slice(0, 10), notes: '',
  });

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function handleSave() {
    if (!form.company || !form.role) return;
    onSave({ ...form, id: Date.now(), score: null, skills_match: [], skills_gap: [] });
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: 520, maxHeight: '80vh', overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20 }}>Add Application</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            ['Company', 'company', 'Acme Corp'],
            ['Role', 'role', 'Software Engineer'],
            ['Location', 'location', 'Remote'],
            ['Salary', 'salary', '$120k–$160k'],
          ].map(([label, key, placeholder]) => (
            <Field key={key} label={label}>
              <input value={form[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder} />
            </Field>
          ))}
          <Field label="Status">
            <select value={form.status} onChange={e => set('status', e.target.value)}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Date Applied">
            <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
          </Field>
        </div>

        <Field label="Notes / Job URL">
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Paste the job URL or any notes..." style={{ minHeight: 60 }} />
        </Field>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid var(--border2)', color: 'var(--text2)', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif' }}>Cancel</button>
          <button onClick={handleSave} style={{ background: 'var(--accent)', color: '#ffffff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif' }}>Save</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{label}</div>
      {children}
    </div>
  );
}
