# Chainlink CRE Hackathon — First Prize Strategy

**Deadline:** March 8, 11:59 PM ET  
**Track:** CRE & AI  
**Goal:** Win first prize by demonstrating CRE as an orchestration layer with AI integration

---

## What Judges Look For

1. **CRE as core orchestration** — not just a peripheral tool
2. **Real-world use case** — solves an actual problem, not a toy demo
3. **Working demonstration** — simulation or live deployment
4. **Code quality & clarity** — easy to understand and evaluate
5. **AI + blockchain integration** — meaningful combination, not bolted-on

---

## Submission Requirements Checklist

- [ ] 3-5 minute video showing workflow execution or CLI simulation
- [ ] Public GitHub repo with source code
- [ ] README with links to all Chainlink-related files
- [ ] Problem statement + solution explanation + CRE usage description

---

## 48-Hour Execution Plan

### Phase 1: Define the Narrative (2 hours)

**Pick a problem that:**
- Has clear real-world relevance (DeFi, automation, verification)
- Benefits from AI decision-making + blockchain execution
- Can be demonstrated end-to-end in 3-5 minutes

**Strong angles for CRE + AI:**
- AI agent that monitors off-chain conditions and triggers on-chain actions
- Natural language interface for complex DeFi operations
- Autonomous workflow generation based on user intent
- Cross-chain execution orchestrated by AI decision layer

**Your narrative arc (for video):**
1. Problem exists → 2. AI understands intent → 3. CRE orchestrates execution → 4. Result verified on-chain

---

### Phase 2: Technical Core (Day 1 — 12 hours)

**Priority 1: Working CRE Workflow**
- Define workflow YAML with at least one blockchain + external system/LLM
- Test simulation via `cre-cli simulate`
- If deploying: verify execution on CRE network

**Priority 2: AI Integration**
- LLM parses user intent or monitors conditions
- AI output feeds into CRE workflow parameters
- Show clear handoff: AI → CRE → blockchain

**Priority 3: Minimal Viable Frontend**
- Input: user query or trigger condition
- Output: workflow status + on-chain result
- Visualize the CRE workflow execution path

**Do NOT build:**
- Complex authentication systems
- Production-grade error handling
- Multiple blockchain integrations (one strong flow beats three weak ones)

---

### Phase 3: Polish for Judges (Day 2 — 12 hours)

**Video Script (3-4 minutes max):**
```
0:00-0:30  → Hook: Show the problem in 10 seconds
0:30-1:00  → Solution overview: AI + CRE working together
1:00-2:30  → Demo: Live walkthrough of workflow execution
2:30-3:00  → Code walkthrough: Show CRE YAML and integration points
3:00-3:30  → Result: On-chain verification, real-world impact
```

**README Structure:**
```markdown
# Project Name

## Problem
[One paragraph, concrete and relatable]

## Solution
[How AI + CRE solves it]

## Demo
[Video link + 2-3 screenshots]

## CRE Integration
- Workflow file: `cre/workflow.yaml`
- AI handler: `src/ai/intent-parser.ts`
- Blockchain calls: `src/chain/executors.ts`

## How to Run
[Steps to simulate or deploy]
```

**Code Organization for Judges:**
```
/cre              # All CRE workflows (clearly separated)
/src/ai           # AI integration layer
/src/chain        # Blockchain interaction
/src/api          # External API integrations
/README.md        # Links to all Chainlink usage
/VIDEO.md         # Link to demo video
```

---

## CRE & AI Track — Winning Differentiators

### 1. x402 Payments Integration
If your AI agent pays for CRE workflow execution using x402, this directly hits a listed use case. Show the payment flow in your demo.

### 2. Blockchain Abstraction
If users interact via natural language and your AI translates to CRE workflows without them touching blockchain primitives, emphasize this "invisible infrastructure" angle.

### 3. Workflow Generation
If your AI generates CRE workflows dynamically based on user intent (not just static execution), this is a strong differentiator. Show before/after workflow YAML.

---

## Common Pitfalls to Avoid

| Pitfall | Fix |
|---------|-----|
| CRE is a small feature, not the core | Make CRE the orchestration layer; AI and blockchain connect through it |
| Video too long or unfocused | Script it. Practice once. Cut ruthlessly. |
| Code hard to find | Top-level README with explicit file links |
| AI feels bolted-on | Show AI decision → CRE parameter → on-chain result chain |
| No real-world problem | Start video with a user who has this problem |
| Past hackathon project without new CRE components | If reusing code, document exactly what's new |

---

## Quick Wins for Presentation

1. **Start the video with the problem** — a user frustrated by current solutions
2. **Show the CRE workflow running** — CLI simulation is fine, make it visual
3. **Highlight the AI decision point** — what did the AI decide and why
4. **End with on-chain verification** — block explorer link, transaction hash
5. **Link everything in README** — judges should find your CRE code in 10 seconds

---

## Final 6-Hour Checklist

- [ ] Video recorded and uploaded (unlisted YouTube is fine)
- [ ] README complete with all required sections
- [ ] All Chainlink-related files linked in README
- [ ] Code pushed to public repo
- [ ] Test: Can a judge understand your project in 5 minutes without asking questions?
- [ ] Submit before deadline with buffer for technical issues

---

## Key Links

- Submission: https://chain.link/hackathon
- Prize tracks: https://chain.link/hackathon/prizes
- CRE Documentation: [Add your links here]
- Your video: [Add link once uploaded]
- Your repo: [Add link once public]

---

**Focus on demonstrating that CRE "collapses complexity into code." Show the before (fragmented systems) and after (one CRE workflow). That's the winning narrative.**
