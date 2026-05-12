HROS  ·  AXIONINDEX

TECH TEAM PACKAGE  ·  DOCUMENT 16  ·  v1.0

Entitlements

& Plan Tier

Engineering Spec.

The single source of truth for what each plan tier unlocks, where entitlements are enforced, and how the paywall behaves. Consolidates fragmented entitlement logic from the Pricing & Packaging doc, the DDL Pack, the API Contract, and the Product Design Spec into one paste-ready engineering reference.

— FOREWORD

WHY THIS DOCUMENT EXISTS.

Three documents in the tech team package describe what each plan tier unlocks. They do not agree.

The Pricing & Packaging document (Doc 08) is canonical: three tiers — free, growth, enterprise — at ₹0, ₹24,999/month, and ₹2,49,000+/month. The DDL Pack (Doc 02) enforces this enum at the database level. The API Contract (Doc 03) defines the quota table that every endpoint reads from.

But the Product Design Spec (Doc 07) §7 still describes a four-tier model with a Starter tier at ₹4,999/month, and the BRD v2.0 (Doc 09) §19 references a "Starter / Growth / Enterprise / Services" structure. Both are superseded. Both predate the closure pack. Neither has been retracted in their own files, which is how engineering teams end up with three different plan_tier enums in three different parts of the codebase.

This document closes that gap. It states the canonical model once, maps every entitlement to a specific source-of-truth document, and tells the team exactly where and how the gate is enforced — at the database, at the API, and at the UI. After reading this, no engineer should have to guess what Starter means, whether overage is billed, or what happens to a customer's sixth entity when they downgrade from Growth to Free.

The doctrine is consistent with the rest of the platform: defensibility over cleverness. A misconfigured paywall is not a UX bug — it is a revenue contract that the system enforces on every request. We treat it with the same seriousness as the assessment pipeline itself.

— PART I

THE PLAN_TIER CONTRACT.

Three values. Lowercase. Defined in migration 0001. Adding a fourth requires a migration, not a config flag.

1.  The enum.

The plan_tier enum lives in app.plan_tier and is defined exactly once, in migration 0001_foundation.sql. The default value on app.organisations is 'free'. Every authenticated request carries the organisation's current plan_tier in the JWT app claim; every entitlement check resolves against this value.

2.  The three tiers at a glance.

What each tier is, who it is for, what it costs. Engineering does not negotiate any of these values; the billing system reads them from a single config that mirrors what appears on the public price page.

3.  Supersession map — what to ignore in older docs.

Several earlier documents in the package describe pricing or entitlements that have since been replaced. This table is exhaustive. If any other document conflicts with what is in §1 and §2 above, this document wins.

When in doubt: this document and Doc 08 (Pricing & Packaging Final v1.0) are the only two binding sources on plan tier behaviour. Everything else describes; these two enforce.

— PART II

THE ENTITLEMENT MATRIX.

What each tier unlocks. Read this as a contract: every cell is enforced in code, not negotiated in sales.

4.  Always-on — never gated.

The core compliance intelligence is identical across all three tiers. We do not gate the diagnosis. Every paying customer and every free user gets the same six-agent assessment, the same STUCK Protocol, the same posture dashboard. This is doctrine, not packaging: gating the diagnosis means a user cannot see their own compliance reality, which is the opposite of why we exist.

5.  Quotas — hard caps, no overage.

These are the numerical limits the system enforces. When a quota is hit, the system refuses the action — it does not bill overage, it does not silently downgrade quality, it does not queue past the limit. The customer is shown a one-click upgrade path. The reason is doctrinal: overage billing creates an incentive against using the product, which is exactly the wrong incentive for a compliance tool.

6.  Tier-gated features — what unlocks on upgrade.

Features that exist for paying tiers but are surfaced (with locked UX) on free. The principle is "never lock the diagnosis, always lock the prescription." A free user can see they have a problem; they upgrade to fix it.

7.  Enterprise-only — true differentiators.

