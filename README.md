## 🌊 고립 그리고 연결 | PROJECT CONTACT ##

> 팀 프로젝트 | React + Node.js + MySQL + OpenAI GPT + 3D 인터랙션 + 통계 시각화 + 채팅 검열 시스템

<br>

---

## 📌 프로젝트 개요

사회적 고립과 관계 회복을 주제로 한 AI 기반 인터랙티브 설문/분석 플랫폼입니다.  
사용자는 선택형 내러티브 설문에 참여하고, 응답 데이터는 MySQL DB에 저장됩니다. 이후 GPT 기반 분석을 통해 개인 결과 리포트를 제공하며, 전체 참여자의 응답은 통계 시각화, 채팅, 3D 인터랙션 콘텐츠로 확장됩니다.

<br>

---

## 🛠️ 기술 스택

| 구분 | 기술 | 역할 |
|---|---|---|
| Frontend | React / JavaScript / CSS | 화면 구성, 설문 UI, 결과/통계/채팅 화면 구현 |
| Build Tool | Vite | 프론트엔드 개발 서버 및 빌드 |
| Routing | React Router DOM | Step1, Step2, Step3 페이지 라우팅 |
| Backend | Node.js / Express | REST API 서버, 비즈니스 로직 처리 |
| Database | MySQL / Aiven Cloud | 설문 응답, 참여자 정보, 통계, 채팅 데이터 저장 |
| AI 분석 | OpenAI GPT-4o mini | 개인 결과 분석, 주관식 감정 분류 |
| RAG | Prompt-based RAG | 고립 척도 기준 문맥을 프롬프트에 주입하여 분석 |
| 3D | Three.js / React Three Fiber / Drei | Step2 심해 3D 인터랙션 구현 |
| Physics | Matter.js | Step3 참여자 입자 시각화 |
| Animation | GSAP / Framer Motion | 모달, 화면 전환, 인터랙션 애니메이션 |
| Filtering | fastscanner / Trie Algorithm | 채팅 금칙어 1차 필터링 |
| Tool | VS Code / Chrome DevTools / Git / GitHub | 개발, 디버깅, 버전 관리 |

<br>

---

## 📁 프로젝트 구조

```bash
dongaProject/
├── server/
│   ├── index.js                    # Express 서버 진입점
│   ├── config/
│   │   └── db.js                   # MySQL DB 연결 설정
│   ├── controllers/                # API 요청 처리
│   ├── routes/                     # API 라우트 정의
│   ├── repositories/               # DB 쿼리 계층
│   ├── services/                   # 비즈니스 로직
│   ├── prompts/                    # GPT 분석/검열 프롬프트
│   ├── utils/
│   │   └── fastscanner.js          # Trie 기반 금칙어 필터
│   └── data/                       # 금칙어 리스트 CSV/TXT
│
├── src/
│   ├── App.jsx                     # 전체 라우팅 구조
│   ├── components/
│   │   ├── contents/
│   │   │   ├── stepA/
│   │   │   │   └── Branch.jsx      # Step1 설문/선택형 내러티브
│   │   │   ├── stepB/
│   │   │   │   └── Scrolling.jsx   # Step2 3D 심해 인터랙션
│   │   │   └── stepC/
│   │   │       └── Layering.jsx    # Step3 결과/통계/채팅 화면
│   │   └── main/                   # 메인 화면 컴포넌트
│   └── index.css                   # 전역 스타일
│
├── public/
│   ├── img/                        # 화면/썸네일/배경 이미지
│   ├── video/                      # Scene 영상 리소스
│   ├── audio/                      # BGM 및 효과음
│   └── file/                       # 척도 PDF 및 참고 자료
│
├── package.json
└── vite.config.js
```

<br>

---

## ✨ 주요 기능

### 🧩 Step1. 인터랙티브 설문
- 일반 폼이 아닌 선택형 내러티브 구조로 설문 진행
- 객관식 선택지는 점수로 합산
- 주관식 답변은 DB에 저장 후 AI 분석 및 감정 분류에 활용
- 참여자 정보와 응답 데이터를 MySQL에 저장

<br>

### 🤖 AI 기반 결과 분석
- GPT-4o mini를 활용해 개인 결과 리포트 생성
- 고립 척도 기준 문맥을 프롬프트에 포함하는 Prompt-based RAG 구조 사용
- 결과 분석은 `survey_participants.result_analysis`에 저장
- 주관식 답변은 `answer_text_feeling`으로 긍정(G), 부정(B), 중립(S) 분류

<br>

