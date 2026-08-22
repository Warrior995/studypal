"use client";

import { verifySession, logOut } from "@/app/api/auth/authFunctions";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation";

export default function TaskBar(){

    const router = useRouter();

    const pathname = usePathname();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        (async () => { 
            const session = await verifySession();
            if (session){
                setIsLoggedIn(true);
            }
        })();
    },[pathname]);
    

    async function handleLogOut(){
        const logOutAttempt = await logOut();

        if (logOutAttempt){
            router.push("/");
            setIsLoggedIn(false);
        }
        else{
            alert("Error al cerrar sesion");
        }
    }

    return (
       <div className="bg-red-600 p-3 h-[13vh] flex items-center gap-3 sticky top-0">
            <div className="flex gap-3 items-center h-full hover:cursor-pointer" onClick={() => router.push("/")}>
                <img className="w-15 rounded-xl" src="/StudyPal Logo.png" alt="StudyPal" />
                <div className="w-0.5 bg-white h-full" />
                <h1 className="text-[2rem] text-white">StudyPal</h1>
            </div>

            {isLoggedIn ? (
                <>
                    <div className="flex-1 flex justify-center">
                        <span className="mx-auto"/>
                        <h1
                            className="font-bold underline cursor-pointer text-white"
                            onClick={() => router.push("/units")}
                        >
                            Units
                        </h1>
                        <span className="mx-auto"/>
                        <h1
                            className="font-bold underline cursor-pointer text-white"
                            onClick={() => router.push("/topics")}
                        >
                            Topics
                        </h1>
                        <span className="mx-auto"/>
                    </div>
                    <span className="mx-auto"/>
                    <h1
                        className="font-bold underline cursor-pointer text-white mr-[2rem]"
                        onClick={handleLogOut}
                    >
                        Logout
                    </h1>
                </>
            ) : (
                <div className="ml-auto flex gap-5">
                    <h1
                        className="font-bold underline cursor-pointer"
                        onClick={() => router.push("/login")}
                    >
                        Login
                    </h1>

                    <h1
                        className="font-bold underline cursor-pointer"
                        onClick={() => router.push("/register")}
                    >
                        Register
                    </h1>
                </div>
            )}
        </div>
    )
}