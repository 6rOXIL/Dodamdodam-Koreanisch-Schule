#!/usr/bin/env node
/**
 * 코리안넷 공지 게시판(최근 10건)을 스크래핑해 Supabase public_notices에 저장합니다.
 *
 * 환경 변수:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * 실행: npm run sync:notices
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function loadEnvFile(filename) {
  const path = join(ROOT, filename);
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator <= 0) continue;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

const SITE_ORIGIN = "http://homepy.korean.net";
const LIST_URL = `${SITE_ORIGIN}/~dodamdodam/www/curriculum/Notice/list.htm?bn=notice&categoryValue=0`;
const NOTICE_LIMIT = 10;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
  "Accept-Language": "ko-KR,ko;q=0.9",
};

function decodeHtml(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(html) {
  return decodeHtml(html.replace(/<[^>]+>/g, " "));
}

function resolveUrl(href) {
  if (!href) return "";
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href.startsWith("/")) return `${SITE_ORIGIN}${href}`;
  return `${SITE_ORIGIN}/${href}`;
}

function toIsoDate(raw) {
  const match = raw.match(/^(\d{4})\.(\d{1,2})\.(\d{1,2})$/);
  if (!match) return raw;
  const [, y, m, d] = match;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function extractBoardNo(url) {
  const match = url.match(/board_no=(\d+)/);
  return match?.[1] ?? null;
}

function parseListPage(html) {
  const rows = [
    ...html.matchAll(/<tr\s+class=['"]print_list['"][^>]*>([\s\S]*?)<\/tr>/gi),
  ];

  return rows
    .map((match) => {
      const rowHtml = match[1];
      const cells = [...rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(
        (cell) => cell[1]
      );
      if (cells.length < 5) return null;

      const linkMatch = cells[2].match(/href=['"]([^'"]+)['"]/i);
      if (!linkMatch) return null;

      const url = resolveUrl(linkMatch[1]);
      const boardNo = extractBoardNo(url);
      if (!boardNo) return null;

      return {
        boardNo,
        listTitle: stripTags(cells[2]),
        date: toIsoDate(stripTags(cells[4])),
        legacyUrl: url,
      };
    })
    .filter(Boolean)
    .slice(0, NOTICE_LIMIT);
}

function absolutizeHtmlUrls(html) {
  return html
    .replace(/src=(['"])\/(?!\/)/g, `src=$1${SITE_ORIGIN}/`)
    .replace(/href=(['"])\/(?!\/)/g, `href=$1${SITE_ORIGIN}/`)
    .replace(/src=(['"])http:\/\//g, "src=$1https://")
    .replace(/href=(['"])http:\/\//g, "href=$1https://");
}

/** 코리안넷 에디터 HTML: width:0 caption 등이 세로 글자 깨짐을 유발 */
function sanitizeNoticeBodyHtml(html) {
  return html.replace(/<caption[^>]*>[\s\S]*?<\/caption>/gi, "");
}

function parseDetailPage(html, fallback) {
  const titleMatch = html.match(
    /class=['"]board_contents['"][\s\S]*?<th[^>]*>([\s\S]*?)<\/th>/i
  );
  const authorMatch = html.match(/작성자<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
  const dateMatch = html.match(/작성일<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
  const bodyMatch = html.match(
    /<div class=['"]fr-view['"]>([\s\S]*?)<\/div>/i
  );

  const attachments = [];
  const fileBlockMatch = html.match(/<div class=['"]file['"]>([\s\S]*?)<\/div>/i);
  if (fileBlockMatch) {
    const rows = [
      ...fileBlockMatch[1].matchAll(
        /<tr>[\s\S]*?<td align="left"[^>]*>\s*([\s\S]*?)\s*<\/td>[\s\S]*?attachDownload\.jsp\?attachNo=(\d+)/gi
      ),
    ];
    for (const row of rows) {
      attachments.push({
        name: stripTags(row[1]),
        attachNo: row[2],
        url: `https://www.korean.net/board/attachDownload.jsp?attachNo=${row[2]}`,
      });
    }
  }

  const title = stripTags(titleMatch?.[1] ?? "") || fallback.listTitle;
  const author = stripTags(authorMatch?.[1] ?? "") || null;
  const publishedAt =
    toIsoDate(stripTags(dateMatch?.[1] ?? "")) || fallback.date;
  const bodyHtml = sanitizeNoticeBodyHtml(absolutizeHtmlUrls(bodyMatch?.[1]?.trim() ?? ""));

  return {
    boardNo: fallback.boardNo,
    legacyUrl: fallback.legacyUrl,
    title,
    author,
    publishedAt,
    bodyHtml,
    attachments,
  };
}

async function fetchHtml(url) {
  const response = await fetch(url, { headers: FETCH_HEADERS });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.text();
}

async function main() {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY."
    );
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const listHtml = await fetchHtml(LIST_URL);
  const listItems = parseListPage(listHtml);

  if (listItems.length === 0) {
    console.error("No notices found on list page.");
    process.exit(1);
  }

  const syncedAt = new Date().toISOString();
  const records = [];

  for (const item of listItems) {
    const detailHtml = await fetchHtml(item.legacyUrl);
    const detail = parseDetailPage(detailHtml, item);
    records.push({
      board_no: detail.boardNo,
      legacy_url: detail.legacyUrl,
      title: detail.title,
      body_html: detail.bodyHtml,
      author: detail.author,
      published_at: detail.publishedAt,
      attachments: detail.attachments,
      synced_at: syncedAt,
    });
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  const boardNos = records.map((record) => record.board_no);

  const { error: upsertError } = await supabase
    .from("public_notices")
    .upsert(records, { onConflict: "board_no" });

  if (upsertError) {
    throw new Error(`Supabase upsert failed: ${upsertError.message}`);
  }

  const { error: deleteError } = await supabase
    .from("public_notices")
    .delete()
    .not("board_no", "in", `(${boardNos.map((no) => `"${no}"`).join(",")})`);

  if (deleteError) {
    throw new Error(`Supabase cleanup failed: ${deleteError.message}`);
  }

  console.log(`Synced ${records.length} notices to Supabase`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
