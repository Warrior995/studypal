"use client";

import { register, verifySession } from "@/app/api/auth/authFunctions";
import { Eye, EyeOff } from "lucide-react"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    (async () => { 
      const session = await verifySession();
      if (session){
        router.push("/topics");
      }
    })();
  },[])

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState("");

  async function handleRegister(e : React.SubmitEvent<HTMLFormElement>){
    e.preventDefault();

    if (user == ""){
        setRegisterError("Username cannot be empty");
        return;
    }

    if (password == ""){
        setRegisterError("Password cannot be empty");
        return;
    }

    if (confirmPassword == ""){
        setRegisterError("Please confirm your password");
        return;
    }

    if (password !== confirmPassword){
      setRegisterError("Passwords do not match");
      return;
    }

    setRegisterError("");
    const response = await register(user, password);

    if (response.status === "Success"){
      router.push("/topics");
    } else {
      setRegisterError(response.reason ? response.reason : "Failed to register user, try again later");
    }
  }

  return (
    <div>
      <div className="flex justify-center items-center h-[87vh] w-screen bg-white">
        <div className="flex flex-col justify-center items-center gap-6 text-black bg-gray-200 rounded-xl p-5 border">
            <h1 className="text-2xl font-bold"> Register</h1>

            {/* Register Form */}
            <form className="flex flex-col gap-5" onSubmit={handleRegister}>
                <input className="w-53 border pl-2 pr-2 rounded bg-white" placeholder = "Username" value={user} onChange={(e) => setUser(e.target.value)}></input>

                {/* Password Input with see toggle */}
                <div className= "flex gap-3">
                <input className="w-45 border pl-2 pr-2 rounded bg-white" type={`${seePassword ? "text" : "password"}`} placeholder = "Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                {
                    seePassword ? (
                    <Eye className="w-5 h-5" onClick={() => setSeePassword(false)}/>
                    ) : (
                    <EyeOff className="w-5 h-5" onClick={() => setSeePassword(true)}/>
                    )
                }
                </div>

                {/* Confirm Password Input with see toggle */}
                <div className= "flex gap-3">
                <input className="w-45 border pl-2 pr-2 rounded bg-white" type={`${seeConfirmPassword ? "text" : "password"}`} placeholder = "Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></input>
                {
                    seeConfirmPassword ? (
                    <Eye className="w-5 h-5" onClick={() => setSeeConfirmPassword(false)}/>
                    ) : (
                    <EyeOff className="w-5 h-5" onClick={() => setSeeConfirmPassword(true)}/>
                    )
                }
                </div>

                {/* Register Button and Error Message */}
                <div className="flex flex-col gap-[0.3rem]">
                    {/* Register Button */}
                    <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">Register</button>

                    {/* Register Error Message */}  
                    <div className="flex justify-center">
                        <p className="text-red-500 text-[0.8rem]">{registerError}</p>
                    </div>
                </div>
            </form>
        </div>
      </div>
    </div>
  );  
}
