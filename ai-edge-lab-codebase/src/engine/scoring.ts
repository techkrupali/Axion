import { INDEX_DEFINITIONS, IndexType, QUESTIONS } from '../config/diagnosticConfig';
export type Answers = Record<string, Record<string, number> | string>;
export interface Profile { name?: string; role?: string; experienceBand?: '0-3'|'4-7'|'8-12'|'13-20'|'20+'; managementYears?: number; }
const q = (id:string)=> QUESTIONS.find(x=>x.id===id)!;
const splitScore = (answers: Answers, qid: string, invert=false) => {
  const ans = (answers[qid] || {}) as Record<string, number>;
  const question = q(qid);
  const weighted = question.options.reduce((sum,o)=>sum + ((ans[o.id]||0) * (o.coefficient ?? 0)),0);
  return invert ? 100 - weighted : weighted;
};
const singleScore = (answers: Answers, qid: string) => {
  const choice = answers[qid] as string | undefined;
  return q(qid).options.find(o=>o.id===choice)?.score ?? 0;
};
const allocation = (answers: Answers, qid: string, ids: string[]) => ids.reduce((s,id)=>s+(((answers[qid]||{}) as Record<string,number>)[id]||0),0);
export function scoreDiagnostic(indexType: IndexType, answers: Answers, profile: Profile={}) {
  const workTypeCompression = splitScore(answers, 'q1_workType');
  const workTypeAIProof = 100 - workTypeCompression;
  const judgmentWorkAllocation = allocation(answers, 'q1_workType', ['insighting','framing','deciding']);
  const stoScore = splitScore(answers, 'q2_sto');
  const impactScore = splitScore(answers, 'q3_impact');
  const timeHorizonScore = splitScore(answers, 'q4_time', true);
  const judgmentOwnership = splitScore(answers, 'q5_judgment');
  const thinkingOwnership = splitScore(answers, 'q6_thinking');
  const consequenceVisibility = singleScore(answers, 'q7_consequence');
  const edgeMirror = singleScore(answers, 'q8_edgeMirror');
  const scopeEvolution = singleScore(answers, 'q9_scope');
  const momentum = singleScore(answers, 'q10_momentum');
  const judgmentDensity = workTypeAIProof*0.25 + judgmentOwnership*0.38 + thinkingOwnership*0.25 + stoScore*0.12;
  const outputExposure = workTypeCompression*0.55 + (100 - timeHorizonScore)*0.45;
  const consequenceSignal = (edgeMirror + consequenceVisibility) / 2;
  const growthSignal = momentum*0.55 + scopeEvolution*0.45;
  const weights = INDEX_DEFINITIONS[indexType].weights!;
  const rawEdgeScore = judgmentDensity*weights.judgmentDensity! + (100-outputExposure)*weights.outputProtection! + consequenceSignal*weights.consequenceSignal! + impactScore*weights.impactScore! + growthSignal*weights.growthSignal!;
  const multiplier = ({'0-3':0.80,'4-7':0.90,'8-12':1.00,'13-20':1.05,'20+':1.08} as const)[profile.experienceBand || '8-12'];
  const interpretedScore = Math.max(0, Math.min(100, rawEdgeScore * multiplier));
  return {
    indexType, profile, score: round(interpretedScore), rawScore: round(rawEdgeScore), range: `${Math.max(0,Math.round(interpretedScore-5))}-${Math.min(100,Math.round(interpretedScore+5))}`,
    band: band(interpretedScore), archetype: archetype(interpretedScore, judgmentDensity, growthSignal, outputExposure), direction: direction(growthSignal),
    components: Object.fromEntries(Object.entries({workTypeCompression, workTypeAIProof, judgmentWorkAllocation, stoScore, impactScore, timeHorizonScore, judgmentOwnership, thinkingOwnership, consequenceVisibility, edgeMirror, scopeEvolution, momentum, judgmentDensity, outputExposure, consequenceSignal, growthSignal}).map(([k,v])=>[k,round(v as number)])),
    gaps: rankGaps({judgmentDensity, outputProtection:100-outputExposure, consequenceSignal, impactScore, growthSignal}),
    crossSignals: crossSignals(answers)
  };
}
function round(n:number){ return Math.round(n*10)/10; }
function band(s:number){ if(s>=75) return 'Edge Accelerating'; if(s>=50) return 'Edge Holding'; return 'Edge Thinning'; }
function direction(g:number){ if(g>=70) return 'Accelerating'; if(g>=40) return 'Holding'; return 'Thinning'; }
function archetype(s:number,jd:number,g:number,oe:number){ if(s>=75 && jd>=70 && g>=70) return 'Boundary Builder'; if(s>=75) return 'Structural Architect'; if(s>=50 && jd>=65 && g<50) return 'Position Defender'; if(s>=50) return 'Transition Navigator'; if(oe>=65) return 'Compression Exposed'; return 'Execution Anchor'; }
function rankGaps(obj:Record<string,number>){ return Object.entries(obj).sort((a,b)=>a[1]-b[1]).map(([dimension,score])=>({dimension, score:round(score)})); }
function topKey(ans:any){ return Object.entries(ans||{}).sort((a:any,b:any)=>b[1]-a[1])[0]?.[0]; }
function crossSignals(answers: Answers){
  const wt = topKey(answers.q1_workType); const sto = topKey(answers.q2_sto);
  const judgmentMode = topKey(answers.q5_judgment); const thinkingMode = topKey(answers.q6_thinking);
  const stoWork = sto==='operational' && ['research','executing'].includes(wt) ? 'Operational + AI-dominant: highest compression exposure.' : sto==='strategic' && ['framing','deciding','insighting'].includes(wt) ? 'Strategic + AI-proof: strongest protection signal.' : sto==='strategic' && ['research','executing'].includes(wt) ? 'Strategic title / compressible activity mismatch.' : sto==='operational' && ['framing','deciding','insighting'].includes(wt) ? 'Under-leveraged judgment at operational layer.' : 'Mixed work-layer signal.';
  const jt = ['own','lead'].includes(judgmentMode) && ['original','adaptive'].includes(thinkingMode) ? 'Strong judgment-thinking ownership.' : 'Judgment-thinking gap: increase original framing and owned calls.';
  return { dominantWorkType: wt, dominantSTO: sto, stoWork, judgmentThinking: jt };
}
