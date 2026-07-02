# Security Policy

AgentDock is a safety-first control-plane prototype. The current MVP is read-only by design.

## Supported version

| Version | Supported |
| --- | --- |
| 0.1.x | Yes |

## Current security boundary

- `GET /api/health`, `GET /api/summary`, and `GET /api/state` expose redacted read models only.
- All `POST /api/*` requests return `405` with `read_only: true`.
- Token-like strings are redacted before public state/summary output.
- No production credentials, OAuth tokens, or external write actions are required for the MVP.

## Reporting a vulnerability

Please open a private report through the repository security advisory flow after the GitHub repository is published. Until then, contact the maintainer directly.

When reporting, include:

- affected endpoint or file path,
- reproduction steps,
- expected vs actual behavior,
- whether secrets, external writes, or approval bypass are involved.

## Out of scope for v0.1

- Live action execution,
- trading or financial actions,
- OAuth-backed write connectors,
- multi-tenant authentication.
