# Progress

**MVP Deadline:** 28/02/2026

---


## In Progress / Partial

- **Goals:** Schema exists; `createSession` doesn’t accept goals. Goals route returns empty.
- **Session detail:** No duration/expiry on session; goals not returned with session.
- **Transcript storage:** Stored on filesystem, not in DB (only `transcriptId` in meetings).

---

## Todo (minimal)

2. **Verification:** Raw score (AI from transcript) → payout score (algorithm + feedback) → sigmoid → payout multiplier.
3. **Host dashboard:** API for estimated multiplier + analysis + suggestions (uses verification).
4. **Session completion:** Host endpoint to submit completion → trigger payout flow.
5. **User join:** USDC deposit (contract) + join session.
6. **User dashboard:** Session history, active sessions, refund amount (estimated + actual).
7. **Chainlink CRE:** Confidential endpoint for session + goals + transcripts → verification → onchain payout.
8. **Host application:** Apply + manual approval flow.
9. **Activation keyword:** Live session activation.

1. **Goals:** Goals CRUD; attach goals when creating session. -> DONE. NEED TESTING.