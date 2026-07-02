# AgentDock 데모 스크립트

## 30초 소개

AgentDock은 여러 AI 에이전트와 자동화를 운영하는 개발자를 위한 self-hosted control plane입니다. 에이전트가 언제 실행됐는지, 무엇이 실패했는지, 어떤 위험 액션이 승인을 기다리는지, 어떤 connector가 degraded인지 한 화면에서 보여줍니다.

## 2분 데모 흐름

1. **Today Cockpit**
   - 오늘 운영자가 봐야 하는 항목을 먼저 보여줍니다.
   - `blocked_action`, `approval`, `failure`, `event`가 한 큐에 정리됩니다.

2. **Agent Registry**
   - Blog Scout, Calendar Watch, GitHub Maintainer, Security Lab Watch, Investment Guard 같은 agent/job을 보여줍니다.
   - 각 agent의 status, risk, last output을 확인합니다.

3. **Pending Approval**
   - 외부 write, publish, financial action처럼 위험도가 있는 요청을 보여줍니다.
   - 현재 MVP는 read-only라 승인 버튼을 실제 실행하지 않습니다.

4. **Failure Triage**
   - 실패 원인과 suggested fix를 함께 보여줍니다.
   - 운영자는 여기서 재시도/조사 우선순위를 정할 수 있습니다.

5. **Connectors / Timeline**
   - Hermes Cron, GitHub, Google Calendar, Loki 같은 connector 상태와 최근 이벤트를 확인합니다.

## 강조할 안전 설계

- 모든 `POST /api/*`는 `405`로 차단됩니다.
- token-like 문자열은 public state에서 redaction됩니다.
- v0.1은 read-only MVP이며, 액션 실행은 durable approval receipt 이후 단계로 분리했습니다.

## 마무리 문장

AgentDock은 AI 에이전트가 늘어날수록 필요한 “운영자의 관제/승인/감사 레이어”를 self-hosted 방식으로 제공하는 프로젝트입니다.
