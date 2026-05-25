import jsPDF from 'jspdf';
import { INDEX_DEFINITIONS, IndexType } from '../config/diagnosticConfig';
import { Answers, Profile, scoreDiagnostic } from '../engine/scoring';
export function buildReport(indexType: IndexType, answers: Answers, profile: Profile={}) {
  const result = scoreDiagnostic(indexType, answers, profile);
  const definition = INDEX_DEFINITIONS[indexType];
  const primaryGap = result.gaps[0];
  return {
    meta: { title: definition.reportTitle, index: definition.name, audience: definition.audience, generatedAt: new Date().toISOString() },
    summary: {
      name: profile.name || 'Respondent', role: profile.role || '', score: result.score, range: result.range, band: result.band, archetype: result.archetype, direction: result.direction,
      narrative: `${definition.framing} Your current structural reading is ${result.band}, with the strongest signal around ${result.archetype}.`
    },
    components: result.components,
    crossSignals: result.crossSignals,
    actionPlan: [
      { priority: 'Priority 1', title: `Improve ${primaryGap.dimension}`, action: actionFor(primaryGap.dimension) },
      { priority: 'Priority 2', title: 'Shift time allocation', action: 'Reduce recurring output and increase framing, deciding, and consequence-visible work.' },
      { priority: 'Priority 3', title: 'Create a 90-day evidence trail', action: 'Document decisions owned, assumptions made, consequences carried, and business outcomes influenced.' }
    ],
    disclaimer: 'Benchmarks and coefficients are hypothesis-based until empirical validation is complete.'
  };
}
export function downloadPdfReport(indexType: IndexType, answers: Answers, profile: Profile={}) {
  const report = buildReport(indexType, answers, profile);
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const left = 48; let y = 56;
  doc.setFont('helvetica','bold'); doc.setFontSize(18); doc.text(report.meta.title, left, y);
  y += 28; doc.setFontSize(11); doc.setFont('helvetica','normal'); doc.text(`${report.meta.index} · ${report.meta.audience}`, left, y);
  y += 42; doc.setFont('helvetica','bold'); doc.setFontSize(34); doc.text(String(report.summary.score), left, y);
  doc.setFontSize(12); doc.text(`${report.summary.band} — ${report.summary.archetype}`, left+90, y-10); doc.text(`Range: ${report.summary.range}`, left+90, y+10);
  y += 42; doc.setFont('helvetica','normal'); doc.setFontSize(11); split(doc, report.summary.narrative, left, y, 500); y += 72;
  doc.setFont('helvetica','bold'); doc.text('Component Scores', left, y); y += 20; doc.setFont('helvetica','normal');
  Object.entries(report.components).slice(-5).forEach(([k,v])=>{ doc.text(`${label(k)}: ${v}`, left, y); y+=18; });
  y += 18; doc.setFont('helvetica','bold'); doc.text('Cross-Signal', left, y); y+=20; doc.setFont('helvetica','normal'); split(doc, report.crossSignals.stoWork + ' ' + report.crossSignals.judgmentThinking, left, y, 500); y+=60;
  doc.setFont('helvetica','bold'); doc.text('90-Day Action Plan', left, y); y+=22; doc.setFont('helvetica','normal');
  report.actionPlan.forEach(a=>{ split(doc, `${a.priority}: ${a.title} — ${a.action}`, left, y, 500); y+=44; });
  doc.save(`${report.meta.index.replace(/[^a-z0-9]/gi,'-').toLowerCase()}-report.pdf`);
}
function actionFor(d:string){ const map: Record<string,string> = { judgmentDensity:'Move from contribution to owned calls. Ask for decision rights, not just more work.', outputProtection:'Use AI to collapse production time and reallocate saved time into framing and consequence-bearing decisions.', consequenceSignal:'Make accountability visible. Put your name against decisions, assumptions, and outcomes.', impactScore:'Increase the boundary of impact from self/team to function or enterprise.', growthSignal:'Create role expansion through new decision domains and higher consequence visibility.' }; return map[d] || 'Increase scarce judgment work and reduce compressible output work.'; }
function label(s:string){ return s.replace(/([A-Z])/g,' $1').replace(/^./,c=>c.toUpperCase()); }
function split(doc: jsPDF, text:string, x:number, y:number, w:number){ doc.splitTextToSize(text, w).forEach((line:string,i:number)=>doc.text(line,x,y+i*15)); }
