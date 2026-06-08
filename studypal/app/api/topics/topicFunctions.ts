"use server";

import { supabase } from "@/app/lib/supabase";
import { verifySession } from "@/app/api/auth/authFunctions";
import { Topic } from "@/app/lib/types/topicTypes";

export async function getTopics(){
    const session = await verifySession();
    if (!session){
        return {
            status: "Failed",
            reason: "Unauthorized"
        }
    }

    const {data, error} = await supabase
        .from("topic")
        .select("*")
        .eq("user_id", session.id);

    if (error){
        return {
            status: "Failed",
            reason: "Failed to fetch topics, try again later"
        }
    }
    return {
        status: "Success",
        data: data as Topic[]
    }
}

export async function createTopic(title: string, description: string){
    const session = await verifySession();
    if (!session){
        return {
            status: "Failed",
            reason: "Unauthorized"
        }
    }

    const {data, error} = await supabase
        .from("topic")
        .insert({
            title,
            description,
            user_id: session.id
        })
        .select("*")
        .single();

    if (error){
        return {
            status: "Failed",
            reason: "Failed to create topic, try again later"
        }
    }

    return {
        status: "Success",
        data: data as Topic
    }
}