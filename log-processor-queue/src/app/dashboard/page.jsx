"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../lib/supabase";
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login"); // 🔥 Redirect to login if not authenticated
      else setUser(data.user);
    });
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
        <>
          <p>Welcome, {user.email}</p>
          <input type="file" onChange={(e) => handleUpload(e)}/>
          <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
