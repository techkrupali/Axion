import React, {useMemo, useState} from 'react';
import { createRoot } from 'react-dom/client';
import { INDEX_DEFINITIONS, IndexType, QUESTIONS } from './config/diagnosticConfig';
import { Answers, scoreDiagnostic } from './engine/scoring';
import { downloadPdfReport } from './report/reportGenerator';
import { SplitQuestion } from './components/SplitQuestion';
import { SingleQuestion } from './components/SingleQuestion';
import './styles.css';
const emptySplit = (qid:string)=>Object.fromEntries(QUESTIONS.find(q=>q.id===qid)!.options.map(o=>[o.id,0]));
function App(){
  const [indexType,setIndexType]=useState<IndexType>('replaceability');
  const [step,setStep]=useState(0);
  const [profile,setProfile]=useState({name:'', role:'', experienceBand:'8-12' as any});
  const [answers,setAnswers]=useState<Answers>({});
  const question = QUESTIONS[step];
  const result = useMemo(()=>scoreDiagnostic(indexType, answers, profile),[indexType,answers,profile]);
  const isSplit = question?.type==='split';
  const isValid = !question ? true : isSplit ? Object.values((answers[question.id]||{}) as Record<string,number>).reduce((a,b)=>a+b,0)===100 : Boolean(answers[question.id]);
  return <main>
    <header className="hero"><div><p className="eyebrow">THE AI EDGE LAB</p><h1>{INDEX_DEFINITIONS[indexType].name}</h1><p>{INDEX_DEFINITIONS[indexType].framing}</p></div><div className="score"><span>{result.score}</span><small>{result.band}</small></div></header>
    <section className="panel indexbar">{Object.entries(INDEX_DEFINITIONS).map(([k,v])=><button key={k} className={indexType===k?'tab active':'tab'} onClick={()=>setIndexType(k as IndexType)}>{v.name}<small>{v.audience}</small></button>)}</section>
    {step===0 && <section className="panel profile"><input placeholder="Name" value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})}/><input placeholder="Role" value={profile.role} onChange={e=>setProfile({...profile,role:e.target.value})}/><select value={profile.experienceBand} onChange={e=>setProfile({...profile,experienceBand:e.target.value as any})}><option value="0-3">0–3 yrs</option><option value="4-7">4–7 yrs</option><option value="8-12">8–12 yrs</option><option value="13-20">13–20 yrs</option><option value="20+">20+ yrs</option></select></section>}
    {question.type==='split' ? <SplitQuestion question={question} value={(answers[question.id] as any)||emptySplit(question.id)} onChange={v=>setAnswers({...answers,[question.id]:v})}/> : <SingleQuestion question={question} value={answers[question.id] as string} onChange={v=>setAnswers({...answers,[question.id]:v})}/>} 
    <section className="nav"><button disabled={step===0} onClick={()=>setStep(step-1)}>Back</button><span>{step+1} / {QUESTIONS.length}</span>{step<QUESTIONS.length-1?<button disabled={!isValid} onClick={()=>setStep(step+1)}>Next</button>:<button disabled={!isValid} onClick={()=>downloadPdfReport(indexType,answers,profile)}>Generate PDF Report</button>}</section>
    <section className="results panel"><h3>Live Diagnostic Read</h3><div className="grid"><Metric label="Judgment Density" value={result.components.judgmentDensity}/><Metric label="Output Exposure" value={result.components.outputExposure}/><Metric label="Consequence Signal" value={result.components.consequenceSignal}/><Metric label="Impact Score" value={result.components.impactScore}/><Metric label="Growth Signal" value={result.components.growthSignal}/></div><p className="muted">{result.crossSignals.stoWork} {result.crossSignals.judgmentThinking}</p></section>
  </main>
}
function Metric({label,value}:{label:string;value:number}){return <div className="metric"><span>{value}</span><small>{label}</small></div>}
createRoot(document.getElementById('root')!).render(<App/>);
