import React, { useState } from 'react';
import { useStreaming } from '../hooks/useStreaming.js';
import { AIOutput } from './AIOutput.jsx';

const TABS = ['parse', 'resume', 'cover', 'interview'];
const TAB_LABELS = { parse: 'Parse', resume: 'Match', cover: 'Cover', interview: 'Prep' };

export function AIPanel({ selectedJob }) {
  const [tab, setTab] = useState('parse');

  return (
    <aside style={{ width: 380, minWidth: 380, borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
          AI Assistant
        </div>
        <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>claude-sonnet-4</span>
      </div>

      <div style={{ display: 'flex', gap: 2, padding: 8, borderBottom: '1px solid var(--border)' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, textAlign: 'center', padding: '6px 4px', borderRadius: 8,
            fontSize: 12, cursor: 'pointer', border: 'none',
            background: tab === t ? 'var(--surface3)' : 'transparent',
            color: tab === t ? 'var(--text)' : 'var(--text2)',
            fontWeight: tab === t ? 500 : 400,
            fontFamily: 'Instrument Sans, sans-serif',
            transition: 'all 0.15s',
          }}>{TAB_LABELS[t]}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {tab === 'parse'     && <ParseTab />}
        {tab === 'resume'    && <MatchTab job={selectedJob} />}
        {tab === 'cover'     && <CoverTab job={selectedJob} />}
        {tab === 'interview' && <InterviewTab job={selectedJob} />}
      </div>
    </aside>
  );
}

// ── Parse Tab ───────────────────────────────────────────────────────────────
function ParseTab() {
  const [input, setInput] = useState('');
  const { output, streaming, error, stream } = useStreaming();

  async function run() {
    if (!input.trim()) return;
    await stream(`Extract structured information from this job posting and respond with a formatted summary. Include:
- **Role**: job title
- **Company**: company name
- **Location**: location / remote status
- **Salary**: if mentioned
- **Key skills**: bullet list of 5–8 required skills
- **Nice to have**: 2–3 bonus skills
- **Culture signals**: 1–2 things about company culture you can infer
- **Match tips**: 2 specific things a candidate should highlight

Job posting:
${input}`);
  }

  return (
    <>
      <Field label="Paste job description">
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste the full job posting here..." style={{ minHeight: 120 }} />
      </Field>
      <AIButton onClick={run} disabled={streaming}>✦ Parse with AI</AIButton>
      <AIOutput output={output} streaming={streaming} error={error} />
    </>
  );
}

// ── Match Tab ───────────────────────────────────────────────────────────────
function MatchTab({ job }) {
  const [resume, setResume] = useState('');
  const { output, streaming, error, stream } = useStreaming();

  if (!job) return <div style={emptyStyle}>Select a job card to see match score</div>;

  const score = job.score || 0;
  const circ = 2 * Math.PI * 38;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? '#4ade80' : score >= 60 ? '#e8c547' : '#f87171';

  async function run() {
    if (!resume.trim()) return;
    await stream(`Analyze how well this candidate matches the job. Be specific and concise.

Job: ${job.role} at ${job.company}
Known required skills: ${[...(job.skills_match || []), ...(job.skills_gap || [])].join(', ')}

Candidate resume summary:
${resume}

Provide:
1. **Overall match** (0–100%) with one sentence of reasoning
2. **Strong matches** (3–4 skills they clearly have)
3. **Key gaps** (2–3 things to address)
4. **One quick action** they could take to improve their odds`);
  }

  return (
    <>
      <div style={{ fontSize: 12, color: 'var(--text2)' }}>
        Analyzing: <b style={{ color: 'var(--text)' }}>{job.role} @ {job.company}</b>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '12px 0' }}>
        <div style={{ position: 'relative', width: 100, height: 100 }}>
          <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="38" fill="none" stroke="var(--border2)" strokeWidth="7" />
            <circle cx="50" cy="50" r="38" fill="none" stroke={color} strokeWidth="7"
              strokeDasharray={`${dash.toFixed(1)} ${circ.toFixed(1)}`} strokeLinecap="round" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 600, fontFamily: 'DM Mono, monospace', color: 'var(--text)' }}>{score}%</div>
            <div style={{ fontSize: 11, color: 'var(--text2)' }}>match</div>
          </div>
        </div>
      </div>

      {(job.skills_match?.length > 0 || job.skills_gap?.length > 0) && (
        <div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6 }}>SKILL BREAKDOWN</div>
          {job.skills_match?.map(s => <SkillRow key={s} name={s} match />)}
          {job.skills_gap?.map(s => <SkillRow key={s} name={s} match={false} />)}
        </div>
      )}

      <Field label="Paste your resume (brief summary)">
        <textarea value={resume} onChange={e => setResume(e.target.value)}
          placeholder="Paste a summary of your skills, experience, and projects..." style={{ minHeight: 100 }} />
      </Field>
      <AIButton onClick={run} disabled={streaming}>✦ Analyze Gap</AIButton>
      <AIOutput output={output} streaming={streaming} error={error} />
    </>
  );
}

