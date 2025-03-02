"use client";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/router";
import { redirect } from "next/dist/server/api-utils";

export default function Auth() {
  const [user, setUser] = useState(null);
    // const router = useRouter();  


  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user]);


  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  const signInWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`, // 👈 Important for handling OAuth callback
      },
    });
  
    if (error) console.error("GitHub login error:", error);
  };
  

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {user ? (
        <div>
          <h2>Welcome, {user.email}!</h2>
          <button onClick={signOut} className="mt-4 p-2 bg-red-500 text-white">
            Sign Out
          </button>
        </div>
      ) : (
        <button onClick={signInWithGitHub} className="p-3 bg-blue-600 text-white">
          Sign in with GitHub
        </button>
      )}
    </div>
  );
}
