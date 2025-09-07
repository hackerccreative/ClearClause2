import React from "react";

export default function ResultPanel({ events }: { events: any[] }) {
  // events is array of NDJSON objects in order (old to new)
  const summaryChunks = events.filter(e => e.type === "summary_chunk").map(e => e.token).join("");
  const mapResults = events.filter(e => e.type === "map_result");
  const risks = events.filter(e => e.type === "risk").map(e => e.payload);

  return (
    <div style={{display:"flex", gap:12}}>
      <div style={{flex:2}} className="panel">
        <h4>Quick Summary</h4>
        <div style={{whiteSpace:"pre-wrap", fontSize:14, lineHeight:1.5}}>{summaryChunks || " (summary will stream here) "}</div>

        <h4 style={{marginTop:12}}>Chunk Summaries</h4>
        {mapResults.length === 0 && <div style={{fontSize:13,color:"#777"}}>No chunk summaries yet.</div>}
        {mapResults.map((m: any, idx: number) => (
          <div key={idx} style={{fontSize:13, marginTop:8, padding:8, background:"#fff", borderRadius:6}}>
            <b>Chunk {m.chunkIndex}:</b>
            <div style={{marginTop:6, whiteSpace:"pre-wrap"}}>{m.text}</div>
          </div>
        ))}
      </div>

      <div style={{flex:1}} className="panel">
        <h4>Key Risks</h4>
        {risks.length === 0 && <div style={{fontSize:13,color:"#777"}}>No risks detected yet.</div>}
        {risks.map((r:any, i:number) => (
          <div key={i} style={{marginBottom:12}}>
            <div className={r.category === "High" ? "risk-high" : r.category === "Medium" ? "risk-medium" : "risk-low"}>{r.category}</div>
            <div style={{fontSize:13}}>{r.sentence}</div>
            <div style={{fontSize:12,color:"#666"}}>{r.explanation}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
