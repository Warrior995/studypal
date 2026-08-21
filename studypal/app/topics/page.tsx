"use client";

import { useEffect, useState } from "react";
import { getTopics } from "@/app/api/topics/topicFunctions";
import { Topic } from "@/app/lib/types/topicTypes";
import NewTopicModal  from "@/app/components/topics/newTopic";
import EditTopicModal from "@/app/components/topics/editTopic";
import { useRouter } from "next/navigation";
import { verifySession } from "../api/auth/authFunctions";
import { NotebookPen } from "lucide-react";

export default function Topics(){

    const [topics, setTopics] = useState<Topic[]>([]);
    const [message, setMessage] = useState("");
    const [loadingTopics, setLoadingTopics] = useState(true);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

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

    useEffect(() => {
        if (!editModalOpen){
            setSelectedTopic(null);
        }
    },[editModalOpen])

    return (
        <div className="flex flex-col gap-5 p-5 vh-full">
            <div className="flex items-center gap-5">
                <h1 className="text-[3rem] font-bold text-black pl-15">Topics</h1>
                <div className="flex-1"/>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-6" onClick={() => setCreateModalOpen(true)}> + Create Topic</button>
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
                        <tr key={topic.id} onClick={()=> router.push(`/topics/${topic.id}`)} className="group cursor-pointer hover:bg-gray-300">
                            <td className="border border-black px-4 py-2 text-left text-xl text-black">
                                <div className="flex items-center gap-2">
                                    {topic.title}
                                    <button className="ml-auto" onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            setSelectedTopic(topic);
                                            setEditModalOpen(true);
                                        }
                                    }>                       
                                        <NotebookPen className="text-gray-500 hidden group-hover:block hover:text-blue-500 cursor-pointer"/>
                                    </button>
                                </div>
                            </td>
                            <td className={`border border-black px-4 py-2 text-left text-xl text-${topic.description ? "black" : "gray-500"}`}>
                                {topic.description ? topic.description : "No description available"} 
                                <span/>
                            </td>
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
            <NewTopicModal modalOpen={createModalOpen} setModalOpen={setCreateModalOpen} topics={topics} setTopics={setTopics} />
            <EditTopicModal modalOpen={editModalOpen} setModalOpen={setEditModalOpen} topics={topics} setTopics={setTopics} topic={selectedTopic} />
        </div>
    );
}