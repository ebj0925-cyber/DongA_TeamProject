# 조은정 팀 프로젝트 자료

> 동아일보 팀 프로젝트 **PROJECT CONTACT**에서 조은정 개인 기여 자료를 모아 정리한 포트폴리오용 폴더입니다.

## 주요 링크

<p>
  <a href="https://projectcontact2026.onrender.com/">
    <img height="38" src="https://img.shields.io/badge/PROJECT_CONTACT-라이브_사이트-1f3864?style=for-the-badge" alt="PROJECT CONTACT 라이브 사이트">
  </a>
  <a href="https://app.notion.com/p/C-_-337439bdd4f580c7a8f3d10c81a25347?source=copy_link">
    <img height="38" src="https://img.shields.io/badge/C구간_작업-Notion-111111?style=for-the-badge" alt="C구간 작업 Notion">
  </a>
</p>

---

## 프로젝트 한눈에 보기

| 항목 | 내용 |
|---|---|
| 프로젝트명 | PROJECT CONTACT |
| 주제 | 고립과 관계 단절을 체험하고 회복 가능성을 탐색하는 인터랙티브 콘텐츠 |
| 팀 프로젝트 | DongA Team Project |
| 개인 담당 | C구간 자료조사, 작업일지 작성, 문서화, 발표/포트폴리오 정리 |
| 라이브 사이트 | [PROJECT CONTACT 라이브 사이트](https://projectcontact2026.onrender.com/) - 실제 프로젝트 결과물을 확인할 수 있는 배포 사이트 |
| Notion | [C구간 작업 Notion](https://app.notion.com/p/C-_-337439bdd4f580c7a8f3d10c81a25347?source=copy_link) - C구간 자료조사와 작업 내용을 정리한 Notion 페이지 |

---

## 개인 작업 바로가기

| 자료 | 파일 |
|---|---|
| 개인 포트폴리오 | [JoEunjung_ProjectContact_Portfolio.pptx](./portfolio/JoEunjung_ProjectContact_Portfolio.pptx) |
| 개인 포트폴리오 PDF | [JoEunjung_ProjectContact_Portfolio.pdf](./portfolio/JoEunjung_ProjectContact_Portfolio.pdf) |
| 개인 작업일지 PDF | [JoEunjung_Project_WorkLog.pdf](./work-log/JoEunjung_Project_WorkLog.pdf) |
| 수행 계획서 PDF | [JoEunjung_Project_Plan.pdf](./work-log/JoEunjung_Project_Plan.pdf) |
| 팀 작업일지 PDF | [PROJECT_CONTACT_Team_WorkLog.pdf](./work-log/PROJECT_CONTACT_Team_WorkLog.pdf) |
| C구간 자료조사 | [SectionC_Articles_Institutions_Papers.docx](./research/SectionC_Articles_Institutions_Papers.docx) |
| 지원기관 정리 이미지 | [SectionC_Support_Institutions.png](./research/SectionC_Support_Institutions.png) |
| 수행계획서 캡처 | [assets/screenshots](./assets/screenshots/) |
| 포트폴리오 이미지 | [img](./img/) |

---

## 담당 역할

| 구분 | 수행 내용 |
|---|---|
| 자료조사 | C구간에 필요한 기사, 기관, 공공 지원사업, 논문 자료 조사 |
| 정보 정리 | 도시 정보 레이어와 지원기관 안내에 활용할 자료 구조화 |
| 문서화 | 개인 작업일지, 팀 작업일지, 수행 계획서 정리 |
| 발표자료 | 팀 발표 흐름과 개인 포트폴리오 자료 구성 보조 |
| 기록 관리 | 프로젝트 진행 과정, 피드백, 산출물, 향후 보완 사항 기록 |

---

## C콘텐츠 관련 프로젝트 구조

```text
projectcontact2026-main/
+-- src/
|   +-- components/
|       +-- contents/
|           +-- stepC/
|               +-- Layering.jsx       # C구간 탭, 채팅, 설문결과, 통계 화면
|               +-- Layering.css       # C구간 도시 레이어 UI 스타일
|   +-- db/
|       +-- insideList.js              # C구간 관련 정보 데이터
|       +-- navi.js                    # 화면 이동/메뉴 데이터
+-- public/
|   +-- img/
|       +-- c_sum/
|       |   +-- C_sum_main.png
|       |   +-- CSimg001.png ... CSimg004.png
|       +-- C_result/
|           +-- 0001.png ... 0013.png
+-- server/
    +-- controllers/
    |   +-- warmMessageController.js   # 따뜻한 한마디 API 처리
    +-- services/
    |   +-- warmMessageService.js      # 메시지 필터링/검수 흐름
    |   +-- statisticsService.js       # 통계 데이터 가공
    +-- repositories/
        +-- statisticsRepository.js    # 설문 응답 통계 SQL
        +-- warmMessageRepository.js   # 응원 메시지 DB 조회/저장
```

---

## 포트폴리오 전체보기

최신 개인 포트폴리오 PPTX와 PDF를 함께 업로드했고, 슬라이드 이미지는 아래에서 바로 확인할 수 있습니다.

| 슬라이드 |
|---|
| <img src="./img/slide_01.png" width="760" alt="슬라이드 1"> |
| <img src="./img/slide_02.png" width="760" alt="슬라이드 2"> |
| <img src="./img/slide_03.png" width="760" alt="슬라이드 3"> |
| <img src="./img/slide_04.png" width="760" alt="슬라이드 4"> |
| <img src="./img/slide_05.png" width="760" alt="슬라이드 5"> |
| <img src="./img/slide_06.png" width="760" alt="슬라이드 6"> |
| <img src="./img/slide_07.png" width="760" alt="슬라이드 7"> |
| <img src="./img/slide_08.png" width="760" alt="슬라이드 8"> |
| <img src="./img/slide_09.png" width="760" alt="슬라이드 9"> |
| <img src="./img/slide_10.png" width="760" alt="슬라이드 10"> |
| <img src="./img/slide_11.png" width="760" alt="슬라이드 11"> |
| <img src="./img/slide_12.png" width="760" alt="슬라이드 12"> |
| <img src="./img/slide_13.png" width="760" alt="슬라이드 13"> |
| <img src="./img/slide_14.png" width="760" alt="슬라이드 14"> |
| <img src="./img/slide_15.png" width="760" alt="슬라이드 15"> |
| <img src="./img/slide_16.png" width="760" alt="슬라이드 16"> |
| <img src="./img/slide_17.png" width="760" alt="슬라이드 17"> |
| <img src="./img/slide_18.png" width="760" alt="슬라이드 18"> |

---

## 작업 캡처

| C구간 도시 메뉴 | C구간 응원 메시지 DB |
|---|---|
| <img src="./assets/screenshots/plan_capture_08.jpeg" width="320" alt="C구간 도시 메뉴 화면"> | <img src="./assets/screenshots/plan_capture_04.png" width="320" alt="C구간 응원 메시지 DB 화면"> |

| C구간 응답 통계 시각화 | C구간 개인 설문 리포트 |
|---|---|
| <img src="./assets/screenshots/plan_capture_02.jpeg" width="320" alt="C구간 응답 통계 시각화 화면"> | <img src="./assets/screenshots/plan_capture_11.png" width="320" alt="C구간 개인 설문 리포트 화면"> |

---

## 포함 파일

| 구분 | 파일 | 설명 |
|---|---|---|
| 포트폴리오 | `portfolio/JoEunjung_ProjectContact_Portfolio.pptx` | 개인 포트폴리오 발표자료 |
| 포트폴리오 PDF | `portfolio/JoEunjung_ProjectContact_Portfolio.pdf` | GitHub에서 바로 확인하기 쉬운 PDF 버전 |
| 포트폴리오 이미지 | `img/slide_01.png` ~ `img/slide_18.png` | README 미리보기용 슬라이드 이미지 |
| 개인 작업일지 | `work-log/JoEunjung_Project_WorkLog.pdf` / `work-log/JoEunjung_Project_WorkLog.docx` | 조은정 개인 작업일지 |
| 수행 계획서 | `work-log/JoEunjung_Project_Plan.pdf` / `work-log/JoEunjung_Project_Plan.docx` | 프로젝트 과제 수행 계획서 |
| 팀 작업일지 | `work-log/PROJECT_CONTACT_Team_WorkLog.pdf` / `work-log/PROJECT_CONTACT_Team_WorkLog_0512.docx` | PROJECT CONTACT 팀 작업일지 |
| 자료조사 | `research/SectionC_Articles_Institutions_Papers.docx` | C구간 기사, 기관, 논문 정리 자료 |
| 자료 이미지 | `research/SectionC_Support_Institutions.png` | 고립·은둔 청년 지원기관 정리 이미지 |
| Notion | `notion/Notion_Link.md` | Notion 작업 페이지 링크 |

---

## 포트폴리오 제출 참고

작업일지와 수행 계획서는 GitHub에서 바로 확인하기 쉽도록 PDF 파일을 함께 포함했습니다.
추후 수정이 가능하도록 PPTX, DOCX 원본 파일도 함께 보관했습니다.

개인 포트폴리오는 PPTX 원본, PDF 제출본, README 미리보기용 슬라이드 이미지 파일을 함께 포함했습니다.
