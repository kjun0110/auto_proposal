# Admin (Proposal 서비스 어드민)

frontend/main의 어드민용 메인 페이지입니다.

## 실행

```bash
npm install
npm run dev
```

- 개발 서버: **http://localhost:3001** (main이 3000이므로 3001 사용)
- 메인 서비스 링크는 기본 `http://localhost:3000`이며, `NEXT_PUBLIC_MAIN_APP_URL`로 변경 가능

## 구성

- **메인 페이지** (`src/app/page.tsx`): 어드민 대시 보드 진입 페이지, 메인 서비스로 이동 링크 제공
