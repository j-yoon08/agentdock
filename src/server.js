import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadState, publicState, summarizeState } from './control-plane.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const DEFAULT_PORT = Number(process.env.PORT || 4177);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
};

export function createServer({ statePath } = {}) {
  return http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);
    setSecurityHeaders(res);

    if (req.method !== 'GET' && url.pathname.startsWith('/api/')) {
      return json(res, 405, {
        error: 'AgentDock MVP is read-only',
        read_only: true,
        allowed_methods: ['GET'],
      });
    }

    if (req.method !== 'GET') {
      return json(res, 405, { error: 'method not allowed' });
    }

    try {
      if (url.pathname === '/api/health') {
        return json(res, 200, { status: 'ok', product: 'AgentDock', mode: 'read_only_mvp' });
      }
      if (url.pathname === '/api/state') {
        return json(res, 200, publicState(loadState(statePath)));
      }
      if (url.pathname === '/api/summary') {
        return json(res, 200, summarizeState(loadState(statePath)));
      }
      return serveStatic(url.pathname, res);
    } catch (error) {
      return json(res, 500, { error: 'internal error', message: error.message });
    }
  });
}

function serveStatic(pathname, res) {
  const cleanPath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.normalize(path.join(PUBLIC_DIR, cleanPath));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    return json(res, 403, { error: 'forbidden' });
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    return json(res, 404, { error: 'not found' });
  }
  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
}

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body, null, 2));
}

function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = createServer();
  server.listen(DEFAULT_PORT, '127.0.0.1', () => {
    console.log(`AgentDock listening on http://127.0.0.1:${DEFAULT_PORT}`);
  });
}
