import { useEffect, useState } from "react";
import type { Card } from "@/app/lib/types/cardTypes";
import { createCard } from "@/app/api/cards/cardFunctions";


export default function NewCardModal({modalOpen, setModalOpen, topicId, cards, setCards}: {modalOpen: boolean, setModalOpen: (open: boolean) => void, topicId: number, cards: Card[], setCards: (cards: Card[]) => void}){

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    

    async function handleCreateCard(){
        if (question === "" || answer === "" || message){
            if (question === ""){
                setMessage("Question cannot be empty");
            }
            else if (answer === ""){
                setMessage("Answer cannot be empty");
            }
            return;
        }

        setLoading(true);
        const response = await createCard(topicId, question, answer);
        setLoading(false);
        if (response.status === "Success"){
            setMessage("");
            setQuestion("");
            setAnswer("");
            if (response.data){
                const newCard = (response.data as Card);
                setCards([...cards, newCard]);
            }
            setModalOpen(false);
        }
        else {
            setMessage(response.reason ? response.reason : "Failed to create card, try again later");
        }

    }
    
    return (
        <div className={`${modalOpen ? "fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center" : "hidden"}`}>
            <div className={`${modalOpen ? "block" : "hidden"} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg z-50 max-h[80vh] overflow-y-auto`}>
                <div className="pl-4 pr-4 m-4 flex flex-col gap-4 relative w-[80vh]">
                    <button className="absolute top-2 right-3 text-gray-500 hover:text-gray-700" onClick={() => setModalOpen(false)}>✕</button>
                    <h2 className="text-2xl font-bold mb-4 text-black">Create New Card</h2>
                    <div className="flex flex-col gap-2 w-full">
                        <h2 className="pl-[0.5] text-black text-[1.3rem]">Question</h2>
                        <input value={question} onChange={(e) => setQuestion(e.target.value)} type="text" placeholder="Write a question for your card" className="border border-black text-black p-1.5 pl-4 rounded-xl border-[0.05rem]"></input>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <h2 className="pl-[0.5] text-black text-[1.3rem]">Answer</h2>
                        <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Write an answer for your card" className="border border-black text-black p-1.5 pl-4 rounded-xl border-[0.05rem] h-[5rem]"></textarea>
                    </div>
                    <h1 className="text-red-500">{message}</h1>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-2 self-end" onClick={handleCreateCard} disabled={loading}>
                        {loading ? "Creating..." : "Create Card"}
                    </button>
                </div>
            </div>
        </div>
    )
}