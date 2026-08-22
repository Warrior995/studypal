"use client"

import { getCardsByUnit } from "@/app/api/cards/cardFunctions";
import { getUnitById } from "@/app/api/units/unitFunctions";
import type { Card } from "@/app/lib/types/cardTypes";
import type { Unit } from "@/app/lib/types/unitTypes";
import { useState, useEffect } from "react";
import { verifySession } from "@/app/api/auth/authFunctions";
import { useRouter } from "next/navigation";
import { shuffle } from "@/app/lib/functions/generalFunctions";

export default function StudyDetail({ id }: { id: number }) {

    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [unitInfo, setUnitInfo] = useState<Unit | null>(null);
    const [flipCard, setFlipCard] = useState<boolean>(false);
    const [cardIndex, setCardIndex] = useState<number>(0);

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
            const getUnit = await getUnitById(id);
            if (getUnit.status === "Success"){
                const topicData = getUnit.data as Unit;
                setUnitInfo(topicData);
            }

            const getCards = await getCardsByUnit(id);
            if (getCards.status === "Success"){
                const cardsData = getCards.data as Card[];
                setCards(shuffle(cardsData));
                setLoading(false);
                if (cardsData.length === 0){
                    setLoading(false);
                    router.push(`/units/${id}`);
                }
            }
            else{
                setLoading(false);
                router.push(`/units/${id}`);
            }
        })();
    },[id]);


    return (
        <div className= "flex flex-col bg-white min-h-screen gap-5 p-5">
            <div className="flex items-center gap-5">
                <h1 className="text-[3rem] font-bold text-black pl-15">{unitInfo?.name}</h1>
                <div className="flex-1"/>
                <button className="bg-gray-600 text-white px-4 py-2 rounded-lg mr-6 cursor-pointer" onClick={() => router.push(`/units/${id}`)}> Back to Unit</button>
            </div>
            {(loading) ? (
                <div>
                    <h1>Loading Topic.....</h1>
                </div>
            ) : (   
                <div>

                    {
                    cards[cardIndex] ? (
                        cards[cardIndex].question && cards[cardIndex].answer ? (
                            <div onClick={() => setFlipCard(prev =>!prev)} className="flex flex-col items-center justify-center h-full">
                                <div className="bg-gray-100 p-10 rounded-lg shadow-md w-[50%]">
                                    <h2 className="text-2xl font-bold mb-4 color-black text-black">{flipCard ? "Answer:" : "Question:"}</h2>
                                    <h2 className="text-2xl font-bold mb-4 color-black text-black">{flipCard ? cards[cardIndex].answer : cards[cardIndex].question}</h2>
                                </div>
                            </div>
                        ) : null
                    ) : null
                    }
                    <div className="flex justify-between mt-5">
                        <span/>
                        <button onClick={() => {setCardIndex(prev => Math.max(prev - 1, 0)); setFlipCard(false)}} className="bg-blue-500 text-white px-9 py-4 rounded disabled:bg-gray-400 text-[1.4rem]" disabled={cardIndex === 0}>Previous</button>
                        <span className="text-black">{cardIndex + 1} / {cards.length}</span>
                        <button onClick={() => {setCardIndex(prev => Math.min(prev + 1, cards.length - 1)); setFlipCard(false)}} className="bg-blue-500 text-white px-9 py-4 rounded disabled:bg-gray-400 text-[1.4rem]" disabled={cardIndex === cards.length - 1}>Next</button>
                        <span/>
                    </div>

                </div>
            )
            }
        </div>
    )
}