import { INDEX_DEFINITIONS, IndexType } from "@/config/diagnosticConfig";
import { Answers, Profile, scoreDiagnostic } from "@/engine/scoring";

export function buildReport(indexType: IndexType, answers: Answers, profile: Profile = {}) {
  const result = scoreDiagnostic(indexType, answers, profile);
  const definition = INDEX_DEFINITIONS[indexType];
  const primaryGap = result.gaps[0];

  return {
    meta: {
      title: definition.reportTitle,
      index: definition.name,
      audience: definition.audience,
      generatedAt: new Date().toISOString(),
    },
    summary: {
      name: profile.name || "Respondent",
      role: profile.role || "",
      score: result.score,
      range: result.range,
      band: result.band,
      archetype: result.archetype,
      direction: result.direction,
      narrative: `${definition.framing} Your current structural reading is ${result.band}, with the strongest signal around ${result.archetype}.`,
    },
    components: result.components,
    crossSignals: result.crossSignals,
    actionPlan: [
      { priority: "Priority 1", title: `Improve ${primaryGap.dimension.replace(/([A-Z])/g, " $1")}`, action: actionFor(primaryGap.dimension) },
      { priority: "Priority 2", title: "Shift time allocation", action: "Reduce recurring output and increase framing, deciding, and consequence-visible work." },
      { priority: "Priority 3", title: "Create a 90-day evidence trail", action: "Document decisions owned, assumptions made, consequences carried, and business outcomes influenced." },
    ],
    disclaimer: "Benchmarks and coefficients are hypothesis-based until empirical validation is complete.",
  };
}

function actionFor(d: string): string {
  const map: Record<string, string> = {
    judgmentDensity: "Move from contribution to owned calls. Ask for decision rights, not just more work.",
    outputProtection: "Use AI to collapse production time and reallocate saved time into framing and consequence-bearing decisions.",
    consequenceSignal: "Make accountability visible. Put your name against decisions, assumptions, and outcomes.",
    impactScore: "Increase the boundary of impact from self/team to function or enterprise.",
    growthSignal: "Create role expansion through new decision domains and higher consequence visibility.",
  };
  return map[d] || "Increase scarce judgment work and reduce compressible output work.";
}
