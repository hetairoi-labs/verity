# Payout Algorithm


For each goal i, Gemini returns structured output:

- **score** s_i ∈ [0, 5]
- **reasoning**: brief bullet points (what was good, what could improve)

Input: compressed transcript + system prompt + goal definitions.

---

## Step 2: Weighted aggregate score

```
S_goals = (∑ w_i × s_i) / (∑ w_i)
```

- w_i ∈ [0, 100]: weightage per goal (integer)
- S_goals ∈ [0, 5]

---

## Step 3: Blend with user ratings

```
r_avg = (1/N) × ∑ r_j    where r_j ∈ [0, 5]

S = α × S_goals + (1 − α) × r_avg
```

- α: weight for AI score vs user average (e.g. 0.7 for AI, 0.3 for users)
- S ∈ [0, 5]

If no user ratings exist, use S = S_goals.

---

## Step 4: Score → payout multiplier

**Base:** 0.4 (minimum payout).  
**Variable:** remaining 0.6 mapped from score.

### Sigmoid (smooth curve)

```
M = 0.4 + 0.6 × σ((S − μ) / τ)

σ(x) = 1 / (1 + e^(-x))
```

- μ = 2.5: midpoint for 0–5 scale
- τ: steepness (smaller = steeper, quicker to reach full payout)

Example: τ = 0.4 ⇒ S ≥ 4 (80%) yields M ≈ 0.99.

### Piecewise linear (80%+ = full payout)

```
M = 0.4 + 0.6 × min(1, max(0, S − S_min) / (S_full − S_min))
```

- S_min: score at which variable part starts (e.g. 2)
- S_full: score for full payout (e.g. 4)

| S | M |
|---|---|
| 0 | 0.4 |
| 2 | 0.4 |
| 4 | 1.0 |
| 5 | 1.0 |

---

## Full formula (sigmoid)

```
M = 0.4 + 0.6 × σ((α × S_goals + (1−α) × r_avg − 2.5) / τ)
```

**Parameters:**
- α: AI vs user weight (e.g. 0.7)
- τ: steepness (e.g. 0.3–0.5 for ~80%→full)
- μ = 2.5: midpoint for 0–5 scale
