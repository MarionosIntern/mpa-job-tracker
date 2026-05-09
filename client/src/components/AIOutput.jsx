import React from 'react';

function formatText(t) {
  return t
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^#{1,3} (.+)$/gm, '<b>$1</b>')
    .replace(/\n\n/g, '</p><p style="margin-top:8px;">')
    .replace(/\n/g, '<br>');
}

export function AIOutput({ output, streaming, error }) {
  const [copied, setCopied] = React.useState(false);

  if (!output && !streaming && !error) return null;

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div style={{
        background: 'var(--bg)',
        border: `1px solid ${streaming ? 'var(--accent)' : error ? 'var(--red)' : 'var(--border)'}`,
        boxShadow: streaming ? '0 0 0 1px rgba(232,197,71,0.1)' : 'none',
        borderRadius: 'var(--radius)',
        padding: '12px',
        fontSize: '13px',
        lineHeight: 1.7,
        color: error ? 'var(--red)' : 'var(--text2)',
        minHeight: '60px',
        transition: 'border-color 0.2s',
      }}>
        {error ? (
          <span>{error} — make sure <code>ANTHROPIC_API_KEY</code> is set in <code>server/.env</code></span>
        ) : streaming && !output ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text3)', fontStyle: 'italic', fontSize: 12 }}>
            <span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            Claude is thinking...
          </span>
        ) : (
          <>
            <span dangerouslySetInnerHTML={{ __html: formatText(output) }} />
            {streaming && <span style={{ display: 'inline-block', width: 2, height: 14, background: 'var(--accent)', animation: 'blink 0.8s infinite', verticalAlign: 'middle', marginLeft: 2 }} />}
          </>
        )}
      </div>
      {output && !streaming && (
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          <button onClick={copy} style={actionBtnStyle}>{copied ? 'Copied!' : 'Copy'}</button>
        </div>
      )}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}

const actionBtnStyle = {
  fontSize: 11, padding: '3px 8px', borderRadius: 6,
  border: '1px solid var(--border2)', background: 'transparent',
  color: 'var(--text2)', cursor: 'pointer',
};