### 🔐 쿠키 기반 개인 결과 조회
- 로그인 없이 `isolation_user_info` 쿠키로 사용자 식별
- 쿠키의 participant id를 기준으로 개인 설문 결과 조회
- `survey_participants`, `user_responses`, `scenes_metadata`, `scene_options` 조인
- 개인 점수, AI 분석 결과, Scene별 응답 목록 반환

<br>

### 🌊 Step2. 3D 심해 인터랙션
- Three.js, React Three Fiber, Drei 기반 3D 시각화
- 고립감을 심해 공간으로 표현
- 데스크톱에서는 마우스 시선 이동
- 모바일에서는 자이로스코프 기반 화면 반응
- BGM, 영상, 스크롤 이벤트를 결합한 몰입형 화면 구성

<br>

### 🏙️ Step3. 결과 / 통계 / 채팅 화면
- 모바일 중심 세로형 UI
- 정보, 채팅창, 설문결과, 통계 메뉴 구성
- 메뉴 클릭 시 Full-screen Modal 방식으로 콘텐츠 제공
- 설문 결과는 개인화된 질문/답변 형태로 출력

<br>

### 📊 전체 통계 API
- 연령대, 성별, Scene, 응답 기준으로 통계 집계
- 객관식은 `option_id` 기준 집계
- 주관식은 `answer_text_feeling` 기준으로 긍정/부정/중립 비율 계산
- count와 percentage를 함께 반환하여 원그래프에 활용

<br>

### ⚪ Matter.js 입자 시각화
- 전체 참여자 수를 기반으로 참여자 1명당 입자 1개 생성
- 위에서 아래로 떨어지는 물리 기반 애니메이션 구현
- 통계 데이터를 숫자가 아닌 시각적 참여감으로 표현

<br>

### 💬 따뜻한 한마디 채팅
- 사용자가 익명 응원 메시지를 등록
- 내 메시지는 오른쪽, 타인 메시지는 왼쪽 정렬
- 내가 쓴 메시지 보기 기능 제공
- PASS 상태 메시지만 화면에 노출

<br>

### 🛡️ Trie + GPT 기반 채팅 검열
- 메시지 등록 시 `cheer_messages`에 PENDING 저장
- fastscanner Trie로 금칙어 1차 필터링
- 통과한 메시지만 GPT-4o mini로 문맥 검열
- PASS / FAIL / 닉네임만 위반 케이스 처리
- 부적절한 메시지는 화면에 노출하지 않음

<br>

---

## 🗄️ DB 구조

```sql
-- 참여자 정보
CREATE TABLE survey_participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(50),
    age INT,
    gender ENUM('M', 'F'),
    total_score INT,
    result_analysis TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scene 메타데이터
CREATE TABLE scenes_metadata (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scene_code VARCHAR(50) UNIQUE,
    title VARCHAR(100),
    narration TEXT,
    interaction_type ENUM('none', 'input', 'choice'),
    interaction_key VARCHAR(50),
    interaction_label VARCHAR(255)
);

-- 선택지 정보
CREATE TABLE scene_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scene_id INT,
    option_text VARCHAR(255),
    score INT,
    next_scene_code VARCHAR(50)
);

-- 사용자 응답
CREATE TABLE user_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    participant_id INT,
    scene_id INT,
    option_id INT NULL,
    answer_text TEXT,
    answer_text_feeling ENUM('G', 'B', 'S')
);

-- 따뜻한 한마디
CREATE TABLE cheer_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    nickname VARCHAR(50),
    message VARCHAR(500),
    status VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- B/C 콘텐츠 자료
CREATE TABLE content_b_db (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('1', '2', '3', '4'),
    generation ENUM('YB', 'OB'),
    title VARCHAR(500),
    summary TEXT,
    url VARCHAR(1000),
    created_at DATETIME
);
```

<br>

---

## 🔌 API 엔드포인트

| Method | Endpoint | 설명 |
|---|---|---|
| GET | `/api/health` | 서버/DB 상태 확인 |
| GET | `/api/scenes` | Scene 데이터 조회 |
| POST | `/api/isolation/result` | 설문 응답 저장 및 결과 생성 |
| GET | `/api/isolation/survey-results` | 개인 설문 결과 조회 |
| GET | `/api/isolation/statistics` | 전체 통계 데이터 조회 |
| GET | `/api/content-b` | 세대별 콘텐츠 자료 조회 |
| GET | `/api/warm/messages` | PASS 처리된 응원 메시지 조회 |
| GET | `/api/warm/messages/mine` | 내가 작성한 메시지 조회 |
| POST | `/api/warm/messages` | 응원 메시지 등록 및 검열 요청 |