Features that do not exist on free or growth. These are the reasons a Growth customer becomes an Enterprise customer; they are also the SLA-bearing surface of the platform.

— PART III

ENFORCEMENT ARCHITECTURE.

Three layers. Defence-in-depth. Each layer is a backstop for the layer above. None of them are optional.

Entitlement enforcement is not a single function call. It is a contract that traverses every layer of the system, from the browser down to the row-level security policy in Postgres. A misconfigured layer does not "almost work" — it creates a silent privilege-escalation path that the team will discover the day a free-tier customer screenshots their unblocked Enterprise feature.

The defence-in-depth ordering is deliberate. The frontend is the worst place to enforce entitlement (it is in the user's control); the database is the best (it cannot be bypassed). Engineering implements all three; if any one of them is bypassed, the others still hold.

8.  Layer 1 — Postgres (the wall).

The database is the last line of defence and the only one that cannot be bypassed. Three mechanisms work together here.

8.1  Usage metering — atomic counters.

The app.usage_metering table holds one row per (org_id, period, metric). Each row carries a counter and a period_end. Counters are incremented in the same transaction as the action they meter — never in a separate API call, never asynchronously. Atomicity is the point: a race where two concurrent requests both pass the quota check and both succeed is the failure mode this table prevents.

8.2  Entity-count enforcement — CHECK + trigger.

Active entities is the most-tested quota and the one most likely to break under concurrent inserts. The database enforces this via a BEFORE INSERT trigger on app.entities that consults the org's plan_tier and rejects the insert if the count would exceed the cap.

8.3  RLS — feature isolation by tier.

A small set of features (webhook endpoints, custom report templates, white-label settings) live in tier-restricted tables. RLS policies on these tables read the requesting org's plan_tier from the JWT and deny access at the row level — the table simply returns zero rows for an unentitled caller. This means a free-tier user who bypasses the API and hits Postgres directly via a leaked service key still cannot read or write Enterprise-only configuration.

9.  Layer 2 — API handlers (the gatekeeper).

Every state-changing endpoint runs through two checks before the database is touched: an entitlement check (does this tier have access to this feature at all?) and a quota check (has the metering counter reached the cap?). Both checks must succeed or the handler returns before mutating state.

9.1  The two error codes.

The error taxonomy is already defined in API Contract Doc 03 §22. Engineering must use these exact codes — they drive frontend behaviour:

9.2  The four response headers.

On every authenticated response, the API emits four headers that let the frontend render quota state without a separate "what is my usage" round-trip. Frontend should cache these per session and use them to render the soft-cap banner at 80%.

9.3  The entitlement middleware pattern.

Each handler declares its required tier and required quota metric as metadata. A single middleware reads the JWT plan_tier, evaluates the requirements, and short-circuits the request before the handler runs. This pattern is non-negotiable — engineering does not inline entitlement checks inside handlers.

10.  Layer 3 — Frontend (the UX).

The frontend never decides entitlement. It renders state. Two API calls drive the entire client-side entitlement experience:

10.1  The locked-state component contract.

There is a single <LockedFeature> component. Every gated surface renders through it. The contract is fixed:

— PART IV

THE TWO PAYWALL PATTERNS.

Soft gate creates upgrade intent. Hard cap creates upgrade necessity. Conflating them produces a product that either churns or never converts.

11.  Pattern A — Soft gate (reveal).

Used for: tier-gated features (the Communication Templates Library, grade-wise wage analysis, CTC Structure Builder, TEO export, multi-entity, real-time amendment alerts). The principle: never lock the diagnosis, always lock the prescription.

The user sees the feature exists. They see it would help them. They cannot use it on their current tier. The locked state itself is the upgrade pitch — it shows what they are missing, in context, at the exact moment they tried to reach for it.

12.  Pattern B — Hard cap (block).

Used for: quota-bound resources (entities, assessments per month, workers per entity, PDF reports, webhook endpoints). The principle: the cap is a wall, not a meter. The system does not bill overage, does not silently degrade quality, does not queue past the limit.

Up to 80% of cap, the system behaves normally. At 80%, a soft-cap banner appears in the relevant surface ("4/5 entities used — upgrade to add more"). At 100%, the next create operation is blocked with a 429 quota_exceeded response and an inline upgrade path. Existing data is never affected — only new creates fail.

13.  Pattern decision matrix.

Engineering disagreement on which pattern applies to a given feature is the most common source of paywall bugs. The table below resolves it: every feature in the matrix maps to exactly one pattern.

— PART V

QUOTA MECHANICS & EXCEPTIONS.

14.  Period boundaries and counter resets.

Quotas are bounded by the billing period, not by calendar month. A customer on the monthly Growth plan whose billing date is the 18th has their assessment counter reset on the 18th of each month. Engineering reads the period_start and period_end from app.subscriptions and stores them on app.usage_metering at the moment a metric is first written.

15.  The soft-cap warning band.

Between 80% and 100% of cap, the system is in a warning band. The API still permits the action, but every response carries an additional header — X-Quota-Soft-Cap-Reached: true — and the frontend renders the soft-cap banner. This band is not a grace period; it is a "you are about to hit the wall" signal that gives the customer time to upgrade before the wall arrives.

16.  The inspector pack exception.

Growth tier includes 2 inspector packs per year. A customer who needs a third must either upgrade to Enterprise (the correct answer for anyone generating 3+ inspector packs per year) or pay a one-time ₹50,000 fee for an additional pack while remaining on Growth.

Engineering implementation: the one-time fee creates an entry in app.one_time_charges with type = 'inspector_pack_overflow' and increments a separate counter (inspector_pack_overflow_count). This counter does not contribute to the recurring subscription; it is invoiced via Razorpay/Stripe one-time payment, recorded in the same audit fragment as the inspector pack generation, and surfaces in the customer's invoice history as a distinct line item.

— PART VI

MIGRATION, UPGRADE, DOWNGRADE.

plan_tier transitions are state machines, not billing webhooks. Treat them with the seriousness of a schema migration.

17.  Upgrade paths — Free→Growth, Growth→Enterprise.

Upgrades take effect immediately on payment confirmation. The plan_tier column is updated in the same transaction as the subscription row insert; the JWT is invalidated and re-minted on the next request; the customer sees unlocked features within seconds.

18.  Downgrade paths — Growth→Free, Enterprise→Growth.

Downgrades never take effect immediately. They are deferred to the end of the current billing period (or the contract anniversary for Enterprise). Between the downgrade request and the effective date, the customer remains on the higher tier with full access.

On the effective date, the system runs the downgrade state machine. This is the most complex transition in the platform and engineering must implement it as an explicit state machine, not as a series of webhook handlers.

19.  The downgrade state machine.

When a downgrade becomes effective, engineering runs the following sequence — atomically, in a single transaction where possible:

— PART VII

IMPLEMENTATION CHECKLIST.

Twenty-two items across four work streams. Every item is binary — done or not done. Nothing here is open to interpretation.

20.  Database (Backend).

21.  API (Backend).

22.  Frontend.

23.  Billing.

— APPENDIX

REFERENCE.

A.  The entitlements object — JSON shape.

Returned by GET /v1/organisations/me. The single shape the frontend consumes for all entitlement decisions.

B.  feature_id catalogue.

Canonical IDs used across the platform. Add new IDs via migration; never inline-string-literal a feature_id in code.

C.  Cross-reference index.

Where to look when this document does not answer your question.

PACKAGE STATUS

Tech Team Package — Document 16 of 16. Closes the entitlement gap. Engineering can configure billing, build the paywall, and ship plan_tier transitions against this document and Doc 08 alone.

HROS  ·  AxionIndex  ·  Bengaluru  ·  MMXXVI

End of Document 16  ·  End of Tech Team Package