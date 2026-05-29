"use client";

import { login, verifySession } from "@/app/api/auth/route";
import { Eye, EyeOff } from "lucide-react"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    (async () => { 
      const session = await verifySession();
      if (session){
        router.push("/dashboard");
      }
    })();
  },[])

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [seePassword, setSeePassword] = useState(false);

  async function handleLogin(){
    const response = await login(user, password);

    if (response.status === "Success"){
      router.push("/dashboard");
    } else {
      alert(response.reason);
    }
  }

  return (
    <div>
      <div className="flex justify-center items-center h-[87vh] w-screen bg-white">
        <div className="flex flex-col justify-center items-center gap-10 text-black bg-gray-200 rounded-xl p-5 border">
          <h1> Login</h1>
          <input className="w-53 border pl-2 pr-2 rounded bg-white" placeholder = "Username" value={user} onChange={(e) => setUser(e.target.value)}></input>
          <div className= "flex gap-3">
            <input className="w-45 border pl-2 pr-2 rounded bg-white" type={`${seePassword ? "text" : "password"}`} placeholder = "Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
            {
              seePassword ? (
                <EyeOff className="w-5 h-5" onClick={() => setSeePassword(false)}/>
              ) : (
                <Eye className="w-5 h-5" onClick={() => setSeePassword(true)}/>
              )
            }
          </div>
          <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={handleLogin }>Login</button>
        </div>
      </div>
    </div>
  );  
}
