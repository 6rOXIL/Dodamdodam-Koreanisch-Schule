# 정적 export(out)를 생성하는 빌드 단계
FROM node:24.13.0-alpine AS builder

WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# out 폴더를 서빙하는 런타임 단계
FROM nginx:1.27-alpine AS runner

COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 3000

CMD ["sh", "-c", "sed -i 's/listen       80;/listen       3000;/' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
