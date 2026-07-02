import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('CSS avoids decorative edge accents and gradients', () => {
  const css = fs.readFileSync('public/styles.css', 'utf8');
  assert.equal(css.includes('linear-gradient'), false);
  assert.equal(css.includes('border-left:'), false);
  assert.equal(css.includes('::before'), false);
});

test('UI includes core control-plane surfaces', () => {
  const html = fs.readFileSync('public/index.html', 'utf8');
  for (const text of ['Today cockpit', 'Agent Registry', 'Pending Approval', 'Failure Triage', 'Activity Timeline']) {
    assert.match(html, new RegExp(text));
  }
});
