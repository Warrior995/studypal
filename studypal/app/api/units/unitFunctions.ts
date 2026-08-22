"use server";

import { supabase } from "@/app/lib/supabase";
import { verifySession } from "@/app/api/auth/authFunctions";
import { Unit } from "@/app/lib/types/unitTypes";

export async function getUnits(){
    const session = await verifySession();

    if (!session){
        return {
            status: "Failed",
            reason: "Unauthorized"
        }
    }

    const { data, error } = await supabase
        .from("unit")
        .select("*")
        .eq("user_id", session.id)
        .order("id", {ascending: true})

    console.log(error)

    if (error){
        return {
            status: "Failed",
            reason: "Error fetching units, try again later"
        }
    }

    return{
        status: "Success",
        data: data as Unit[]
    }
}

export async function getUnitById(unitId: number){
    const session = await verifySession();

    if (!session){
        return {
            status: "Failed",
            reason: "Unauthorized"
        }
    }

    const { data, error } = await supabase
        .from("unit")
        .select("*")
        .eq("user_id", session.id)
        .eq("id", unitId)
        .single()

    console.log(error)

    if (error){
        return {
            status: "Failed",
            reason: "Error fetching units, try again later"
        }
    }

    return{
        status: "Success",
        data: data as Unit
    }
}

export async function createUnit(name :string, description: string){
    const session = await verifySession();

    if (!session){
        return {
            status: "Failed",
            reason: "Unauthorized"
        }
    }

    const { data, error} = await supabase
        .from("unit")
        .insert({
            name: name,
            description: description,
            user_id: session.id
        })
        .select("*")
        .single();

    if ( error ){
        return {
            status : "Failed",
            reason : "Failed to create unit, try again later"
        }
    }

    return {
        status : "Success",
        data: data as Unit
    };
    
}