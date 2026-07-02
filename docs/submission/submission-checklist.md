# AgentDock Submission Checklist

## Repository readiness

- [x] Project has a clear name and one-line value proposition.
- [x] README explains problem, features, safety boundary, quickstart, and roadmap.
- [x] MIT license added.
- [x] CI workflow added.
- [x] Tests added and passing locally.
- [x] Screenshot assets generated.
- [x] Security policy added.
- [x] Contributing guide added.
- [x] No real secrets required for the MVP.

## External submission pending items

- [x] Public GitHub repository created/pushed: `https://github.com/j-yoon08/agentdock`.
- [x] Real repository URL filled in application draft.
- [ ] OpenAI Organization ID filled manually by Jongyun.
- [ ] Official OpenAI form opened directly by user.
- [ ] Application text pasted after final review.

## Final pre-submit command set

```bash
cd /home/ubuntu/apps/agentdock
npm run check
npm test
git status --short --branch
```

## What not to submit

- API keys,
- OAuth secrets,
- Hermes dashboard action tokens,
- private server URLs or internal credentials,
- financial account data,
- private logs.
