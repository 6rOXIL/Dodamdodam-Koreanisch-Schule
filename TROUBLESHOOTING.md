# GitHub Pages 배포 문제 해결 가이드

## 페이지가 나타나지 않는 경우

### 1. GitHub Actions 확인
1. 리포지토리의 **Actions** 탭으로 이동
2. 최근 워크플로우 실행 확인
3. 빌드가 성공했는지 확인
4. 에러가 있다면 로그 확인

### 2. GitHub Pages 설정 확인
1. 리포지토리 **Settings** → **Pages**
2. **Source**가 **"GitHub Actions"**로 설정되어 있는지 확인
3. **Branch**는 설정하지 않아도 됨 (GitHub Actions 사용 시)

### 3. 환경(Environment) 권한 확인
1. **Settings** → **Environments** → **github-pages**
2. **Deployment branches**가 **"All branches"** 또는 **"main"**으로 설정되어 있는지 확인
3. 필요시 **"Allow all actors"** 체크

### 4. 수동으로 워크플로우 실행
1. **Actions** 탭으로 이동
2. **"Deploy to GitHub Pages"** 워크플로우 선택
3. **"Run workflow"** 버튼 클릭
4. **main** 브랜치 선택 후 실행

### 5. 빌드 아티팩트 확인
1. **Actions** 탭에서 최근 실행 클릭
2. **build** 작업 확인
3. **"Upload artifact"** 단계가 성공했는지 확인
4. **"out"** 폴더가 생성되었는지 확인

### 6. URL 확인
배포된 사이트 URL:
- `https://hjqueeen.github.io/amins_home/`

**주의**: URL 끝에 슬래시(`/`)가 있어야 합니다!

### 7. 브라우저 캐시 클리어
- Ctrl+Shift+R (Windows/Linux)
- Cmd+Shift+R (Mac)

### 8. 배포 상태 확인
1. 리포지토리 **Settings** → **Pages**
2. **"Your site is live at"** 메시지 확인
3. 배포 상태가 **"Active"**인지 확인

## 일반적인 문제들

### 문제: 404 에러
- **원인**: basePath 설정 문제
- **해결**: `next.config.js`의 `repositoryName`이 리포지토리 이름과 일치하는지 확인

### 문제: 빌드 실패
- **원인**: 의존성 문제 또는 빌드 에러
- **해결**: Actions 로그에서 에러 메시지 확인

### 문제: 페이지는 보이지만 스타일/이미지가 안 보임
- **원인**: assetPrefix 설정 문제
- **해결**: `next.config.js` 확인

## 디버깅 체크리스트

- [ ] GitHub Actions 워크플로우가 실행되었는가?
- [ ] 빌드가 성공했는가?
- [ ] Pages 설정에서 Source가 "GitHub Actions"인가?
- [ ] URL이 올바른가? (리포지토리 이름 포함)
- [ ] 브라우저 캐시를 클리어했는가?
- [ ] 배포가 완료되었는가? (몇 분 소요될 수 있음)
