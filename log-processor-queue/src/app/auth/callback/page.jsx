"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../../lib/supabase";
export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session fetch error:", error);
        return;
      }

      console.log("User session:", data);
      router.push("/dashboard"); // Redirect user after login
    };

    handleAuthCallback();
  }, [router]);

  return <h1>Authenticating...</h1>;
}
