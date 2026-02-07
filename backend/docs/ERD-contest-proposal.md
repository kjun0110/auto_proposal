# ERD: 발달장애 공모사업 크롤링 → AI 분류 → 제안서 생성

이 ERD는 **발달장애 대상 공모사업 크롤링 → AI 분류 → 제안서 자동 생성**을 목표로 한  
**DDD + 모듈형 모놀리식** 구조에 맞춰 설계되었습니다.

**핵심 원칙**

- 크롤링 / 판단 / 활용(제안서) 완전 분리
- AI 재판별 가능
- 기준 변경에도 RAW 재처리 가능

---

## 1. contest (공모 핵심 엔티티)

```sql
contest (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  organizer TEXT,
  organizer_type ENUM('정부','지자체','민간','기업','재단'),
  region TEXT,                 -- 전국 / 특정 지역
  start_date DATE,
  end_date DATE,
  application_method TEXT,
  source_url TEXT UNIQUE,
  source_site TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

- **팩트만 저장**
- 판단 로직 / AI 결과 없음

---

## 2. contest_classification (AI / 규칙 기반 판단 결과)

```sql
contest_classification (
  id UUID PRIMARY KEY,
  contest_id UUID REFERENCES contest(id),

  is_developmental_disability BOOLEAN,

  age_group ENUM('CHILD','TEEN','ADULT','ALL'),
  -- CHILD: 초등 / TEEN: 중·고 / ADULT: 성인 / ALL: 무관

  disability_types TEXT[],
  -- ['developmental', 'intellectual'] 등 확장 가능

  confidence FLOAT,
  keywords TEXT[],

  judged_by ENUM('rule','ai'),
  judged_at TIMESTAMP
)
```

- 연령대 분리 반영 (초중고 / 성인 / 무관)
- 발달장애 → 장애유형 확장 가능
- AI/규칙 혼합 판단

---

## 3. contest_raw (원본 크롤링 데이터)

```sql
contest_raw (
  id UUID PRIMARY KEY,
  contest_id UUID REFERENCES contest(id),

  raw_html TEXT,
  raw_text TEXT,

  crawl_time TIMESTAMP,
  crawler_name TEXT
)
```

- **재처리의 생명줄**
- 기준 변경 시 AI 재분석 가능

---

## 4. contest_metadata (비정형 확장 필드)

```sql
contest_metadata (
  id UUID PRIMARY KEY,
  contest_id UUID REFERENCES contest(id),
  metadata JSONB
)
```

예시:

```json
{
  "지원금액": "최대 5천만원",
  "선정규모": "10개 기관",
  "우대사항": ["발달장애 전문기관"]
}
```

- 사이트별 제각각 정보 대응
- 컬럼 폭발 방지

---

## 5. proposal_draft (AI 제안서 초안)

```sql
proposal_draft (
  id UUID PRIMARY KEY,
  contest_id UUID REFERENCES contest(id),

  content TEXT,

  created_by ENUM('ai','human'),
  version INT DEFAULT 1,

  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

- 버튼 기반 생성
- 버전 관리 가능
- Chat 수정 흐름 대응

---

## 6. 관계 요약

```
contest
  ├─ contest_raw (1:N)
  ├─ contest_metadata (1:1 or 1:N)
  ├─ contest_classification (1:N)
  └─ proposal_draft (1:N)
```

---

## 7. 도메인 매핑 및 확장 포인트

| 도메인 | 역할 | 비고 |
|--------|------|------|
| **crawling** | 정형 크롤링(service) / 비정형 크롤링(agent) | 규칙·정책 기반 분리 |
| **proposal** | 크롤링 데이터 기반 AI 제안서 생성 | 버튼 → 제안서 초안 |
| **hr** | 추후 엑셀 기반 시스템 이관 | 느슨한 결합 유지 |

- 크롤링 / AI 판단 / 제안서 생성 완전 분리
- 스타형 MCP / LangGraph 구조에 적합
- Gemini / EXAONE / GPT 교체 자유
- ESG / 교육 / 노인 복지 확장 가능
- HR(엑셀) 도메인과 느슨한 결합 유지

---

## 8. 다음 단계 (확장 시)

- SQLAlchemy 모델 코드
- Alembic 마이그레이션 전략
- AI 분류 JSON 스키마
- Proposal 프롬프트 템플릿
