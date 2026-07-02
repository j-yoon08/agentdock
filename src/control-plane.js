import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_STATE_PATH = path.resolve(__dirname, '../data/sample-state.json');
const SAFE_MODES = new Set(['read_only_mvp', 'read_only', 'shadow']);
const RISK_ORDER = ['low', 'medium', 'high', 'critical'];

export function loadState(filePath = process.env.AGENTDOCK_STATE_PATH || DEFAULT_STATE_PATH) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(raw);
  return normalizeState(parsed);
}

export function normalizeState(state) {
  const workspace = state.workspace || {};
  const mode = workspace.mode || 'read_only_mvp';
  if (!SAFE_MODES.has(mode)) {
    throw new Error(`unsafe workspace mode: ${mode}`);
  }
  return {
    generated_at: state.generated_at || new Date().toISOString(),
    workspace: {
      name: workspace.name || 'AgentDock',
      mode,
      owner: workspace.owner || 'operator',
    },
    agents: arrayOf(state.agents).map(normalizeAgent),
    approvals: arrayOf(state.approvals).map(normalizeApproval),
    events: arrayOf(state.events).map(normalizeEvent),
    failures: arrayOf(state.failures).map(normalizeFailure),
    connectors: arrayOf(state.connectors).map(normalizeConnector),
  };
}

export function publicState(state) {
  const normalized = normalizeState(state);
  return {
    ...normalized,
    approvals: normalized.approvals.map((approval) => ({
      ...approval,
      summary: redactSensitiveText(approval.summary),
    })),
    failures: normalized.failures.map((failure) => ({
      ...failure,
      probable_cause: redactSensitiveText(failure.probable_cause),
      suggested_fix: redactSensitiveText(failure.suggested_fix),
    })),
  };
}

export function summarizeState(state) {
  const safe = publicState(state);
  const agentCounts = countBy(safe.agents, 'status');
  const approvalCounts = countBy(safe.approvals, 'status');
  const failureCounts = countBy(safe.failures, 'severity');
  const connectorCounts = countBy(safe.connectors, 'status');
  const riskCounts = countBy([...safe.agents, ...safe.approvals], 'risk');
  const pendingApprovals = safe.approvals.filter((approval) => approval.status === 'pending');
  const blockedApprovals = safe.approvals.filter((approval) => approval.status === 'blocked');
  const attentionEvents = safe.events.filter((event) => ['warning', 'critical', 'attention'].includes(event.severity));
  const activeAgents = safe.agents.filter((agent) => ['healthy', 'warning', 'needs_approval'].includes(agent.status));

  return {
    product: 'AgentDock',
    mode: safe.workspace.mode,
    generated_at: safe.generated_at,
    workspace: safe.workspace,
    health: computeHealth({ safe, pendingApprovals, blockedApprovals }),
    kpis: {
      agents_total: safe.agents.length,
      agents_active: activeAgents.length,
      pending_approvals: pendingApprovals.length,
      blocked_actions: blockedApprovals.length,
      failures_open: safe.failures.length,
      critical_failures: failureCounts.critical || 0,
      connectors_degraded: (connectorCounts.degraded || 0) + (connectorCounts.disconnected || 0),
      cost_usd_24h: roundCurrency(safe.agents.reduce((sum, agent) => sum + agent.cost_usd_24h, 0)),
    },
    counts: {
      agents: agentCounts,
      approvals: approvalCounts,
      failures: failureCounts,
      connectors: connectorCounts,
      risk: riskCounts,
    },
    today: buildTodayQueue({ safe, pendingApprovals, blockedApprovals, attentionEvents }),
    top_risks: rankRisks(safe),
  };
}

function normalizeAgent(agent) {
  return {
    id: requireString(agent.id, 'agent.id'),
    name: requireString(agent.name, 'agent.name'),
    domain: agent.domain || 'General',
    status: agent.status || 'unknown',
    risk: normalizeRisk(agent.risk),
    last_run: agent.last_run || null,
    next_run: agent.next_run || null,
    success_rate: Number(agent.success_rate || 0),
    last_output: redactSensitiveText(agent.last_output || '-'),
    cost_usd_24h: Number(agent.cost_usd_24h || 0),
  };
}

