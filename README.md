# 💼 FormMate

<img src="./images/logo.png" alt="FormMate logo" width="600"/>

> **개인 간 금전 대차 계약 관리 플랫폼**

**FormMate**는 개인 간 금전 거래를 더욱 **안전하고 체계적으로** 관리할 수 있도록 지원하는 플랫폼입니다.  
챗봇 기반 계약 작성부터 전자서명, 본인 인증, 이체 연동, 상환 일정 관리, 채팅, 추심청구서 발급까지  
금전 대차 전 과정을 디지털화하여 분쟁 없는 투명한 거래를 실현합니다.

---

## 🚀 주요 기능

- 🤖 챗봇 기반 **계약서 생성** 및 **전자서명**
- 🔐 **소셜 로그인 (Google, Naver)** 및 본인 인증
- 📆 **상환 일정/납부 금액** 자동 등록 및 리마인드 알림
- 💸 **이체 기능** 연동으로 원클릭 상환
- 💬 계약 당사자 간 **채팅** 기능
- 📊 계약별 전체/세부 **상환 현황 대시보드**

---

## 👥 팀원 소개

| 이름   | 역할                | 담당     | GitHub                                               |
| ------ | ------------------- | -------- | ---------------------------------------------------- |
| 차윤영 | Developer (팀장)    | Backend  | [github.com/yuncof](https://github.com/yuncof)       |
| 이동욱 | Developer (BE 팀장) | Backend  | [github.com/2Ludy](https://github.com/2Ludy)         |
| 강지은 | Developer (FE 팀장) | Frontend | [github.com/antdundun](https://github.com/antdundun) |
| 박상학 | Developer           | Backend  | [github.com/Sang-hak](https://github.com/Sang-hak)   |
| 오은지 | Developer           | Frontend | [github.com/oeg9176](https://github.com/oeg9176)     |
| 윤이영 | Developer           | Frontend | [github.com/y20ng](https://github.com/y20ng)         |

## 🔍 시스템 아키텍처

<img src="./images/architecture.png" alt="FormMate Architecture" width="600"/>

---

## 🛠️ 기술 스택

### 💻 프론트엔드

| 분류            | 기술                                                                                                                                                                                                  | 설명                             |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| 언어/프레임워크 | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)<br>![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) | 타입 안정성과 컴포넌트 기반 UI   |
| 상태 관리       | ![Zustand](https://img.shields.io/badge/Zustand-000000?style=flat&logo=zustand&logoColor=white)                                                                                                       | 전역 상태 관리                   |
| 서버 상태       | ![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=flat&logo=reactquery&logoColor=white)                                                                                    | API 요청/응답 캐싱 및 상태관리   |
| 스타일링        | ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)<br>![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=flat)                | 유틸리티 기반 CSS 및 UI 컴포넌트 |

---

### ⚙️ 백엔드

| 분류            | 기술                                                                                                                                                                                                                                                                                                            | 설명                           |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| 언어/프레임워크 | ![Java](https://img.shields.io/badge/Java%2017-007396?style=flat&logo=java&logoColor=white)<br>![Spring Boot](https://img.shields.io/badge/SpringBoot-6DB33F?style=flat&logo=springboot&logoColor=white)                                                                                                        | 백엔드 REST API 및 웹소켓 처리 |
| 데이터베이스    | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)<br>![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)                                                                                                                          | 메인 DB 및 세션 캐시           |
| 보안/인증       | ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)<br>![Google OAuth2](https://img.shields.io/badge/Google%20OAuth2-4285F4?style=flat&logo=google&logoColor=white)<br>![Naver OAuth2](https://img.shields.io/badge/Naver%20OAuth2-03C75A?style=flat&logoColor=white) | 인증/인가 처리                 |

---

### ☁️ 공통 인프라 및 협업 도구

| 분류          | 기술                                                                                                                                                                                                                                                                                   | 설명                                    |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| 메시징/알림   | ![WebSocket](https://img.shields.io/badge/WebSocket-000000?style=flat)<br>![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)<br>![CoolSMS](https://img.shields.io/badge/CoolSMS-00B2FF?style=flat&logoColor=white)                     | 실시간 채팅, 알림, 문자 인증            |
| 배포 & 인프라 | ![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat&logo=amazonaws&logoColor=white)<br>![NGINX](https://img.shields.io/badge/Nginx-009639?style=flat&logo=nginx&logoColor=white)<br>![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) | EC2, RDS, S3, 리버스 프록시, 컨테이너화 |
| 협업/관리     | ![GitLab](https://img.shields.io/badge/GitLab-FC6D26?style=flat&logo=gitlab&logoColor=white)<br>![Jira](https://img.shields.io/badge/Jira-0052CC?style=flat&logoColor=white)                                                                                                           | 형상관리 및 이슈 관리                   |
| 문서화        | ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat&logo=swagger&logoColor=black)                                                                                                                                                                                        | API 명세 자동화                         |

---

## 🧪 실행 방법

### ✅ 사전 준비

- `.env` 또는 환경변수에 다음 정보 설정:
  - DB, Redis, JWT, OAuth, Mail, Firebase, CoolSMS 등

### ✅ 빌드 및 실행

```bash
# 빌드
./gradlew build

# 실행
java -jar build/libs/formmate-0.0.1-SNAPSHOT.jar
```

> 기본 포트: **8088**

---

## 📘 API 문서

- Swagger UI: [`http://localhost:8088/api/swagger-ui.html`](http://localhost:8088/api/swagger-ui.html)

---

## 📄 라이선스

```
본 프로젝트는 교육과정의 일환으로 개발된 비상업적 프로젝트입니다.
상업적 목적의 사용을 금지합니다.
```

© 2025 FormMate. All Rights Reserved.
