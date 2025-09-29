// context/AuthProvider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { fetchCurrentProfile } from "@/lib/services/profile";
import { Profile } from "@/lib/types";

type AuthContextValue = {
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // fetch profile for current session
  async function refreshProfile() {
    setLoading(true);
    try {
      // first check if a session exists — avoid making profile calls when there's no session
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error checking session", sessionError);
      }

      // if there's no session
      if (!sessionData?.session) {
        setProfile(null);
        return;
      }
      const p = await fetchCurrentProfile();
      setProfile(p ?? null);
    } catch (err) {
      setProfile(null);
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // initial load: check session and fetch profile if exists
    (async () => {
      await refreshProfile();
    })();

    // subscribe to auth changes (login/logout)
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      // When auth changes, refresh profile (session may be null on sign-out)
      refreshProfile();
    });

    // cleanup subscription on unmount
    return () => {
      data.subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
