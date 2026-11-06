"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/database.types";

export function useProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const supabase = createClient();
        // getSession은 로컬 세션을 먼저 읽어 헤더를 빨리 결정할 수 있음
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const authUser = session?.user ?? null;

        if (!authUser) {
          if (!cancelled) {
            setUser(null);
            setProfile(null);
          }
          return;
        }

        if (!cancelled) {
          setUser(authUser);
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .maybeSingle();

        if (error) {
          console.error("useProfile:", error.message);
        }

        if (!cancelled) {
          setProfile((data as Profile | null) ?? null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading };
}