<br>

---

## 📊 시스템 아키텍처

```text
[Client - React/Vite]
        │
        │ fetch()
        ▼
[Express Server - Node.js]
  ├── 설문 저장 / 점수 산출 API
  ├── GPT 결과 분석 서비스
  ├── 개인 결과 조회 API
  ├── 통계 집계 API
  ├── 세대별 콘텐츠 조회 API
  └── Trie + GPT 채팅 검열 API
        │
        ├──────────────▶ [OpenAI API]
        │                  ├── GPT 결과 분석
        │                  ├── 주관식 감정 분류
        │                  └── 채팅 문맥 검열
        │
        ▼
[MySQL - Aiven Cloud]
  ├── survey_participants
  ├── scenes_metadata
  ├── scene_options
  ├── user_responses
  ├── cheer_messages
  └── content_b_db
```

<br>

---

## 📎 프로젝트 SLIDE

<img width="2560" height="1440" alt="슬라이드1" src="public/img/ppt/1.png" />
<br>
<br>
<img width="2560" height="1440" alt="슬라이드2" src="public/img/ppt/2.png" />
<br>
<br>
<img width="2560" height="1440" alt="슬라이드3" src="public/img/ppt/3.png" />
<br>
<br>
<img width="2560" height="1440" alt="슬라이드4" src="public/img/ppt/4.png" />
<br>
<br>
<img width="2560" height="1440" alt="슬라이드5" src="public/img/ppt/5.png" />
<br>
<br>
<img width="2560" height="1440" alt="슬라이드6" src="public/img/ppt/6.png" />
<br>
<br>
<img width="2560" height="1440" alt="슬라이드7" src="public/img/ppt/7.png" />
<br>
<br>
<img width="2560" height="1440" alt="슬라이드8" src="public/img/ppt/8.png" />
<br>
<br>
<img width="2560" height="1440" alt="슬라이드9" src="public/img/ppt/9.png" />
<br>
<br>
<img width="2560" height="1440" alt="슬라이드10" src="public/img/ppt/10.png" />
<br>
<br>
<img width="2560" height="1440" alt="슬라이드11" src="public/img/ppt/11.png" />
<br>
<br>
<img width="2560" height="1440" alt="슬라이드12" src="public/img/ppt/12.png" />
<br>
<br>
<img width="2560" height="1440" alt="슬라이드13" src="public/img/ppt/13.png" />
<br>
<br>
<img width="2560" height="1440" alt="슬라이드14" src="public/img/ppt/14.png" />
<br>
<br>
<img width="2560" height="1440" alt="슬라이드15" src="public/img/ppt/15.png" />
<br>
<br>
<img width="2560" height="1440" alt="슬라이드16" src="public/img/ppt/16.png" />
<br>
<br>
<img width="2560" height="1440" alt="슬라이드17" src="public/img/ppt/17.png" />
<br>
<br>
<img width="2560" height="1440" alt="슬라이드18" src="public/img/ppt/18.png" />

<br>

---

## 🚀 개선사항

<b>1. 검색형 RAG 구조 고도화</b>  
현재는 참고 문맥을 프롬프트에 직접 주입하는 Prompt-based RAG 방식으로 구현했습니다. 추후 `text-embedding-3-small`과 Vector DB를 활용하면 문서 검색 기반 RAG로 확장할 수 있습니다.

<b>2. 관리자 페이지 추가</b>  
설문 응답, 통계 데이터, 채팅 검열 상태를 운영자가 직접 확인하고 관리할 수 있는 어드민 페이지를 추가하면 운영 효율을 높일 수 있습니다.

<b>3. 모바일 3D 성능 최적화</b>  
Step2 심해 3D 콘텐츠는 모바일 기기 성능에 따라 프레임드랍이 발생할 수 있어, 기기 성능별 이펙트 단계 조절과 리소스 경량화가 필요합니다.

<b>4. 사용자 식별 안정성 강화</b>  
현재는 쿠키 기반 participant id로 개인 결과를 조회합니다. 추후 공유 링크, 복구 코드, 세션 만료 처리 등을 추가하면 재방문 안정성을 높일 수 있습니다.

<b>5. 통계/검열 관리 기능 확장</b>  
통계 데이터 다운로드, 검열 로그 확인, FAIL 메시지 재검토 기능 등을 추가하면 서비스 운영과 데이터 분석 활용도를 높일 수 있습니다.