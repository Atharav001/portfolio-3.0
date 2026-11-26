import React from 'react';
import './WorkflowVisual.css';

const Arrow = () => <span className="workflow-connector" aria-hidden="true">→</span>;

const CsvSheet = ({ label, columns, rows, tone = '' }) => (
  <div className={`workflow-sheet ${tone}`}>
    <div className="workflow-sheet-head"><span className="workflow-file-icon">CSV</span><strong>{label}</strong><span>· · ·</span></div>
    <div className="workflow-sheet-table">
      <div className="workflow-sheet-columns">{columns.map((column) => <span key={column}>{column}</span>)}</div>
      {rows.map((row, index) => <div className="workflow-sheet-row" key={index}>{row.map((cell, cellIndex) => <span key={cellIndex}>{cell}</span>)}</div>)}
    </div>
  </div>
);

export default function WorkflowVisual({ slug }) {
  if (slug === 'debiased-multimodal-pipeline') {
    return (
      <div className="workflow-art workflow-claims">
        <div className="workflow-art-header"><span>01 / CLAIM REVIEW PIPELINE</span><span>Illustrative data flow</span></div>
        <div className="workflow-art-main">
          <CsvSheet label="claims.csv" columns={['claim_id', 'image_paths', 'claim_text']} rows={[["C-042", "4 photos", "Damage reported"], ["C-043", "2 photos", "Review needed"]]} />
          <Arrow />
          <div className="workflow-stages">
            <div><span>01</span><strong>Blind perception</strong><small>Images → visual facts</small></div>
            <div><span>02</span><strong>Adjudication</strong><small>Facts + claim → verdict</small></div>
          </div>
          <Arrow />
          <CsvSheet label="verdicts.csv" tone="workflow-output" columns={['claim_id', 'status', 'review']} rows={[["C-042", "flagged", "human"], ["C-043", "uncertain", "human"]]} />
        </div>
        <div className="workflow-art-footer"><span><b>65%</b> claim-status accuracy</span><span><b>20%</b> severity accuracy</span><span>Published evaluation · human review essential</span></div>
      </div>
    );
  }

  if (slug === 'hybrid-multimodal-whatsapp-router') {
    return (
      <div className="workflow-art workflow-router">
        <div className="workflow-art-header"><span>02 / MESSAGE ROUTING PIPELINE</span><span>Illustrative data flow</span></div>
        <div className="workflow-art-main">
          <div className="workflow-input-stack"><CsvSheet label="messages.csv" columns={['type', 'sender', 'content']} rows={[["text", "team", "Project update"], ["image", "business", "Weekly offer"], ["voice", "unknown", "Suspicious link"]]} /><span className="workflow-media-tags"><i>TEXT</i><i>OCR</i><i>ASR</i></span></div>
          <Arrow />
          <div className="workflow-stages workflow-router-stages">
            <div><span>01</span><strong>Rules + context</strong></div>
            <div><span>02</span><strong>Model decision</strong></div>
            <div><span>03</span><strong>Safety gate</strong></div>
          </div>
          <Arrow />
          <CsvSheet label="predictions.csv" tone="workflow-output" columns={['message', 'action', 'reason']} rows={[["update", "notify", "trusted"], ["offer", "digest", "promo"], ["link", "mute", "safety"]]} />
        </div>
        <div className="workflow-art-footer"><span><b>30/30</b> correct actions · labeled sample</span><span><b>49</b> safety overrides · 110 rows</span><span><b>0</b> violations in that batch</span></div>
      </div>
    );
  }

  return (
    <div className="workflow-art workflow-research">
      <div className="workflow-art-header"><span>03 / AGENTIC DEEP RESEARCH</span><span>Illustrative process</span></div>
      <div className="workflow-art-main">
        <div className="workflow-paper-stack"><span className="workflow-paper-back" /><span className="workflow-paper-mid" /><div className="workflow-paper-front"><span>RESEARCH CORPUS</span><strong>374 papers</strong><i /><i /><i /><small>Collected from online sources</small></div></div>
        <Arrow />
        <div className="workflow-stages workflow-research-stages"><div><span>01</span><strong>Embeddings</strong><small>Index the paper corpus</small></div><div><span>02</span><strong>Hybrid retrieval</strong><small>Find relevant evidence</small></div><div><span>03</span><strong>Parallel evaluation</strong><small>Check grounded answers</small></div></div>
        <Arrow />
        <div className="workflow-answer"><span>CITED ANSWER</span><strong>Findings linked to their sources</strong><p>Retrieved papers support the synthesis and make each conclusion traceable.</p><div>[1] &nbsp; [2] &nbsp; [3]</div></div>
      </div>
      <div className="workflow-art-footer"><span><b>374</b> papers indexed</span><span><b>Hybrid</b> retrieval</span><span><b>Citations</b> verified in output</span></div>
    </div>
  );
}
