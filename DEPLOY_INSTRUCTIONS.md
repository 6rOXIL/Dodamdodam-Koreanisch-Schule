# GitHub Pages 배포 가이드

## 워크플로우 파일 추가 방법

Personal Access Token 권한 문제로 워크플로우 파일이 제외되었습니다. 다음 방법 중 하나를 선택하세요:

### 방법 1: GitHub 웹 인터페이스에서 직접 추가 (권장)

1. GitHub 리포지토리로 이동: https://github.com/hjqueeen/amins_home
2. `.github/workflows/` 폴더 생성 (없는 경우)
3. `deploy.yml` 파일 생성하고 아래 내용 복사:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        env:
          GITHUB_REPOSITORY_NAME: ${{ github.event.repository.name }}
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './out'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 방법 2: Personal Access Token 권한 수정

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 사용 중인 토큰 선택 또는 새 토큰 생성
3. `workflow` 스코프 체크
4. 토큰 업데이트 후 다시 푸시

### 방법 3: SSH 키 사용

SSH 키를 사용하면 워크플로우 파일을 직접 푸시할 수 있습니다.

## GitHub Pages 설정

1. 리포지토리 Settings → Pages
2. Source: "GitHub Actions" 선택
3. 저장

## 배포 확인

`main` 브랜치에 푸시하면 자동으로 빌드 및 배포됩니다.
배포된 사이트: `https://hjqueeen.github.io/amins_home/`
