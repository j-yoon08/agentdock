const els = {
  mode: document.querySelector('#mode-pill'),
  health: document.querySelector('#overall-health'),
  detail: document.querySelector('#overall-detail'),
  agentsActive: document.querySelector('#agents-active'),
  pendingApprovals: document.querySelector('#pending-approvals'),
  openFailures: document.querySelector('#open-failures'),
  cost24h: document.querySelector('#cost-24h'),
  generatedAt: document.querySelector('#generated-at'),
  todayList: document.querySelector('#today-list'),
  agentCount: document.querySelector('#agent-count'),
  agentTable: document.querySelector('#agent-table'),
  approvalList: document.querySelector('#approval-list'),
  failureList: document.querySelector('#failure-list'),
  connectorGrid: document.querySelector('#connector-grid'),
  eventTimeline: document.querySelector('#event-timeline'),
};

async function load() {
  const [summary, state] = await Promise.all([
    fetchJson('/api/summary'),
    fetchJson('/api/state'),
  ]);
  renderSummary(summary);
  renderState(state);
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
}

function renderSummary(summary) {
  setText(els.mode, summary.mode.replaceAll('_', ' '));
  setText(els.health, summary.health.toUpperCase());
  els.health.className = `tone-${toneForHealth(summary.health)}`;
  setText(els.detail, healthCopy(summary.health));
  setText(els.agentsActive, `${summary.kpis.agents_active}/${summary.kpis.agents_total}`);
  setText(els.pendingApprovals, summary.kpis.pending_approvals);
  setText(els.openFailures, summary.kpis.failures_open);
  setText(els.cost24h, `$${summary.kpis.cost_usd_24h.toFixed(2)}`);
  setText(els.generatedAt, formatTime(summary.generated_at));
  renderCards(els.todayList, summary.today, (item) => `
    <article class="item-card">
      <h3 class="tone-${item.tone}">${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.detail)}</p>
      <div class="item-meta"><span class="badge">${escapeHtml(item.type)}</span><span class="badge">${escapeHtml(item.tone)}</span></div>
    </article>
  `);
}

function renderState(state) {
  setText(els.agentCount, `${state.agents.length} agents`);
  els.agentTable.innerHTML = state.agents.map((agent) => `
    <tr>
      <td><strong>${escapeHtml(agent.name)}</strong><br><span class="muted">${escapeHtml(agent.domain)}</span></td>
      <td><span class="tone-${toneForStatus(agent.status)}">${escapeHtml(agent.status)}</span><br><span class="muted">${formatTime(agent.last_run)}</span></td>
      <td><span class="tone-${toneForRisk(agent.risk)}">${escapeHtml(agent.risk)}</span></td>
      <td>${escapeHtml(agent.last_output)}</td>
    </tr>
  `).join('');

  renderCards(els.approvalList, state.approvals, (approval) => `
    <article class="item-card">
      <h3 class="tone-${toneForRisk(approval.risk)}">${escapeHtml(approval.title)}</h3>
      <p>${escapeHtml(approval.summary)}</p>
      <div class="item-meta"><span class="badge">${escapeHtml(approval.action_type)}</span><span class="badge">${escapeHtml(approval.status)}</span></div>
    </article>
  `);

  renderCards(els.failureList, state.failures, (failure) => `
    <article class="item-card">
      <h3 class="tone-${failure.severity}">${escapeHtml(failure.title)}</h3>
      <p>${escapeHtml(failure.probable_cause)}</p>
      <div class="item-meta"><span class="badge">${failure.retryable ? 'retryable' : 'manual review'}</span></div>
    </article>
  `);

  els.connectorGrid.innerHTML = state.connectors.map((connector) => `
    <article class="connector-card">
      <strong>${escapeHtml(connector.name)}</strong>
      <p class="muted">${escapeHtml(connector.mode)} · ${formatTime(connector.last_seen)}</p>
      <span class="tone-${toneForStatus(connector.status)}">${escapeHtml(connector.status)}</span>
    </article>
  `).join('');

  els.eventTimeline.innerHTML = state.events.map((event) => `
    <div class="timeline-row">
      <time>${formatTime(event.time)}</time>
      <p><strong class="tone-${event.severity}">${escapeHtml(event.source)}</strong> · ${escapeHtml(event.message)}</p>
    </div>
  `).join('');
}

function renderCards(target, items, template) {
  target.innerHTML = items.length ? items.map(template).join('') : '<p class="muted">표시할 항목이 없습니다.</p>';
}

function healthCopy(health) {
  if (health === 'blocked') return '승인 없이 실행되면 안 되는 액션이 차단되어 있습니다.';
  if (health === 'attention') return '승인 대기 또는 degraded connector를 확인해야 합니다.';
  return '모든 에이전트와 connector가 정상 범위입니다.';
}

function toneForHealth(health) {
  if (health === 'blocked') return 'critical';
  if (health === 'attention') return 'attention';
  return 'ok';
}

function toneForRisk(risk) {
  if (risk === 'critical') return 'critical';
  if (risk === 'high') return 'warning';
  if (risk === 'medium') return 'attention';
  return 'ok';
}

function toneForStatus(status) {
  if (['blocked', 'critical', 'disconnected'].includes(status)) return 'critical';
  if (['warning', 'degraded'].includes(status)) return 'warning';
  if (['needs_approval', 'pending'].includes(status)) return 'attention';
  return 'ok';
}

function formatTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(date);
}

function setText(node, value) {
  if (node) node.textContent = value ?? '-';
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[char]));
}

load().catch((error) => {
  setText(els.health, 'ERROR');
  setText(els.detail, error.message);
});
