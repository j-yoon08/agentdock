# AgentDock Product Brief

## Positioning

**A self-hosted control plane for personal AI agents, automations, approvals, and operational context.**

AgentDock is not competing with generic dashboards, Notion, Grafana, or n8n directly. It sits between them: the operator console for AI-native work that needs status, traceability, and approval gates.

## Target users

- Developers running multiple coding/automation agents.
- Solo founders with cron/webhook/AI workflows.
- Homelab/self-hosted operators.
- Small teams adopting autonomous coding or ops agents.

## Differentiation

- Agent/job registry instead of metric-only monitoring.
- Pending approval queue for risky actions.
- Failure triage with probable cause and suggested fix.
- Daily cockpit focused on operator decisions.
- Read-only first, action-gated later.

## MVP acceptance criteria

- A local dashboard shows agents, approvals, failures, connectors, and timeline.
- API summary is deterministic and redacted.
- POST actions are blocked in v0.
- Tests verify summary contracts, fail-closed POSTs, and UI surfaces.
- UI avoids decorative edge gradients/bars and remains responsive.

## Next phase

1. Add pluggable connector interface.
2. Implement read-only cron connector.
3. Implement read-only GitHub connector.
4. Persist state in SQLite.
5. Add approval receipt model, still without execution.
6. Add visual QA contact-sheet check for desktop/mobile.
