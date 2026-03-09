# Verity — Chainlink CRE Workflows

Chainlink Runtime Environment (CRE) workflows for Verity's knowledge exchange platform.

## Chainlink Usage

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| **Initiation** | `SessionRegistrationRequested` (KXManager) | Register session on-chain, create Recall bot, store data on IPFS |
| **Settlement** | `EvaluationRequested` (KXSessionRegistry) | AI evaluation via Gemini, settle payouts on-chain |

### Key Chainlink Integration Points

- **EVM log triggers** — Workflows listen for contract events
- **CRE reports** — Workflows submit signed reports back to contracts via `onReport`
- **project.yaml** — RPC config for Sepolia testnet

## Repo Links

- **Initiation workflow:** `initiation-workflow/main.ts`
- **Settlement workflow:** `settlement-workflow/main.ts`
- **CRE config:** `initiation-workflow/workflow.yaml`, `settlement-workflow/workflow.yaml`
- **Project config:** `project.yaml`

## Run

```bash
cre workflow simulate ./initiation-workflow --target=test
cre workflow simulate ./settlement-workflow --target=test
```

Full docs: [docs.hetairoi.xyz](https://docs.hetairoi.xyz)
