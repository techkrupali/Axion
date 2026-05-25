export type IndexType = 'alignment' | 'replaceability' | 'brainpower' | 'oda';
export type QuestionType = 'split' | 'single';

export interface Option { id: string; label: string; description: string; coefficient?: number; score?: number; badge?: string; }
export interface Question { id: string; title: string; subtitle: string; type: QuestionType; options: Option[]; }

export const INDEX_DEFINITIONS: Record<IndexType, { name: string; audience: string; reportTitle: string; framing: string; weights?: Partial<Record<string, number>> }> = {
  alignment: {
    name: 'AI Alignment Index™', audience: 'Students / Early Career', reportTitle: 'AI Alignment Report',
    framing: 'Measures judgment readiness in an AI-compressed work world.',
    weights: { judgmentDensity: 0.42, outputProtection: 0.20, consequenceSignal: 0.13, impactScore: 0.10, growthSignal: 0.15 }
  },
  replaceability: {
    name: 'AI Replaceability Index™', audience: 'Working Professionals', reportTitle: 'AI Edge Diagnostic Report',
    framing: 'Measures how structurally scarce your work remains when intelligence becomes cheap.',
    weights: { judgmentDensity: 0.40, outputProtection: 0.25, consequenceSignal: 0.20, impactScore: 0.10, growthSignal: 0.05 }
  },
  brainpower: {
    name: 'Brainpower Density Index™', audience: 'CXOs / Senior Leaders', reportTitle: 'Brainpower Density Report',
    framing: 'Measures leadership leverage, judgment density, and consequence ownership in AI-first organisations.',
    weights: { judgmentDensity: 0.38, outputProtection: 0.15, consequenceSignal: 0.22, impactScore: 0.15, growthSignal: 0.10 }
  },
  oda: {
    name: 'Organisation Decision Architecture™', audience: 'Organisations', reportTitle: 'Organisation Decision Architecture Report',
    framing: 'Measures where decision rights, judgment ownership, and AI compression sit across the organisation.',
    weights: { judgmentDensity: 0.32, outputProtection: 0.18, consequenceSignal: 0.20, impactScore: 0.20, growthSignal: 0.10 }
  }
};

