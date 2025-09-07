// analyzeStream connects to backend NDJSON endpoint and calls onEvent for each parsed line
export async function analyzeStream(text: string, onEvent: (ev: any) => void) {
  const resp = await fetch("http://localhost:8080/api/analyze/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Server returned ${resp.status}: ${txt}`);
  }
  if (!resp.body) throw new Error("No response body");

  const reader = resp.body.getReader();
  const dec = new TextDecoder();
  let buf = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() || "";
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const obj = JSON.parse(line);
        onEvent(obj);
      } catch (e) {
        console.warn("Failed to parse NDJSON line", line);
      }
    }
  }
  if (buf.trim()) {
    try {
      onEvent(JSON.parse(buf));
    } catch (e) {
      console.warn("Failed to parse final buffer", buf);
    }
  }
}
