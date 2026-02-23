# Payout Algorithm

For each session, the judge produces a payout multiplier M ∈ [0.25, 1.0] from a transcript and goals. Optionally blends with participant ratings and historical reputation.

---

## Step 1: AI scoring

Gemini receives the transcript and goal definitions. For each goal, it returns:

- **goal**: short key (e.g. `Topic coverage`, `Depth`)
- **score** s_i ∈ [0, 5]
- **reasoning**: brief bullet points (what was good, what could improve)
- **improvements**: scope for improvements if any

Input format: `## Goals to evaluate` + goals block + `## Transcript` + transcript.

Goal definitions use: `• <key> (weight: N):` (e.g. `• Topic coverage (weight: 40): Target: 5 meetings...`).

---

## Step 2: Weighted aggregate score

```
S_goals = (∑ w_i × s_i) / (∑ w_i)
```

- w_i: weight per goal (integer, parsed from `(weight: N)`)
- Goal keys are matched by the part before ` (weight: `
- If no goals match, S_goals = 0

---

## Step 3: Compute α (AI vs user weight)

α ∈ [0.5, 1]. Higher α = more weight on AI score.

- If `ratings.count === 0` → α = 1 (AI only).
- Otherwise, start at α = 0.95:
  - `α -= 0.35 × min(1, count/8)` — more participant ratings → lower α (trust users more)
  - `α -= 0.05 × min(1, sessionCount/20)` — more historical sessions → lower α
  - If reputation exists:
    - `avgScore < 2` → `α += 0.05` (trust AI more when past scores are low)
    - `avgScore ≥ 3.5` → `α -= 0.05` (trust users more when past scores are high)
  - Clamp to [0.5, 1]

---

## Step 4: Blend with participant ratings

```
S = α × S_goals + (1 − α) × r_avg    when ratings exist and α < 1
S = S_goals                           otherwise
```

- r_avg: `ratings.average` (participant average, 0–5)
- Blend applies when: `ratings.count > 0`, `ratings.average ≥ 0`, and `α < 1`

---

## Step 5: Score → payout multiplier

```
M = 0.25 + 0.75 × σ((S − 2.5) / τ)

σ(x) = 1 / (1 + e^(-x))
```

- **μ = 2.5**: midpoint of 0–5 scale
- **τ = 0.3**: steepness (smaller = steeper)
- **M ∈ [0.25, 1.0]**: minimum payout 25%, full payout at 100%

| S | M (approx) |
|---|------------|
| 0 | 0.25 |
| 2.5 | 0.625 |
| 5 | 1.0 |

---

## Inputs

| Param | Type | Description |
|-------|------|-------------|
| transcript | string | Session transcript |
| goals | string | Goal definitions with `• key (weight: N):` format |
| ratings | optional | `{ average, count }` — participant ratings |
| reputation | optional | `{ avgScore, sessionCount }` — host history |

---

## Outputs

| Field | Description |
|-------|-------------|
| raw | Per-goal: `{ goal, score, reasoning, improvements }` |
| aggregate | S_goals (weighted avg 0–5) |
| final | S (after optional blend) |
| multiplier | M (0.25–1.0) |
