# Contributing to AgentDock

Thanks for considering a contribution. AgentDock is intentionally small and safety-first.

## Local development

```bash
npm run check
npm test
npm start
```

Open <http://127.0.0.1:4177>.

## Contribution priorities

1. Read-only connectors before action execution.
2. Deterministic tests for every read model change.
3. Redaction and fail-closed behavior for anything that may contain secrets or external actions.
4. Compact, operator-focused UI rather than generic dashboard widgets.

## Safety rules

- Do not commit real API keys, OAuth tokens, `.env` files, private logs, or raw financial/account data.
- Do not add live action execution without an approval receipt model and tests.
- Keep `POST /api/*` fail-closed until an explicit action bridge is reviewed.
- Prefer sample data and local fixtures in tests.

## Pull request checklist

- [ ] `npm run check` passes.
- [ ] `npm test` passes.
- [ ] New surfaces are documented in README or docs.
- [ ] No literal secrets or personal credentials are committed.
