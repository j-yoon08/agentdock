# AgentDock

Self-hosted AI agent and automation control plane MVP.

AgentDock is positioned as an **AI Agent Control Plane**, not a generic personal dashboard. It focuses on answering:

- Which agents/jobs ran recently?
- What failed and why?
- Which risky actions are waiting for approval?
- Which connectors are degraded?
- What should the operator review today?

## MVP scope

This first cut is intentionally **read-only**. It displays sample state from `data/sample-state.json` and exposes safe GET APIs only.

- `GET /api/health`
- `GET /api/summary`
- `GET /api/state`
- all `POST /api/*` calls return `405` with `read_only: true`

## Run

```bash
npm run check
npm test
npm start
```

Open <http://127.0.0.1:4177>.

## Product direction

AgentDock should evolve toward a connector-based dashboard for AI agents, cron jobs, MCP tools, approval queues, automation failures, and operator handoffs.

The product boundary is safety-first:

1. Read-only connectors first.
2. Approval queue before any external write.
3. Fail-closed actions.
4. Redacted event and failure summaries.
5. Local/self-hosted by default.
