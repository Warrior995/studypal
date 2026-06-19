import { useEffect, useState } from "react";
import type { Topic } from "@/app/lib/types/topicTypes";
import { createTopic } from "@/app/api/topics/topicFunctions";


export default function NewTopicModal({modalOpen, setModalOpen, topics, setTopics}: {modalOpen: boolean, setModalOpen: (open: boolean) => void, topics: Topic[], setTopics: (topics: Topic[]) => void}){

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    

    async function handleCreateTopic(){
        if (title === "" || message){
            if (title === ""){
                setMessage("Title cannot be empty");
            }
            return;
        }

        setLoading(true);
        const response = await createTopic(title, description);
        setLoading(false);
        if (response.status === "Success"){
            setMessage("");
            setTitle("");
            setDescription("");
            if (response.data){
                const newTopic = response.data as Topic;
                setTopics([...topics, newTopic]);
            }
            setModalOpen(false);
        }
        else {
            setMessage(response.reason ? response.reason : "Failed to create topic, try again later");
        }

    }

    useEffect(() => {
        for (let topic of topics){
            if (topic.title === title){
                setMessage("A topic with this title already exists, please choose a different title");
                return;
            }
        }
        setMessage("");
    },[title])
    
    return (
        <div className={`${modalOpen ? "fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center" : "hidden"}`}>
            <div className={`${modalOpen ? "block" : "hidden"} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg z-50 max-h[80vh] overflow-y-auto`}>
                <div className="pl-4 pr-4 m-4 flex flex-col gap-4 relative w-[80vh]">
                    <button className="absolute top-2 right-3 text-gray-500 hover:text-gray-700" onClick={() => setModalOpen(false)}>✕</button>
                    <h2 className="text-2xl font-bold mb-4 text-black">Create New Topic</h2>
                    <div className="flex flex-col gap-2 w-full">
                        <h2 className="pl-[0.5] text-black text-[1.3rem]">Title</h2>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Write a topic for your title" className="border border-black text-black p-1.5 pl-4 rounded-xl border-[0.05rem]"></input>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <h2 className="pl-[0.5] text-black text-[1.3rem]">Description</h2>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write a description for your topic" className="border border-black text-black p-1.5 pl-4 rounded-xl border-[0.05rem] h-[5rem]"></textarea>
                    </div>
                    <h1 className="text-red-500">{message}</h1>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-2 self-end" onClick={handleCreateTopic} disabled={loading}>
                        {loading ? "Creating..." : "Create Topic"}
                    </button>
                </div>
            </div>
        </div>
    )
}