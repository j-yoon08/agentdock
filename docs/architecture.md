# AgentDock Architecture

AgentDock v0.1 is a dependency-free Node.js MVP that demonstrates the control-plane shape without requiring credentials or external services.

## Components

```text
sample-state.json
      │
      ▼
src/control-plane.js  ── normalize/redact/summarize
      │
      ▼
src/server.js         ── GET-only API + static files
      │
      ▼
public/app.js         ── fetch summary/state and render dashboard
      │
      ▼
public/index.html + styles.css
```

## API contract

| Endpoint | Method | Purpose | Safety |
| --- | --- | --- | --- |
| `/api/health` | GET | Liveness and product mode | read-only |
| `/api/summary` | GET | KPIs, health, today queue, risk counts | redacted |
| `/api/state` | GET | Public agent/approval/failure/event read model | redacted |
| `/api/*` | POST | Action placeholder | fail-closed 405 |

## Read model

The current sample state contains:

- agents/jobs,
- approvals,
- events,
- failures,
- connectors.

The next implementation step is to replace static sample data with connector snapshots while keeping the same public summary contract.

## Safety boundary

AgentDock starts as a read-only observability/control-plane surface. Action execution is deliberately out of scope for v0.1.

Future action bridges should require:

1. durable approval request,
2. exact action fingerprint,
3. operator receipt,
4. policy revalidation,
5. append-only audit log,
6. fail-closed replay protection.
