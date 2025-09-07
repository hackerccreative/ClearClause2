import React, { useState } from "react";
import ResultPanel from "./components/ResultPanel";
import { analyzeStream } from "./services/api";

export default function App() {
  const [text, setText] = useState<string>(""); 
  const [status, setStatus] = useState<string>("Idle");
  const [events, setEvents] = useState<any[]>([]);

  const appendEvent = (ev: any) => setEvents(prev => [...prev, ev]);

  const onAnalyze = async () => {
    setEvents([]);
    setStatus("Starting");
    try {
      await analyzeStream(text, (ev) => {
        appendEvent(ev);
        if (ev.type === "status") setStatus(String(ev.stage));
        if (ev.type === "final") setStatus("Complete");
      });
    } catch (e: any) {
      setStatus("Error: " + (e?.message ?? String(e)));
    }
  };

  return (
    <div className="app">
      <h2>ClearClause — Demo</h2>
      <p>Paste Terms &amp; Conditions or Privacy Policy text below and click Analyze.</p>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste T&amp;C text here..." />
      <div className="row">
        <div className="left">
          <button onClick={onAnalyze}>Analyze</button>
          <div className="status">Status: {status}</div>
        </div>
        <div className="right">
          <div style={{fontSize:12,color:"#666"}}>Events</div>
          <div style={{maxHeight:200,overflow:"auto",background:"#fff",marginTop:8,padding:8,borderRadius:6,border:"1px solid #eee"}}>
            {events.slice().reverse().map((e, i) => <div key={i} style={{fontSize:12}}>{JSON.stringify(e)}</div>)}
          </div>
        </div>
      </div>

      <h3 style={{marginTop:20}}>Live Output</h3>
      <ResultPanel events={events} />
    </div>
  );
}
