# 🧩 매일도쿠

매일 새로운 스도쿠 퍼즐을 풀고 기록을 남기는 웹 애플리케이션입니다.

## ✨ 주요 기능

- **난이도별 퍼즐**: 쉬움, 보통, 어려움 난이도 선택 가능
- **타이머**: 퍼즐 풀이 시간 측정
- **메모 기능**: 가능한 숫자를 메모로 기록
- **힌트 시스템**: 최대 3번의 힌트 제공
- **실행 취소/다시 실행**: 실수한 경우 되돌리기 가능
- **기록 저장**: Supabase를 통한 퍼즐 풀이 기록 저장
- **사용자 인증**: 로그인/로그아웃 기능

## 🛠️ 기술 스택

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Authentication, Database)

## 🚀 시작하기

1. 저장소 클론

```bash
git clone https://github.com/yourusername/maeil-doku.git
```

2. 의존성 설치

```bash
npm install
```

3. 환경 변수 설정
   `.env` 파일을 생성하고 다음 변수를 설정하세요:

```
VITE_SUPABASE_URL=https://jhfhpzfadfjbytsimngu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoZmhwemZhZGZqYnl0c2ltbmd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMTQ3NTYsImV4cCI6MjA2NDc5MDc1Nn0.PJ_5oq2WgXaZG9LEHRMTWc0oxFLqq-FkOVrKTSwptUA
```

4. 개발 서버 실행

```bash
npm run dev
```

## 라이선스

MIT License
