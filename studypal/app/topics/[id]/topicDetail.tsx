"use client"

import { createCard, getCardsByTopic } from "@/app/api/cards/cardFunctions";
import { getTopicById } from "@/app/api/topics/topicFunctions";
import type { Card } from "@/app/lib/types/cardTypes";
import type { Topic } from "@/app/lib/types/topicTypes";
import { useState, useEffect } from "react";
import NewCardModal from "@/app/components/cards/newCard";
import { verifySession } from "@/app/api/auth/authFunctions";
import { useRouter } from "next/navigation";

export default function TopicDetail({ id }: { id: number }) {

    const [cards, setCards] = useState<Card[]>([]);
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [topicInfo, setTopicInfo] = useState<Topic | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        (async () => {
            const session = await verifySession();
            if (!session){
                router.push("/login");
            }
        })();
    },[])

    useEffect(() => {
        setLoading(true);
        (async () => {
            const getTopic = await getTopicById(id);
            if (getTopic.status === "Success"){
                const topicData = getTopic.data as Topic;
                setTopicInfo(topicData);
            }

            const getCards = await getCardsByTopic(id);
            if (getCards.status === "Success"){
                const cardsData = getCards.data as Card[];
                setCards(cardsData);
                setLoading(false);
            }
            else{
                setMessage("Failed to fetch cards.");
                setLoading(false);
            }
        })();
    },[id]);

    if (topicInfo === null && !loading){
        return (
            <div className="flex flex-col bg-white min-h-screen gap-5 p-5">
                <h1 className="text-[3rem] font-bold text-black pl-15">Topic Not Found</h1>
            </div>
        )
    }


    return (
        <div className= "flex flex-col bg-white min-h-screen gap-5 p-5">
            <div className="flex items-center gap-5">
                <h1 className="text-[3rem] font-bold text-black pl-15">{topicInfo?.title}</h1>
                <div className="flex-1"/>
                <button className="bg-gray-600 text-white px-4 py-2 rounded-lg mr-6 cursor-pointer" onClick={() => router.push(`/topics/${id}/studyMode`)}> Lets study</button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-6 cursor-pointer" onClick={() => setModalOpen(true)}> + Create Card</button>
            </div>
            {(loading) ? (
                <div>
                    <h1>Loading Topic.....</h1>
                </div>
            ) : (   
                <div>
                    <table className="w-full border border-black border-collapse">
                        <thead>
                            <tr>
                                <th className="border border-black px-4 py-2 text-left text-2xl font-bold text-black">Card ID</th>
                                <th className="border border-black px-4 py-2 text-left text-2xl font-bold text-black">Question</th>
                                <th className="border border-black px-4 py-2 text-left text-2xl font-bold text-black">Answer</th>
                            </tr>
                        </thead>
                            {cards.length === 0 ? (
                                <tbody>
                                    <tr className="border border-black px-4 py-2 text-left text-l text-black">
                                        <td colSpan={3}>
                                            <div className="flex flex-col items-center">
                                                <h1 className= "pl-4 text-lg">
                                                    No cards available for this topic.
                                                </h1>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            ) : (
                                <tbody>
                                    {cards.map((card) => (
                                        <tr key={card.id} className="border border-black px-4 py-2 text-left text-2xl font-bold text-black">
                                            <td className="border border-black px-4 py-2 text-left text-xl text-black font-normal">{card.id}</td>
                                            <td className="border border-black px-4 py-2 text-left text-xl text-black font-normal">{card.question}</td>
                                            <td className="border border-black px-4 py-2 text-left text-xl text-black font-normal">{card.answer}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            )}
                    </table>
                </div>
            )
            }
            <NewCardModal modalOpen={modalOpen} setModalOpen={setModalOpen} topicId={id} cards={cards} setCards={setCards}/>
        </div>
    )
}