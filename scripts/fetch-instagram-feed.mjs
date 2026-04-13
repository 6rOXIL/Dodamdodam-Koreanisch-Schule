#!/usr/bin/env node
/**
 * Instagram Graph API로 최근 미디어를 받아 src/lib/data/instagramFeed.json 에 저장합니다.
 *
 * 필요 조건:
 * - Instagram Professional(비즈니스 또는 크리에이터) 계정
 * - Facebook 페이지에 연결
 * - Meta 개발자 앱에서 instagram_basic(또는 최신 권한) + 페이지 액세스 토큰
 *
 * 환경 변수:
 *   IG_ACCESS_TOKEN  페이지(또는 IG용) 장기 토큰
 *   IG_USER_ID       Instagram Business Account ID (숫자)
 *
 * 실행: IG_ACCESS_TOKEN=... IG_USER_ID=... node scripts/fetch-instagram-feed.mjs
 *
 * @see https://developers.facebook.com/docs/instagram-api/reference/ig-user/media
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "src", "lib", "data", "instagramFeed.json");

const TOKEN = process.env.IG_ACCESS_TOKEN;
const USER_ID = process.env.IG_USER_ID;
const API_VER = "v21.0";

if (!TOKEN || !USER_ID) {
  console.error(
    "Missing IG_ACCESS_TOKEN or IG_USER_ID. Set both and run again."
  );
  process.exit(1);
}

const fields = [
  "id",
  "caption",
  "media_type",
  "media_url",
  "thumbnail_url",
  "permalink",
  "timestamp",
  "children{media_url,media_type,thumbnail_url}",
].join(",");

function pickImageUrl(item) {
  if (item.media_type === "VIDEO") {
    return item.thumbnail_url || item.media_url || "";
  }
  if (item.media_type === "CAROUSEL_ALBUM" && item.children?.data?.length) {
    const first = item.children.data[0];
    return first.media_url || first.thumbnail_url || "";
  }
  return item.media_url || item.thumbnail_url || "";
}

async function main() {
  const profileUrl = `https://graph.facebook.com/${API_VER}/${USER_ID}?fields=username&access_token=${encodeURIComponent(TOKEN)}`;
  const profileRes = await fetch(profileUrl);
  const profileJson = await profileRes.json();
  if (!profileRes.ok) {
    console.error("Profile error:", profileJson);
    process.exit(1);
  }
  const username = profileJson.username ?? null;

  const mediaUrl = `https://graph.facebook.com/${API_VER}/${USER_ID}/media?fields=${encodeURIComponent(fields)}&limit=30&access_token=${encodeURIComponent(TOKEN)}`;
  const mediaRes = await fetch(mediaUrl);
  const mediaJson = await mediaRes.json();
  if (!mediaRes.ok) {
    console.error("Media error:", mediaJson);
    process.exit(1);
  }

  const items = mediaJson.data ?? [];
  const posts = items
    .map((item) => {
      const imageUrl = pickImageUrl(item);
      if (!imageUrl) return null;
      return {
        id: String(item.id),
        caption: item.caption ?? null,
        imageUrl,
        permalink: item.permalink,
        timestamp: item.timestamp ?? null,
      };
    })
    .filter(Boolean);

  const payload = {
    fetchedAt: new Date().toISOString(),
    username,
    posts,
  };

  writeFileSync(OUT, JSON.stringify(payload, null, 2), "utf8");
  console.log(`Wrote ${posts.length} posts to src/lib/data/instagramFeed.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
