import React from 'react';
import './WorkflowVisual.css';

const Frame = ({ title, children }) => <div className="artifact-frame"><div className="artifact-bar"><span aria-hidden="true">● ● ●</span><span>{title}</span><span>↗</span></div>{children}</div>;

export default function WorkflowVisual({ slug }) {
  if (slug === 'debiased-multimodal-pipeline') return <div className="artifact artifact-claim">
    <div className="artifact-heading"><b>CLAIM REVIEW</b><span>Illustrative output · Python batch pipeline</span></div>
    <Frame title="claim review / output sample"><div className="artifact-columns claim-columns">
      <div><small>INPUT</small><h4>Claim + photos</h4><p>Written account and four submitted images</p><div className="artifact-photo-strip"><i /><i /><i /><i /></div></div>
      <div><small>METHOD</small><div className="artifact-step"><b>01</b><span><strong>Blind observation</strong><em>Images → visual facts</em></span></div><div className="artifact-step"><b>02</b><span><strong>Adjudication</strong><em>Facts + claim → verdict</em></span></div></div>
      <div><small>STRUCTURED OUTPUT</small><h4>Human review</h4><p>Observation and decision can be inspected separately.</p><div className="artifact-number"><b>65%</b><span>claim-status accuracy<br />published evaluation</span></div></div>
    </div></Frame><div className="artifact-foot">Severity accuracy: 20%. This prototype does not replace an assessor.</div>
  </div>;
  if (slug === 'hybrid-multimodal-whatsapp-router') return <div className="artifact artifact-router">
    <div className="artifact-heading"><b>WHATSAPP MESSAGE ROUTER</b><span>Illustrative rows · no graphical app</span></div>
    <Frame title="predictions.csv"><div className="router-summary"><div><small>LABELED SAMPLE</small><strong>30 / 30</strong><span>correct routing actions</span></div><div><small>ROUTES</small><strong>03</strong><span>notify · digest · mute</span></div></div>
      <div className="router-table"><div><b>INPUT</b><b>CONTEXT</b><b>ACTION</b></div><div><span>Team update</span><span>Trusted sender</span><strong className="notify">Notify</strong></div><div><span>Weekly offer</span><span>Promotion</span><strong className="digest">Digest</strong></div><div><span>Suspicious link</span><span>Safety gate</span><strong className="mute">Mute</strong></div></div>
      <div className="router-path">Text / OCR / speech <span>→</span> Rules + context <span>→</span> Safety gate</div>
    </Frame><div className="artifact-foot">Example message text is illustrative; the 30/30 result is from the labeled sample.</div>
  </div>;
  return <div className="artifact artifact-research">
    <div className="artifact-heading"><b>AGENTIC DEEP RESEARCH</b><span>Illustrative output · local CLI</span></div>
    <Frame title="research / answer with sources"><div className="artifact-columns research-columns"><div className="research-index"><small>INDEXED CORPUS</small><strong>374</strong><span>papers</span><hr /><p>Dense + lexical retrieval<br />Cross-encoder reranking<br />Citation checks</p></div><div className="research-answer"><small>GROUNDED SYNTHESIS</small><h4>Answers across papers, with sources attached.</h4><p>The agent retrieves evidence, synthesizes a response, then verifies cited paper IDs against the retrieved set.</p><div className="research-sources"><span><b>01</b> Retrieved source</span><span><b>02</b> Retrieved source</span><span><b>03</b> Retrieved source</span></div></div></div></Frame>
    <div className="artifact-foot">A presentation of the pipeline’s output, not a product interface.</div>
  </div>;
}
