# AgentDock Roadmap

## v0.1 — Read-only MVP

- [x] Static JSON read model.
- [x] Agent registry.
- [x] Today cockpit.
- [x] Pending approval preview.
- [x] Failure triage preview.
- [x] Connector health cards.
- [x] Activity timeline.
- [x] Read-only API contract.
- [x] Fail-closed POST routes.
- [x] Tests and CI workflow.

## v0.2 — Real read-only connectors

- [ ] Connector interface under `src/connectors/`.
- [ ] Local cron/job snapshot connector.
- [ ] GitHub repository activity connector.
- [ ] Local log/event JSONL connector.
- [ ] Connector error isolation and stale-data marking.

## v0.3 — Persistence and auditability

- [ ] SQLite state store.
- [ ] Append-only event ledger.
- [ ] Approval request/receipt schema.
- [ ] Redaction policy tests.
- [ ] Import/export of local state snapshots.

## v0.4 — Operator workflow

- [ ] Approval detail page.
- [ ] Acknowledge/snooze/edit receipt flow.
- [ ] Action fingerprint preview.
- [ ] GitHub PR comment/report integration.
- [ ] Dashboard visual QA regression check.

## v1.0 direction

AgentDock should become a self-hosted operator console for AI agents and automations: status, failures, approvals, connector health, cost, and audit trail in one local-first control plane.
