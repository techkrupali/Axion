import { Question } from '../config/diagnosticConfig';
export function SingleQuestion({question,value,onChange}:{question:Question; value?:string; onChange:(v:string)=>void}){
  return <div className="card"><h2>{question.title}</h2><p className="muted">{question.subtitle}</p><div className="choices">{question.options.map(o=><button key={o.id} onClick={()=>onChange(o.id)} className={value===o.id?'choice active':'choice'}><b>{o.label}</b><span>{o.description}</span></button>)}</div></div>
}
