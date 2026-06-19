"use server";

import { supabase } from "@/app/lib/supabase";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import type { Session } from "@/app/lib/types/authTypes";

// Funcion para el login a la aplicacion.
export async function login(user: string, password: string){

    const cookieStore = await cookies()

    const {data, error} = await supabase
        .from("users")
        .select("id, pwd_hash")
        .eq("username", user);
    
    if (data != null){

        if (data.length === 0){
            return {
                status: "Failed",
                reason: "Invalid username or password"
            }
        }

        const loginSuccess = await bcrypt.compare(password, data[0].pwd_hash ? data[0].pwd_hash : "");

        if (loginSuccess){

            const token = jwt.sign(
                {
                    userid: data[0].id,
                    username: user,
                },
                process.env.JWT_SECRET!,
                {
                    expiresIn: "7d",
                }
            );

            cookieStore.set("token", token,{
                httpOnly: true,
                secure: true,
                sameSite: "lax",
                path: "/"
            });

            return {
                status: "Success"
            }
        }

        return {
            status: "Failed",
            reason: "Invalid username or password"
        }

    }

    return {
        status: "Failed",
        reason: "Error while trying to login, try again later"
    }

}

// Funciona para el registro a la aplicacion.
export async function register(user: string, password: string){

    const cookieStore = await cookies();

    const hash = await bcrypt.hash(password, 10);

    const {data, error} = await supabase
        .from("users")
        .insert({
            username: user,
            pwd_hash: hash
        })
        .select()

    if (data != null){

        const token = jwt.sign({
            userid: data[0].id,
            username: data[0].username,
        },
        process.env.JWT_SECRET!,{
            expiresIn: "7d",
        });

        cookieStore.set("token", token,{
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/"
        });

        return {
            status: "Success"
        }

    }

    return {
        status: "Failed",
        reason: "Failed to register user, try again later"
    }

}

// Funcion para cerrar sesion.
export async function logOut(){

    const cookieStore = await cookies();

    cookieStore.delete("token");

    return true;

}

// Funcion para verificar si la sesion sigue activa.
export async function verifySession(){

    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (token){

        const payload = jwt.verify(token, process.env.JWT_SECRET!);

        const session = payload as Session;

        return {
            id: session.userid,
            username: session.username
        };
    }

    return false

}