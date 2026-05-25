import { Question } from '../config/diagnosticConfig';
export function SplitQuestion({question,value,onChange}:{question:Question; value:Record<string,number>; onChange:(v:Record<string,number>)=>void}){
  const total = Object.values(value||{}).reduce((a,b)=>a+(b||0),0);
  return <div className="card">
    <h2>{question.title}</h2><p className="muted">{question.subtitle}</p><div className={total===100?'total ok':'total'}>{total}% / 100%</div>
    {question.options.map(o=><label className="slider" key={o.id}><span><b>{o.label}</b><small>{o.badge || ''}</small><em>{o.description}</em></span><input type="range" min="0" max="100" step="5" value={value?.[o.id]||0} onChange={e=>onChange({...value,[o.id]:Number(e.target.value)})}/><strong>{value?.[o.id]||0}%</strong></label>)}
  </div>
}