export const QUESTIONS: Question[] = [
  { id: 'q1_workType', title: 'Work Type Distribution', subtitle: 'How does your work time actually distribute across these six types? Allocate 100%.', type: 'split', options: [
    { id: 'research', label: 'Research', description: 'Gathering, scanning, synthesising information.', coefficient: 0.88, badge: 'AI-DOMINANT' },
    { id: 'analysis', label: 'Analysis', description: 'Structuring data, modelling, identifying patterns.', coefficient: 0.58, badge: 'AI-ASSISTED' },
    { id: 'insighting', label: 'Insighting', description: 'Novel conclusions that re-frame the next question.', coefficient: 0.12, badge: 'AI-PROOF' },
    { id: 'framing', label: 'Framing', description: 'Defining the right problem before work begins.', coefficient: 0.05, badge: 'AI-PROOF' },
    { id: 'deciding', label: 'Deciding & Directing', description: 'Making calls, owning consequence, setting direction.', coefficient: 0.08, badge: 'AI-PROOF' },
    { id: 'executing', label: 'Executing & Coordinating', description: 'Structured output, coordination, documentation, delivery.', coefficient: 0.85, badge: 'AI-DOMINANT' }
  ]},
  { id: 'q2_sto', title: 'Organisational Layer', subtitle: 'Where in the organisation does your work actually sit? Allocate 100%.', type: 'split', options: [
    { id: 'strategic', label: 'Strategic', description: 'Determining what the organisation should become.', coefficient: 0.95, badge: 'AI-PROOF' },
    { id: 'tactical', label: 'Tactical', description: 'Translating strategy into executable decisions.', coefficient: 0.58, badge: 'AI-ASSISTED' },
    { id: 'operational', label: 'Operational', description: 'Executing within defined parameters.', coefficient: 0.15, badge: 'AI-DOMINANT' }
  ]},
  { id: 'q3_impact', title: 'Impact Boundary', subtitle: 'Across which levels does your work create primary consequence? Allocate 100%.', type: 'split', options: [
    { id: 'self', label: 'Self only', description: 'Your individual output.', coefficient: 0.05 }, { id: 'team', label: 'Team', description: 'Immediate team outcomes.', coefficient: 0.22 }, { id: 'department', label: 'Department', description: 'Cross-team decisions.', coefficient: 0.48 }, { id: 'function', label: 'Function', description: 'Whole-function impact.', coefficient: 0.75 }, { id: 'enterprise', label: 'Enterprise', description: 'Organisation-wide / market consequence.', coefficient: 1.0 }
  ]},
  { id: 'q4_time', title: 'Decision Time Horizon', subtitle: 'Across which time horizons do your decisions operate? Allocate 100%.', type: 'split', options: [
    { id: 'day', label: 'Day to Day', description: 'Operational decisions this week.', coefficient: 0.90 }, { id: 'monthly', label: 'Monthly', description: 'Near-term planning.', coefficient: 0.70 }, { id: 'quarterly', label: 'Quarterly', description: 'Tactical priority-setting.', coefficient: 0.45 }, { id: 'annual', label: 'Annual', description: 'Strategic direction.', coefficient: 0.20 }, { id: 'multiyear', label: 'Multi-year', description: 'Org design / market bets.', coefficient: 0.05 }
  ]},
  { id: 'q5_judgment', title: 'Judgment Ownership', subtitle: 'How is judgment actually owned across your work? Allocate 100%.', type: 'split', options: [
    { id: 'own', label: 'I own the judgment', description: 'The call is mine.', coefficient: 1.0 }, { id: 'lead', label: 'I lead the judgment', description: 'I synthesise and propose direction.', coefficient: 0.72 }, { id: 'contribute', label: 'I contribute to judgment', description: 'Others make the final call.', coefficient: 0.38 }, { id: 'execute', label: 'I execute on judgment', description: 'I implement decisions made elsewhere.', coefficient: 0.12 }
  ]},
  { id: 'q6_thinking', title: 'Thinking Ownership', subtitle: 'Where does the original thinking come from? Allocate 100%.', type: 'split', options: [
    { id: 'original', label: 'Original thinking', description: 'I create the frame from first principles.', coefficient: 1.0 }, { id: 'adaptive', label: 'Adaptive thinking', description: 'I adapt frameworks with judgment.', coefficient: 0.75 }, { id: 'synthesis', label: 'Synthesis', description: 'I connect multiple sources.', coefficient: 0.40 }, { id: 'application', label: 'Application & Execution', description: 'I apply established methods.', coefficient: 0.12 }
  ]},
  { id: 'q7_consequence', title: 'Consequence Visibility', subtitle: 'When decisions you influence go wrong, how visible is your accountability?', type: 'single', options: [
    { id: 'a', label: 'Not visible', description: 'Accountability sits clearly elsewhere.', score: 0 }, { id: 'b', label: 'Indirect', description: 'I contributed but others carry the outcome.', score: 25 }, { id: 'c', label: 'Shared', description: 'I am one of several accountable parties.', score: 50 }, { id: 'd', label: 'Direct', description: 'The outcome is primarily attributed to me.', score: 75 }, { id: 'e', label: 'Explicit and attributable', description: 'My name is on it.', score: 100 }
  ]},
  { id: 'q8_edgeMirror', title: 'The Edge Mirror', subtitle: 'If AI generated your structured output for six months, what would happen?', type: 'single', options: [
    { id: 'a', label: 'My value would significantly reduce', description: 'Most of what I do would be covered.', score: 0 }, { id: 'b', label: 'My output would look similar', description: 'I could review and refine AI output.', score: 25 }, { id: 'c', label: 'My role would shift', description: 'More judgment, less production.', score: 50 }, { id: 'd', label: 'My leverage would increase', description: 'Less output, more direction.', score: 75 }, { id: 'e', label: 'My core contribution would be unchanged', description: 'It was never about output.', score: 100 }
  ]},
  { id: 'q9_scope', title: 'Scope Evolution', subtitle: 'How has your role changed over the past 24 months?', type: 'single', options: [
    { id: 'a', label: 'Scope has compressed', description: 'Fewer decisions owned; narrower authority.', score: 0 }, { id: 'b', label: 'Scope has diffused', description: 'Broader coverage but shallower depth.', score: 25 }, { id: 'c', label: 'Scope has held steady', description: 'Similar authority and visibility.', score: 50 }, { id: 'd', label: 'Title elevated, enablement lagging', description: 'Authority implied but not fully held.', score: 60 }, { id: 'e', label: 'Genuine expansion', description: 'More consequential judgment and visibility.', score: 100 }
  ]},
  { id: 'q10_momentum', title: 'Momentum', subtitle: 'Has your work shifted toward more judgment ownership this year?', type: 'single', options: [
    { id: 'a', label: 'Scope narrowed', description: 'More defined, structured work.', score: 0 }, { id: 'b', label: 'Stayed largely the same', description: 'Holding trajectory.', score: 25 }, { id: 'c', label: 'Slight expansion', description: 'Marginally more judgment work.', score: 50 }, { id: 'd', label: 'Meaningful expansion', description: 'Decision boundary clearly grown.', score: 75 }, { id: 'e', label: 'Significant expansion', description: 'New domains of consequence and judgment.', score: 100 }
  ]}
];
