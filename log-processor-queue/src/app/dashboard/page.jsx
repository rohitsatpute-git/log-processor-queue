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

  return (
    <div className="p-4">
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
