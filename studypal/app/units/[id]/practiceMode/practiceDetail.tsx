"use client"

import { getCardsByUnit} from "@/app/api/cards/cardFunctions";
import { getUnitById } from "@/app/api/units/unitFunctions";
import type { Card } from "@/app/lib/types/cardTypes";
import type { Unit } from "@/app/lib/types/unitTypes";
import { useState, useEffect } from "react";
import { verifySession } from "@/app/api/auth/authFunctions";
import { useRouter } from "next/navigation";
import { shuffle } from "@/app/lib/functions/generalFunctions";

export default function PracticeDetailail({ id }: { id: number }) {

    const [cardPool, setCardPool] = useState<Card[]>([]);
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [unitInfo, setUnitInfo] = useState<Unit | null>(null);
    const [flipCard, setFlipCard] = useState<boolean>(false);
    const [cardIndex, setCardIndex] = useState<number>(0);
    const [failedCards, setFailedCards] = useState<Card[]>([]);

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
                const unitData = getUnit.data as Unit;
                setUnitInfo(unitData);
            }

            const getCards = await getCardsByUnit(id);

            if (getCards.status === "Success"){
                const cardsData = getCards.data as Card[];
                setCardPool(cardsData);
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

    function handleCardResult(isCorrect: boolean) {
        if (!isCorrect) {
            setFailedCards(prev => [...prev, cards[cardIndex]]);
        }
        
        setCardIndex(prev => Math.min(prev + 1, cards.length)); 
        setFlipCard(false);
    }

    function handleReset(){
        if (failedCards.length > 0){
            setCards(shuffle(failedCards));
            setCardIndex(0);
            setFailedCards([]);
            setFlipCard(false);
        }
        else {
            setCards(shuffle(cardPool));
            setCardIndex(0);
            setFailedCards([]);
            setFlipCard(false);
        }
    }


    return (
        <div className= "flex flex-col bg-white min-h-screen gap-5 p-5">
            <div className="flex items-center gap-5">
                <h1 className="text-[3rem] font-bold text-black pl-15">{unitInfo?.name}</h1>
                <div className="flex-1"/>
                <button className="bg-gray-600 text-white px-4 py-2 rounded-lg mr-6 cursor-pointer" onClick={() => router.push(`/units/${id}`)}> Back to Unit</button>
            </div>
            {(loading) ? (
                <div>
                    <h1>Loading Unit.....</h1>
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
                    {((cards.length === cardIndex)) ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <h2 className="text-2xl font-bold mb-4 color-black text-black">You have completed the unit!</h2>
                            <h2 className="text-2xl font-bold mb-4 color-black text-black">{(failedCards.length > 0) ? `You got ${failedCards.length} cards wrong, do you want to retry them?` : 'All cards answered correctly!, do you want to start again?'}</h2>
                            <div className="flex gap-5">
                                <button onClick={handleReset} className="bg-blue-500 text-white px-4 py-2 rounded">{failedCards.length > 0 ? 'Retry Failed Cards' : 'Start Again'}</button>
                            </div>
                        </div>
                    ) : (
                    <div className="flex justify-between mt-5">
                        <span/>
                        <button onClick={handleCardResult.bind(null, false)} className="bg-red-600 text-white px-9 py-4 rounded disabled:bg-gray-400 text-[1.4rem]">Incorrect</button>
                        <span className="text-black">{cardIndex + 1} / {cards.length}</span>
                        <button onClick={handleCardResult.bind(null, true)} className="bg-green-500 text-white px-9 py-4 rounded disabled:bg-gray-400 text-[1.4rem]">Correct</button>
                        <span/>
                    </div>

                    )
                    }

                </div>
            )
            }
        </div>
    )
}