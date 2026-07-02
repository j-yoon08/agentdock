import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/server.js';

async function withServer(fn) {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  try {
    await fn(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test('GET /api/summary exposes read-only MVP contract', async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/api/summary`);
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.product, 'AgentDock');
    assert.equal(body.mode, 'read_only_mvp');
    assert.equal(body.kpis.pending_approvals, 2);
  });
});

test('POST API calls are fail-closed in MVP', async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/api/approvals/apv-101`, { method: 'POST' });
    assert.equal(response.status, 405);
    const body = await response.json();
    assert.equal(body.read_only, true);
  });
});

test('homepage serves compact app shell', async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /AgentDock/);
    assert.match(html, /Today cockpit/);
    assert.match(html, /Pending Approval/);
  });
});
