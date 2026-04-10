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
- 컨테이너가 뜨면 브라우저에서 **http://localhost:3001** 로 접속합니다.  
  (`docker-compose.yml`에서 호스트 `3001` → 컨테이너 `3000`으로 매핑되어 있습니다.)

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
docker run --rm -p 3001:3000 dodamdodam
```

접속 주소: **http://localhost:3001**

### 4) 개발 모드 (핫 리로드, 로컬 소스 마운트)

로컬에서 코드를 수정하며 보려면:

```bash
docker compose -f docker-compose.dev.yml up --build
```

역시 **http://localhost:3001** 입니다.

---

## 배포 대상별 동작

- Docker(로컬/서버): 루트 경로(`/`) 기준으로 동작합니다.
- GitHub Pages: `GITHUB_ACTIONS=true` 또는 `DEPLOY_TARGET=github-pages`일 때만 `basePath`가 적용됩니다.

---

문제가 나면 Docker가 실행 중인지, 포트 3001이 이미 쓰이고 있지 않은지 확인하세요.
