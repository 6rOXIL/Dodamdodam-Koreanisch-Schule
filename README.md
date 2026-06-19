# dodamdodam

Next.js 기반 프로젝트입니다.

## 다른 컴퓨터에서 Docker로 실행하기

### 필요한 것

- [Docker](https://docs.docker.com/get-docker/) (Docker Compose 포함 권장)

### 1) 저장소 가져오기

```bash
git clone https://github.com/6rOXIL/Dodamdodam-Koreanisch-Schule.git
cd Dodamdodam-Koreanisch-Schule
```

(압축만 있다면 풀고 그 폴더로 이동하면 됩니다.)

### 2) 프로덕션 이미지 빌드 후 실행 (권장: Compose)

프로젝트 루트에서:

```bash
docker compose up --build
```

- 첫 빌드는 의존성 설치와 `next build` 때문에 시간이 걸릴 수 있습니다.
- 컨테이너가 뜨면 브라우저에서 **http://localhost:3000** 로 접속합니다.  
  (`docker-compose.yml`에서 호스트 `3000` → 컨테이너 `3000`으로 매핑되어 있습니다.)

백그라운드 실행:

```bash
docker compose up -d --build
```

중지:

```bash
docker compose down
```

### 3) Dockerfile만으로 실행 (Compose 없이)

```bash
docker build -t dodamdodam .
docker run --rm -p 3000:3000 dodamdodam
```

접속 주소: **http://localhost:3000**

### 4) 개발 모드 (핫 리로드, 로컬 소스 마운트)

로컬에서 코드를 수정하며 보려면:

```bash
docker compose -f docker-compose.dev.yml up --build
```

역시 **http://localhost:3000** 입니다.

---

## 코리안넷 공지 자동 동기화

공지 **최근 10건**은 GitHub Actions가 코리안넷에서 스크래핑해 **Supabase `public_notices`** 테이블에 저장합니다. 사이트에서는 내부 페이지(`/events/[번호]/`)로 본문을 보여 줍니다.

| 트리거 | 동작 |
|--------|------|
| **매일 02:00 MEZ** (독일 표준시) | Supabase 동기화 |
| `main` 푸시 | (선택) 동기화 시도 후 GitHub Pages 배포 |
| 수동 | Actions → **Sync legacy notices** → Run workflow |

GitHub 저장소 **Secrets**에 다음을 등록해야 합니다.

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon public key (빌드 시 클라이언트 번들에 포함됨)
- `SUPABASE_SERVICE_ROLE_KEY` — 공지 동기화 스크립트용 (서버 전용)

> GitHub Pages는 정적 배포이므로 `NEXT_PUBLIC_*` 값은 **Build 단계**에서 주입되어야 합니다. Secrets만 등록하고 재배포하면 브라우저 오류가 사라집니다.

Supabase에 마이그레이션 적용:

**방법 A — CLI (권장, 최초 1회만 로그인·연결)**

```bash
npm install
npx supabase login
npx supabase link --project-ref <프로젝트_REF>
npm run db:push
```

- 프로젝트 REF: [Supabase Dashboard](https://supabase.com/dashboard) → 프로젝트 → **Settings → General → Reference ID**
- `supabase: command not found` 가 나오면 전역 설치 대신 위처럼 `npx` 또는 `npm run db:push` 를 사용하세요.

**방법 B — Dashboard SQL Editor**

CLI 없이 적용하려면 `supabase/migrations/` 폴더의 `.sql` 파일을 **파일명 순서대로** SQL Editor에 붙여넣어 실행합니다.

**이미 SQL Editor로 스키마를 만든 경우 (`user_role already exists` 등)**

원격 DB에는 테이블이 있지만 CLI 마이그레이션 이력이 비어 있을 수 있습니다. 이미 적용된 버전을 이력에 등록한 뒤, 남은 것만 push합니다.

```bash
# 예: init ~ fixed_resource_categories 까지 이미 수동 적용됨
npx supabase migration repair 20260517000000 20260611010000 20260611020000 20260612000000 20260619000000 20260620000000 --status applied
npx supabase db push --include-all
```

`migration repair`에 넣을 버전은 `npx supabase migration list`와 Dashboard에서 실제로 존재하는 테이블·정책을 보고 맞춥니다.

로컬 동기화 (`.env.local`에 Supabase 키 필요):

```bash
npm run sync:notices
```

> GitHub cron은 UTC 기준입니다. `01:00 UTC` = 독일 **02:00 (겨울)** / **03:00 (여름)**.

---

## GitHub Pages 최초 설정 (1회)

`Deploy to GitHub Pages` 워크플로가 실패하고 **Get Pages site failed** 가 나오면, 저장소에서 Pages가 아직 켜져 있지 않은 상태입니다.

1. [저장소 Settings → Pages](https://github.com/6rOXIL/Dodamdodam-Koreanisch-Schule/settings/pages) 로 이동
2. **Build and deployment → Source** 에서 **GitHub Actions** 선택
3. Actions 탭에서 실패한 **Deploy to GitHub Pages** 워크플로를 **Re-run** 하거나 `main`에 다시 푸시

배포 URL: `https://6roxil.github.io/Dodamdodam-Koreanisch-Schule/`

---

## 배포 대상별 동작

- Docker(로컬/서버): 루트 경로(`/`) 기준으로 동작합니다.
- GitHub Pages: `GITHUB_ACTIONS=true` 또는 `DEPLOY_TARGET=github-pages`일 때만 `basePath`가 적용됩니다.

---

문제가 나면 Docker가 실행 중인지, 포트 3000이 이미 쓰이고 있지 않은지 확인하세요.