function normalizeApproval(approval) {
  return {
    id: requireString(approval.id, 'approval.id'),
    title: requireString(approval.title, 'approval.title'),
    agent_id: approval.agent_id || 'unknown',
    risk: normalizeRisk(approval.risk),
    action_type: approval.action_type || 'unknown',
    requested_at: approval.requested_at || null,
    status: approval.status || 'pending',
    summary: approval.summary || '-',
    allowed_decisions: arrayOf(approval.allowed_decisions),
  };
}

function normalizeEvent(event) {
  return {
    id: requireString(event.id, 'event.id'),
    time: event.time || null,
    severity: event.severity || 'info',
    source: event.source || 'system',
    message: redactSensitiveText(event.message || '-'),
  };
}

function normalizeFailure(failure) {
  return {
    id: requireString(failure.id, 'failure.id'),
    agent_id: failure.agent_id || 'unknown',
    title: requireString(failure.title, 'failure.title'),
    severity: failure.severity || 'warning',
    first_seen: failure.first_seen || null,
    probable_cause: failure.probable_cause || '-',
    suggested_fix: failure.suggested_fix || '-',
    retryable: Boolean(failure.retryable),
  };
}

function normalizeConnector(connector) {
  return {
    id: requireString(connector.id, 'connector.id'),
    name: requireString(connector.name, 'connector.name'),
    status: connector.status || 'unknown',
    mode: connector.mode || 'read_only',
    last_seen: connector.last_seen || null,
  };
}

function computeHealth({ safe, pendingApprovals, blockedApprovals }) {
  const criticalFailures = safe.failures.filter((failure) => failure.severity === 'critical').length;
  const degradedConnectors = safe.connectors.filter((connector) => ['degraded', 'disconnected'].includes(connector.status)).length;
  if (blockedApprovals.length > 0 || criticalFailures > 0) return 'blocked';
  if (degradedConnectors > 0 || pendingApprovals.length > 0) return 'attention';
  return 'ok';
}

function buildTodayQueue({ safe, pendingApprovals, blockedApprovals, attentionEvents }) {
  return [
    ...blockedApprovals.map((approval) => ({ type: 'blocked_action', tone: 'critical', title: approval.title, detail: approval.summary })),
    ...pendingApprovals.map((approval) => ({ type: 'approval', tone: riskTone(approval.risk), title: approval.title, detail: approval.summary })),
    ...safe.failures.map((failure) => ({ type: 'failure', tone: failure.severity, title: failure.title, detail: failure.suggested_fix })),
    ...attentionEvents.slice(0, 4).map((event) => ({ type: 'event', tone: event.severity, title: event.source, detail: event.message })),
  ].slice(0, 8);
}

function rankRisks(safe) {
  return [...safe.agents, ...safe.approvals]
    .map((item) => ({ id: item.id, title: item.name || item.title, risk: item.risk, tone: riskTone(item.risk), status: item.status }))
    .sort((a, b) => RISK_ORDER.indexOf(b.risk) - RISK_ORDER.indexOf(a.risk))
    .slice(0, 6);
}

function riskTone(risk) {
  if (risk === 'critical') return 'critical';
  if (risk === 'high') return 'warning';
  if (risk === 'medium') return 'attention';
  return 'ok';
}

function normalizeRisk(risk) {
  return RISK_ORDER.includes(risk) ? risk : 'low';
}

function countBy(items, key) {
  return items.reduce((counts, item) => {
    const value = item[key] || 'unknown';
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function roundCurrency(value) {
  return Math.round(value * 100) / 100;
}

function arrayOf(value) {
  return Array.isArray(value) ? value : [];
}

function requireString(value, label) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`missing ${label}`);
  }
  return value;
}

export function redactSensitiveText(text) {
  return String(text)
    .replace(/sk-[A-Za-z0-9_-]{12,}/g, '[REDACTED]')
    .replace(/ghp_[A-Za-z0-9_]{12,}/g, '[REDACTED]')
    .replace(/xox[baprs]-[A-Za-z0-9-]{12,}/g, '[REDACTED]')
    .replace(/org-[A-Za-z0-9_-]{8,}/g, '[ORG_ID_REDACTED]');
}
