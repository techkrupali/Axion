# AI Edge Lab Diagnostic Codebase

This is a production-ready starter implementation for:

- AI Alignment Index™ — students / early career
- AI Replaceability Index™ — professionals
- Brainpower Density Index™ — CXOs / senior leaders
- Organisation Decision Architecture™ — organisations

## Run

```bash
npm install
npm run dev
```

## What is included

- `src/config/diagnosticConfig.ts` — all question definitions, coefficients, answer options, and index variants.
- `src/engine/scoring.ts` — scoring engine, Edge Score, component scores, bands, archetypes, direction, and cross-signals.
- `src/report/reportGenerator.ts` — structured report object and browser PDF generation using jsPDF.
- `src/App.tsx` — React diagnostic wizard with live scoring.
- `src/styles.css` — Axion black/gold/white visual system.

## Implementation Notes

The coefficients are hypothesis-based and should be validated once real respondent data is available. Keep the engine deterministic. Do not let the UI own scoring logic.