function SkillRow({ name, match }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ flex: 1, fontSize: 12, color: 'var(--text2)' }}>{name}</div>
      <span style={{
        fontSize: 11, padding: '2px 8px', borderRadius: 20,
        background: match ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
        color: match ? 'var(--green)' : 'var(--red)',
      }}>{match ? '✓ match' : 'gap'}</span>
    </div>
  );
}

// ── Cover Tab ───────────────────────────────────────────────────────────────
function CoverTab({ job }) {
  const [bg, setBg] = useState('');
  const [tone, setTone] = useState('Professional');
  const { output, streaming, error, stream } = useStreaming();

  async function run() {
    if (!bg.trim()) return;
    await stream(`Write a concise, compelling cover letter (250–300 words) in a ${tone} tone.

Role: ${job?.role || 'Software Engineer'} at ${job?.company || 'the company'}
Candidate background: ${bg}

Requirements:
- Opening that immediately shows enthusiasm and fit (no "I am writing to apply")
- One paragraph showing relevant technical background with a specific example
- One paragraph showing cultural fit / why this company specifically
- Brief, confident close
- No fluff or filler sentences`);
  }

  return (
    <>
      {job && <div style={{ fontSize: 12, color: 'var(--text2)' }}>For: <b style={{ color: 'var(--text)' }}>{job.role} @ {job.company}</b></div>}
      <Field label="Your background (2–3 sentences)">
        <textarea value={bg} onChange={e => setBg(e.target.value)}
          placeholder="e.g. I'm a CS senior with internships at two startups. I've built fullstack apps with React and Node..." style={{ minHeight: 80 }} />
      </Field>
      <Field label="Tone">
        <select value={tone} onChange={e => setTone(e.target.value)}>
          {['Professional', 'Enthusiastic', 'Concise', 'Storytelling'].map(t => <option key={t}>{t}</option>)}
        </select>
      </Field>
      <AIButton onClick={run} disabled={streaming}>✦ Generate Cover Letter</AIButton>
      <AIOutput output={output} streaming={streaming} error={error} />
    </>
  );
}

// ── Interview Tab ────────────────────────────────────────────────────────────
function InterviewTab({ job }) {
  const [focus, setFocus] = useState('');
  const { output, streaming, error, stream } = useStreaming();

  async function run() {
    await stream(`Generate 6 interview questions for a ${job?.role || 'software engineer'} role at ${job?.company || 'a tech company'}.
${focus ? `Focus area: ${focus}` : 'Mix of behavioral and technical.'}

Format each as:
**Q: [question]**
[TYPE: Behavioral/Technical/System Design] — [1 sentence tip on how to answer well]

Make them specific to the role and company, not generic. Include at least one tricky or surprising question.`);
  }

  return (
    <>
      {job && <div style={{ fontSize: 12, color: 'var(--text2)' }}>Prep for: <b style={{ color: 'var(--text)' }}>{job.role} @ {job.company}</b></div>}
      <Field label="Focus area (optional)">
        <input value={focus} onChange={e => setFocus(e.target.value)}
          placeholder="e.g. system design, behavioral, React..." style={{ minHeight: 'unset', resize: 'none' }} />
      </Field>
      <AIButton onClick={run} disabled={streaming}>✦ Generate Questions</AIButton>
      <AIOutput output={output} streaming={streaming} error={error} />
    </>
  );
}

// ── Shared UI ────────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{label}</div>
      {children}
    </div>
  );
}

function AIButton({ children, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      background: disabled ? 'rgba(96,165,250,0.4)' : 'var(--accent)',
      color: '#ffffff', border: 'none', borderRadius: 8,
      padding: '10px 16px', fontFamily: 'Instrument Sans, sans-serif',
      fontSize: 13, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.15s', width: '100%',
    }}>{children}</button>
  );
}

const emptyStyle = { textAlign: 'center', padding: '24px 16px', color: 'var(--text3)', fontSize: 13, lineHeight: 1.7 };
