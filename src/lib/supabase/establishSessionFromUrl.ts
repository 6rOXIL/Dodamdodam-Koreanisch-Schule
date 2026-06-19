import type { SupabaseClient } from "@supabase/supabase-js";

export type EstablishSessionResult = { ok: true } | { ok: false };

/** 이메일 링크·OAuth 콜백 URL의 code / token_hash / hash 토큰으로 세션을 만든다. */
export async function establishSessionFromUrl(
  supabase: SupabaseClient,
  url: URL = new URL(window.location.href)
): Promise<EstablishSessionResult> {
  const code = url.searchParams.get("code");
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return { ok: true };
  }

  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  if (tokenHash && type === "recovery") {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "recovery",
    });
    if (!error) return { ok: true };
  }

  const hash = url.hash.startsWith("#") ? url.hash.slice(1) : url.hash;
  if (hash) {
    const hashParams = new URLSearchParams(hash);
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    if (accessToken && refreshToken) {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (!error) return { ok: true };
    }
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session ? { ok: true } : { ok: false };
}

/** 주소창에서 인증 토큰 쿼리·해시를 제거한다. */
export function stripAuthParamsFromUrl(): void {
  const url = new URL(window.location.href);
  const hadQuery =
    url.searchParams.has("code") ||
    url.searchParams.has("token_hash") ||
    url.searchParams.has("type");
  const hadHash = url.hash.includes("access_token") || url.hash.includes("refresh_token");

  if (!hadQuery && !hadHash) return;

  url.searchParams.delete("code");
  url.searchParams.delete("token_hash");
  url.searchParams.delete("type");
  url.hash = "";
  window.history.replaceState({}, "", `${url.pathname}${url.search}`);
}

/** onAuthStateChange 또는 getSession으로 세션 확립을 기다린다. */
export function waitForAuthSession(
  supabase: SupabaseClient,
  timeoutMs = 3000
): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false;

    const finish = (hasSession: boolean) => {
      if (settled) return;
      settled = true;
      subscription.unsubscribe();
      clearTimeout(timer);
      resolve(hasSession);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "SIGNED_IN" || event === "PASSWORD_RECOVERY")) {
        finish(true);
      }
    });

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) finish(true);
    });

    const timer = setTimeout(() => {
      void supabase.auth.getSession().then(({ data: { session } }) => {
        finish(!!session);
      });
    }, timeoutMs);
  });
}
