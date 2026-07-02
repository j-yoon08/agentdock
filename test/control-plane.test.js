import test from 'node:test';
import assert from 'node:assert/strict';
import { loadState, normalizeState, publicState, redactSensitiveText, summarizeState } from '../src/control-plane.js';

test('sample state summarizes agent operations safely', () => {
  const state = loadState();
  const summary = summarizeState(state);
  assert.equal(summary.product, 'AgentDock');
  assert.equal(summary.mode, 'read_only_mvp');
  assert.equal(summary.health, 'blocked');
  assert.equal(summary.kpis.agents_total, 5);
  assert.equal(summary.kpis.pending_approvals, 2);
  assert.equal(summary.kpis.blocked_actions, 1);
  assert.equal(summary.kpis.critical_failures, 1);
  assert.ok(summary.today.some((item) => item.type === 'blocked_action'));
});

test('state validation rejects unsafe modes', () => {
  assert.throws(() => normalizeState({ workspace: { mode: 'live_execute' } }), /unsafe workspace mode/);
});

test('public state redacts token-like values', () => {
  const fakeOpenAiToken = 'sk-' + 'abcDEF1234567890';
  const fakeGithubToken = 'ghp_' + 'abcDEF1234567890';
  const fakeOrgId = 'org-' + 'abcDEF1234567890';
  assert.equal(redactSensitiveText(`token ${fakeOpenAiToken} and ${fakeGithubToken}`), 'token [REDACTED] and [REDACTED]');
  const state = publicState({
    workspace: { mode: 'read_only_mvp' },
    agents: [{ id: 'a1', name: 'Agent', last_output: `uses ${fakeOpenAiToken}` }],
    approvals: [{ id: 'p1', title: 'Approval', summary: fakeOrgId }],
  });
  assert.equal(state.agents[0].last_output, 'uses [REDACTED]');
  assert.equal(state.approvals[0].summary, '[ORG_ID_REDACTED]');
});
