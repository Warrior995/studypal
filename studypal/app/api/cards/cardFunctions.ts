import { supabase } from "@/app/lib/supabase";
import { verifySession } from "../auth/authFunctions";

export async function createCard(topicId: number, question: string, answer: string){
    const session = await verifySession();
    if (!session) {
        return {
            status: "Failed",
            reason: "Unauthorized",
            data: null
        };
    }

    const { data, error } = await supabase
        .from("cards")
        .insert([
            {
                topic_id: topicId,
                question: question,
                answer: answer
            }
        ])
        .select("*")
        .single();

    if (error) {
        return {
            status: "Failed",
            reason: error.message,
            data: null
        };
    }

    return {
        status: "Success",
        data: data
    };
}

export async function createCardsMassive(topicId: number, document: string){
    const session = await verifySession();
    if (!session) {
        return {
            status: "Failed",
            reason: "Unauthorized",
            data: null
        };
    }

    const lines = document.split("\n");
    const cardsToInsert = lines.map(line => {
        const [question, answer] = line.split("-");
        return {
            topic_id: topicId,
            question: question.trim(),
            answer: answer.trim()
        };
    });

    const { data, error } = await supabase
        .from("cards")
        .insert(cardsToInsert)
        .select("*");

    if (error) {
        return {
            status: "Failed",
            reason: error.message,
            data: null
        };
    }

    return {
        status: "Success",
        data: data
    };
}

export async function getCardsByTopic(topicId: number){
    const session = await verifySession();
    if (!session) {
        return {
            status: "Failed",
            reason: "Unauthorized"
        };
    }

    const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("topic_id", topicId);

    if (error) {
        return {
            status: "Failed",
            reason: "Error fetching cards: " + error.message
        };
    }

    return {
        status: "Success",
        data: data
    };
}

export async function getCardsByUnit(unitId: number){
    const session = await verifySession();
    if (!session) {
        return {
            status: "Failed",
            reason: "Unauthorized"
        };
    }

    const { data, error } = await supabase
        .from("cards")
        .select(`
            *,
            topic!inner (
                unit_id
            )
        `)
        .eq("topic.unit_id", unitId);

    console.log(data)

    if (error) {
        return {
            status: "Failed",
            reason: "Error fetching cards: " + error.message
        };
    }

    return {
        status: "Success",
        data: data
    };
}