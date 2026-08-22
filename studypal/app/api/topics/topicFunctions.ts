"use server";

import { supabase } from "@/app/lib/supabase";
import { verifySession } from "@/app/api/auth/authFunctions";
import { Topic } from "@/app/lib/types/topicTypes";

export async function createTopic(title: string, description: string, unit_id?: number | null){
    console.log(unit_id);
    if (!unit_id){
        return {
            status: "Failed",
            reason: "Unauthorized"
        }
    }

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
            user_id: session.id,
            unit_id
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
        .eq("user_id", session.id)
        .order("id", { ascending: true });

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

export async function getTopicsByUnit(unitId: number){

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
        .eq("user_id", session.id)
        .eq("unit_id", unitId)
        .order("id", { ascending: true });

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

export async function getUnassignedTopics(){
    const session = await verifySession();
    if (!session){
        return {
            status: "Failed",
            reason: "Unauthorized"
        }
    }

    const { data, error} = await supabase
        .from("topic")
        .select("*")
        .eq("user_id", session.id)
        .is("unit_id", null)
        .order("id", { ascending: true})

    if (error){
        return {
            status: "Failed",
            reason: "Failed to fetch topic, try again later"
        }
    }

    return {
        status: "Success",
        data: data as Topic[]
    }
}

export async function getTopicById(id: number){
    const session = await verifySession();
    if (!session){
        return {
            status: "Failed",
            reason: "Unauthorized"
        }
    }

    const { data, error} = await supabase
        .from("topic")
        .select("*")
        .eq("id", id)
        .eq("user_id", session.id)
        .single();

    if (error){
        return {
            status: "Failed",
            reason: "Failed to fetch topic, try again later"
        }
    }

    return {
        status: "Success",
        data: data as Topic
    }
}

export async function editTopic(id: number, title: string, description: string, unit_id: number | null){
    const session = await verifySession();
    if (!session){
        return {
            status: "Failed",
            reason: "Unauthorized"
        }
    }

    
    const {data, error} = await supabase
        .from("topic")
        .update({
            title,
            description,
            unit_id
        })
        .eq("id", id)
        .eq("user_id", session.id)
        .select("*")
        .single();

    if (error){
        return {
            status: "Failed",
            reason: "Failed to edit topic, try again later"
        }
    }

    return {
        status: "Success",
        data: data as Topic
    }
}

export async function deleteTopic(id: number){
    const session = await verifySession();
    if (!session){
        return {
            status: "Failed",
            reason: "Unauthorized"
        }
    }

    const {error} = await supabase.rpc("delete_topic", {
        p_topic_id: id,
        p_user_id: session.id,
    });

    console.log("deleteTopic error:", error);

    if (error){
        return {
            status: "Failed",
            reason: "Failed to delete topic, try again later"
        }
    }
    return {
        status: "Success"
    }
}