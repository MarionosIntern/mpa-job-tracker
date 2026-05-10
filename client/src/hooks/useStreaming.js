import { useState, useCallback } from 'react';

export function useStreaming() {
  const [output, setOutput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(null);

  const stream = useCallback(async (prompt) => {
    setOutput('');
    setError(null);
    setStreaming(true);

    try {
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Server error');
      }

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let text = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        for (const line of dec.decode(value).split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.text) {
              text += parsed.text;
              setOutput(text);
            }
          } catch (e) {
           // Ignore JSON parse errors for non-JSON lines
          }
        }
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setStreaming(false);
    }
  }, []);

  return { output, streaming, error, stream };
}
