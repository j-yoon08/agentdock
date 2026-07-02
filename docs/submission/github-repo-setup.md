# GitHub Repository Setup Notes

Recommended public repository setup after approval to push externally:

## Repository

- Owner: `j-yoon08`
- Name: `agentdock`
- Visibility: public
- Description: `Self-hosted control plane for AI agents, automations, approvals, and failure triage.`
- Topics: `ai-agent`, `agentops`, `automation`, `control-plane`, `self-hosted`, `dashboard`, `approval-queue`, `developer-tools`
- License: MIT

## Commands to run after explicit approval

```bash
cd /home/ubuntu/apps/agentdock
gh repo create j-yoon08/agentdock --public --source=. --remote=origin --push
```

If the repo already exists:

```bash
cd /home/ubuntu/apps/agentdock
git remote add origin https://github.com/j-yoon08/agentdock.git
git push -u origin main
```

## After push

1. Verify GitHub Actions CI starts.
2. Add `docs/assets/agentdock-desktop.png` to the README preview if it is not rendered.
3. Replace the repository URL placeholder in `openai-codex-oss-application-draft.md`.
4. Use the repository URL in the submission form.
