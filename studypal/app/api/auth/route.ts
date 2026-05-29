"use server";

import { supabase } from "@/app/lib/supabase";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

// Funcion para el login a la aplicacion.
export async function login(user: string, password: string){

    const cookieStore = await cookies()

    const {data, error} = await supabase
        .from("users")
        .select("id, pwd_hash")
        .eq("username", user);
    
    if (data != null){

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
            reason: "Incorrect password"
        }

    }

    return {
        status: "Failed",
        reason: "User not found"
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
        status: "Failed"
    }

}

// Funcion para cerrar sesion.
export async function logOut(){

    const cookieStore = await cookies();

    cookieStore.delete("token");

    if (cookieStore.get("token")){
        return true;
    }

    return false;

}

// Funcion para verificar si la sesion sigue activa.
export async function verifySession(){

    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (token){
        return true;
    }

    return false

}