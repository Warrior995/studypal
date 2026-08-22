import { useEffect, useState } from "react";
import type { Topic } from "@/app/lib/types/topicTypes";
import type { Unit } from "@/app/lib/types/unitTypes";
import { editTopic } from "@/app/api/topics/topicFunctions";
import { getUnits } from "@/app/api/units/unitFunctions";


export default function EditTopicModal({modalOpen, setModalOpen, topics, setTopics, topic}: {modalOpen: boolean, setModalOpen: (open: boolean) => void, topics: Topic[], setTopics: (topics: Topic[]) => void, topic: Topic | null}){

    const [title, setTitle] = useState(topic?.title || "");
    const [description, setDescription] = useState(topic?.description || "");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [unitSelection, setUnitSelection] = useState<Unit | null>(null);
    const [unitText, setUnitText] = useState("");
    const [units, setUnits] = useState<Unit[]>([]);
    const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
    const [unitInputFocused, setUnitInputFocused] = useState(false);
    
    useEffect(()=>{
        setTitle(topic?.title || "");
        setDescription(topic?.description || "");
        units.forEach((e) => {
            if (e.id == topic?.unit_id){
                setUnitSelection(e);
                setUnitText(e.name);
            }
        });
        if (!topic?.unit_id) {
            setUnitSelection(null);
            setUnitText("");
        }
    },[topic, units])

    useEffect(() => {
        (async function(){
            const res = await getUnits();
            if (res.status == "Success"){
                if (res.data){
                    setUnits(res.data);
                }
            }
        })();
    },[])
    
    async function handleEditTopic(){
        if (title === "" || message){
            if (title === ""){
                setMessage("Title cannot be empty");
            }
            return;
        }

        if (topic === null){
            setMessage("Topic is not selected, please try again later");
            return;
        }

        setLoading(true);
        const response = await editTopic(topic.id, title, description, unitSelection?.id ? unitSelection.id: null);
        setLoading(false);
        if (response.status === "Success"){
            setMessage("");
            setTitle("");
            setDescription("");
            if (response.data){
                const newTopic = response.data as Topic;
                setTopics(topics.map((t) => t.id === topic.id ? newTopic : t));
            }
            setModalOpen(false);
        }
        else {
            setMessage(response.reason ? response.reason : "Failed to edit topic, try again later");
        }

    }

    useEffect(() => {
        for (let topic of topics){
            if (topic.title === title && topic.id !== topic.id){
                setMessage("A topic with this title already exists, please choose a different title");
                return;
            }
        }
        setMessage("");
    },[title])

    useEffect(() => {
        const searchText = unitText.trim().toLowerCase();
        setFilteredUnits(units.filter((unit) => unit.name.toLowerCase().includes(searchText)).slice(0, 3));
    },[units, unitText])

    function handleUnitTextChange(value: string) {
        setUnitText(value);
        setUnitSelection(null);
    }

    function handleUnitSelection(unit: Unit) {
        setUnitSelection(unit);
        setUnitText(unit.name);
        setUnitInputFocused(false);
    }
    
    return (
        <div className={`${modalOpen ? "fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center" : "hidden"}`}>
            <div className={`${modalOpen ? "block" : "hidden"} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg z-50 max-h[80vh] overflow-y-auto`}>
                <div className="pl-4 pr-4 m-4 flex flex-col gap-4 relative w-[80vh]">
                    <button className="absolute top-2 right-3 text-gray-500 hover:text-gray-700" onClick={() => setModalOpen(false)}>✕</button>
                    <h2 className="text-2xl font-bold mb-4 text-black">Edit Topic</h2>
                    <div className="flex flex-col gap-2 w-full">
                        <h2 className="pl-[0.5] text-black text-[1.3rem]">Unit</h2>
                        <div className="relative">
                            <input
                                value={unitText}
                                onChange={(e) => handleUnitTextChange(e.target.value)}
                                onFocus={() => setUnitInputFocused(true)}
                                onBlur={() => setTimeout(() => setUnitInputFocused(false), 0)}
                                type="text"
                                placeholder="Write a unit to assign"
                                className="border border-black text-black p-1.5 pl-4 rounded-xl border-[0.05rem] w-full"
                                role="combobox"
                                aria-expanded={unitInputFocused && filteredUnits.length > 0}
                                aria-controls="unit-options"
                            />
                            {unitInputFocused && filteredUnits.length > 0 && (
                                <div id="unit-options" role="listbox" className="absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg z-10">
                                    {filteredUnits.map((unit) => (
                                        <button
                                            key={unit.id}
                                            type="button"
                                            role="option"
                                            aria-selected={unitSelection?.id === unit.id}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => handleUnitSelection(unit)}
                                            className="block w-full px-4 py-2 text-left text-black hover:bg-blue-50"
                                        >
                                            {unit.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <h2 className="pl-[0.5] text-black text-[1.3rem]">Title</h2>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Write a topic for your title" className="border border-black text-black p-1.5 pl-4 rounded-xl border-[0.05rem]"></input>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <h2 className="pl-[0.5] text-black text-[1.3rem]">Description</h2>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write a description for your topic" className="border border-black text-black p-1.5 pl-4 rounded-xl border-[0.05rem] h-[5rem]"></textarea>
                    </div>
                    <h1 className="text-red-500">{message}</h1>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-2 self-end" onClick={handleEditTopic} disabled={loading}>
                        {loading ? "Editing..." : "Edit Topic"}
                    </button>
                </div>
            </div>
        </div>
    )
}