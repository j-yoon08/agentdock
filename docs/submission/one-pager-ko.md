# AgentDock 원페이지 소개서

## 프로젝트명

**AgentDock** — Self-hosted AI Agent Control Plane

## 한 줄 소개

여러 AI 에이전트와 자동화를 운영하는 개발자가 실행 상태, 승인 대기, 실패 원인, connector 상태를 한 화면에서 관제하는 self-hosted 대시보드입니다.

## 문제

AI 코딩 에이전트, cron 자동화, MCP tool, 개인/팀 workflow가 늘어나면서 다음 문제가 생깁니다.

- 에이전트가 언제 무엇을 했는지 흩어져 있음
- 실패 원인과 다음 조치가 로그 속에 묻힘
- 외부 write, publish, financial action 같은 위험 액션을 구분하기 어려움
- 승인 대기/차단/재시도 상태가 통합되지 않음
- self-hosted 환경에서는 LangSmith/Grafana/n8n/Notion이 각각 따로 놀기 쉬움

## 해결

AgentDock은 agent/job registry, pending approval, failure triage, connector health, activity timeline을 하나의 operator cockpit으로 묶습니다.

## MVP 구현 상태

- Node.js dependency-free server
- Static frontend dashboard
- JSON-backed read model
- GET-only API: `/api/health`, `/api/summary`, `/api/state`
- Fail-closed POST API: `POST /api/*` → 405
- Contract tests and CI workflow
- Desktop/mobile screenshots
- MIT license

## 차별화

| 기존 도구 | 한계 | AgentDock 방향 |
| --- | --- | --- |
| Grafana | 메트릭 중심 | agent decision / approval 중심 |
| n8n | workflow 실행 중심 | 운영 관제와 실패 triage 중심 |
| LangSmith/Langfuse | LLM trace 중심 | 자동화/connector/approval까지 포함 |
| Notion/Raycast | 정보 정리/런처 중심 | 실행 상태와 안전 경계 중심 |

## 대상 사용자

- AI 에이전트를 여러 개 돌리는 개발자
- self-hosted automation/homelab 운영자
- solo founder / small team
- 승인 기반 AI 작업 흐름을 도입하려는 팀

## 다음 단계

1. read-only cron connector
2. read-only GitHub connector
3. SQLite persistence
4. approval receipt model
5. safe action bridge

## 제출용 요약 문장

AgentDock is a self-hosted control plane for AI agents and automations, focused on operational visibility, failure triage, approval queues, and fail-closed safety boundaries.
