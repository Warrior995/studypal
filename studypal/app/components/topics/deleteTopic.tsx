import { Topic } from "@/app/lib/types/topicTypes";
import { useEffect, useState } from "react";
import { deleteTopic } from "@/app/api/topics/topicFunctions";
import { useRouter } from "next/navigation";

export default function DeleteTopicModal({modalOpen, setModalOpen, topic}: {modalOpen: boolean, setModalOpen: (open: boolean) => void, topic: Topic | null}){

    const router = useRouter();

    const [topicToDelete, setTopicToDelete] = useState<Topic | null>(null);
    const [inputValue, setInputValue] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setTopicToDelete(topic);
    },[topic])

    function handleDeletion(){
        if (loading){
            return;
        }
        setLoading(true);
        setMessage("");
        if (topicToDelete === null){
            setMessage("Topic is not selected, please try again later");
            setLoading(false);
            return;
        }
        if (inputValue === ""){
            setMessage("Please enter the topic name to confirm deletion.");
            setLoading(false);
            return;
        }
        if (inputValue !== topicToDelete.title){
            setMessage("The topic name you entered does not match the selected topic.");
            setLoading(false);
            return;
        }

        deleteTopic(topicToDelete.id).then((response) => {
            if (response.status === "Success"){
                setMessage("");
            }
            else{
                setMessage(response.reason ? response.reason : "Failed to delete topic, try again later");
            }
        }).finally(() => {
            setLoading(false);
            setModalOpen(false);
            router.push("/topics");
        })

    }

    return (
        <div className={`${modalOpen ? "fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center" : "hidden"}`}>
            <div className="bg-white p-5 rounded-lg w-[30rem]">
                <h2 className="text-[1.5rem] font-bold text-black mb-5">Delete Topic</h2>
                <div className=" flex flex-col">
                    <p className="text-black mb-1">Are you sure you want to delete the topic "{topicToDelete?.title}"? This action cannot be undone.</p>
                    <p className="text-black mb-5">To delete the topic, write the full name of the topic in the box below</p>
                </div>
                <input type="text" className="border border-gray-600 rounded-lg px-3 py-2 mb-5 w-full" placeholder="Type the topic name here" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
                <p className="text-red-600 mb-5">{message}</p>
                <div className="flex gap-5">
                    <span className="ml-auto"/>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg mr-6 cursor-pointer w-[10rem]" onClick={handleDeletion}>{ loading ? "Loading...": "Delete" }</button>
                    <button className="bg-gray-300 text-black px-4 py-2 rounded-lg cursor-pointer w-[10rem]" onClick={() => setModalOpen(false)}> Cancel</button>
                </div>
            </div>
        </div>
    );
}