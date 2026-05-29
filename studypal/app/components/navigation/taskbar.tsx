"use client";

import { verifySession, logOut } from "@/app/api/auth/route";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"

export default function TaskBar(){

    const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        (async () => { 
            const session = await verifySession();
            if (session){
                setIsLoggedIn(true);
            }
        })();
    },[]);

    async function handleLogOut(){
        const logOutAttempt = await logOut();

        if (logOutAttempt){
            router.push("/");
        }
        else{
            alert("Error al cerrar sesion");
        }
    }

    return (
        <div className="bg-red-600 p-3 h-[13vh] flex items-center gap-3 sticky top-0">
            <img  className="w-15 rounded-xl" src="/StudyPal Logo.png" alt="StudyPal"/>
            <div className="w-0.5 bg-white h-full" />
            <h1 className="text-[2rem]">StudyPal</h1>
            <div className="flex-1"/>
            {
                isLoggedIn ? ( <h1 className="pr-4 font-bold underline cursor-pointer" onClick={handleLogOut}>Logout</h1>) : null
            }
        </div>
    )
}