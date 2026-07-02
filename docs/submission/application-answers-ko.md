# AgentDock 신청 답변 한글 초안

## 프로젝트 설명

AgentDock은 여러 AI 에이전트와 자동화를 운영하는 개발자를 위한 self-hosted control plane입니다. 어떤 에이전트가 언제 실행됐는지, 무엇이 실패했는지, 어떤 위험 액션이 승인을 기다리는지, 어떤 connector가 degraded인지 한 화면에서 볼 수 있게 합니다.

현재 MVP는 안전하게 read-only로 구현되어 있습니다. `/api/health`, `/api/summary`, `/api/state` 조회 API를 제공하고, 모든 `POST /api/*` 요청은 `405`와 `read_only: true`로 차단됩니다. token-like 문자열 redaction, 계약 테스트, CI, README, 제품 설명서, 아키텍처 문서, 로드맵, 스크린샷까지 포함했습니다.

## 오픈소스 가치

AI coding agent, cron 자동화, MCP tool, workflow automation이 늘어나면서 개발자는 단순 로그 이상의 운영 콘솔이 필요합니다. AgentDock은 Grafana처럼 메트릭만 보는 도구도 아니고, n8n처럼 workflow 실행만 하는 도구도 아닙니다. agent registry, approval queue, failure triage, connector health, activity timeline을 하나의 operator cockpit으로 묶는 프로젝트입니다.

## Codex/ChatGPT Pro/API credits 활용 계획

- connector 구현과 테스트 작성
- PR 리뷰와 보안/승인 로직 회귀 점검
- redaction, approval receipt, action fingerprint 같은 안전 경계 검토
- README, release note, issue triage, contributor guide 작성
- 사용자 피드백을 구현 가능한 task로 정리

## 제출 전 수동 입력

- GitHub 공개 repo URL
- OpenAI Organization ID
- 필요 시 본인 역할: Creator and maintainer
