# OpenAI Codex for OSS Application Draft — AgentDock

> Fill placeholders before submitting. Use only the official OpenAI form/domain. Do not paste API keys or private credentials.

## Basic fields

**GitHub username**

`j-yoon08`

**Repository URL**

`〈replace after public push: https://github.com/j-yoon08/agentdock〉`

**Project name**

AgentDock

**Role**

Creator and maintainer.

## Short project description

AgentDock is a self-hosted control plane for AI agents and automations. It helps developers see which agents ran recently, what failed, which risky actions are waiting for approval, which connectors are degraded, and what the operator should review today.

The current MVP is intentionally read-only: it provides a local dashboard, redacted public state APIs, deterministic tests, and fail-closed POST endpoints before adding any action execution.

## Why this project is useful to open source developers

As coding agents, cron automations, MCP tools, and AI workflows become more common, developers need a local-first way to operate them safely. Logs and dashboards are often fragmented across Grafana, GitHub, n8n, LangSmith, local scripts, and chat tools.

AgentDock focuses on the missing operator layer: agent registry, approval queue, failure triage, connector health, and activity timeline in one self-hosted interface. It is useful for solo developers, homelab operators, and small teams experimenting with AI-native automation while still needing visibility and safety boundaries.

## Current implementation evidence

- Node.js dependency-free HTTP server.
- Static dashboard UI.
- `GET /api/health`, `GET /api/summary`, and `GET /api/state`.
- `POST /api/*` returns `405` with `read_only: true`.
- Redaction helper for token-like strings.
- Contract tests for summary, read-only behavior, redaction, and UI surfaces.
- MIT license, CI workflow, README, product brief, architecture, roadmap, and screenshots.

## How I would use Codex / ChatGPT Pro / API credits

I would use Codex and ChatGPT Pro to accelerate open-source maintenance and development of AgentDock:

1. Review pull requests for safety regressions, especially around action execution, redaction, and approval-gate logic.
2. Generate and refine connector tests for cron, GitHub, local logs, and future MCP integrations.
3. Improve documentation, release notes, demo scripts, and contributor guides.
4. Triage issues and convert vague feature requests into actionable, testable tasks.
5. Build safer operator workflows such as approval receipts, action fingerprints, replay protection, and failure-triage reports.

API credits would be used only for project development and maintainer workflows, not for storing private user secrets or running uncontrolled autonomous actions.

## Roadmap

- v0.2: read-only connector interface, cron connector, GitHub connector, local log connector.
- v0.3: SQLite persistence, append-only event ledger, approval request/receipt schema.
- v0.4: approval detail page, acknowledge/snooze/edit receipt flow, GitHub PR/report integration.
- v1.0: self-hosted agent operations console with safe approval-gated action bridges.

## Anything else to mention

AgentDock was built from a real operational need: managing multiple AI-assisted automations safely without turning every script into an unrestricted autonomous agent. The project deliberately starts with a fail-closed read-only MVP so the open-source community can review the control-plane contract before any external write or execution bridge is added.

## Required manual field

**OpenAI Organization ID**

`〈fill manually from https://platform.openai.com/settings/organization/general〉`
