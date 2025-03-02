"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../lib/supabase";
import Main from "@/components/Main"

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const inputRef = useRef();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login"); // 🔥 Redirect to login if not authenticated
      else setUser(data.user);
    });
    async function loadStats() {
      const res = await fetch("/api/stats"); // ✅ Fetch from API
      const data = await res.json();
      setStats(data);
    }
    
    loadStats();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login"); // 🔥 Redirect to login after logout
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
  
    // ✅ Get session & extract the token
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    console.log("token", token)
    if (!token) {
      console.error("User not authenticated");
      return;
    }
  
    const response = await fetch("/api/upload-logs", {
      method: "POST",
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`, 
      }
    });
  
    const data = await response.json();
    console.log("Upload response:", data);
  };
  

  return (
    <div className="p-4">
      {user ? (
        <div className="flex flex-col gap-y-4">
          <div className="flex justify-between ">
              <p>Welcome, {user.email}</p>
              <input ref={inputRef} type="file" onChange={(e) => handleUpload(e)} className="hidden"/>
              <div className="bg-gray-500 text-white p-2 rounded cursor-pointer" onClick={() => inputRef.current.click()}>Upload</div>
              <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded cursor-pointer">Logout</button>
          </div>
          <Main stats={stats}/>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
