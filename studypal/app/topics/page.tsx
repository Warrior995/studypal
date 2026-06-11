"use client";

import { useEffect, useState } from "react";
import { getTopics } from "@/app/api/topics/topicFunctions";
import { Topic } from "@/app/lib/types/topicTypes";
import  NewTopicModal  from "@/app/components/topics/newTopic";
import { useRouter } from "next/navigation";
import { verifySession } from "../api/auth/authFunctions";

export default function Topics(){

    const [topics, setTopics] = useState<Topic[]>([]);
    const [message, setMessage] = useState("");
    const [loadingTopics, setLoadingTopics] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);

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
        (async () => {
            const topicsResponse = await getTopics();
            if (topicsResponse.status === "Success"){
                
                setLoadingTopics(false);
                if (topicsResponse.data){
                    if (topicsResponse.data.length === 0){
                        setMessage("No topics found, create your first topic!");
                    }
                    setTopics(topicsResponse.data);
                }
            }
            else {
                setMessage(topicsResponse.reason ? topicsResponse.reason : "Failed to fetch topics, try again later");
            }
        })()
    },[])

    return (
        <div className="flex flex-col gap-5 p-5 bg-white h-screen">
            <div className="flex items-center gap-5">
                <h1 className="text-[3rem] font-bold text-black pl-15">Topics</h1>
                <div className="flex-1"/>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-6" onClick={() => setModalOpen(true)}> + Create Topic</button>
            </div>
            <table className="w-full border border-black border-collapse">
                <thead>
                    <tr>
                        <th className="border border-black px-4 py-2 text-left text-2xl font-bold text-black">Title</th>
                        <th className="border border-black px-4 py-2 text-left text-2xl font-bold text-black">Description</th>
                    </tr>
                </thead>

                <tbody>
                {(topics.length > 0) ? (
                    topics.map((topic) => (
                        <tr key={topic.id} onClick={()=> router.push(`/topics/${topic.id}`)} className="cursor-pointer hover:bg-gray-100">
                            <td className="border border-black px-4 py-2 text-left text-xl text-black">{topic.title}</td>
                            <td className={`border border-black px-4 py-2 text-left text-xl text-${topic.description ? "black" : "gray-500"}`}>{topic.description ? topic.description : "No description available"}</td>
                        </tr>
                    ))
                    ):
                    <tr>
                        <td className="border border-black px-4 py-2 text-left text-xl text-black" colSpan={2}>
                            {loadingTopics ? "Loading topics..." : message}
                        </td>
                    </tr>
                }
                </tbody>
            </table>
            <NewTopicModal modalOpen={modalOpen} setModalOpen={setModalOpen} topics={topics} setTopics={setTopics} />
        </div>
    );
}