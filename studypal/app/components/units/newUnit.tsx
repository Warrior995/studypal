import { useEffect, useState } from "react";

import { createUnit } from "@/app/api/units/unitFunctions";
import { getUnassignedTopics } from "@/app/api/topics/topicFunctions";
import { editTopic } from "@/app/api/topics/topicFunctions";

import CheckBoxTable from "../customUI/checkboxTable";

import type { Unit } from "@/app/lib/types/unitTypes";
import type { Topic } from "@/app/lib/types/topicTypes";
import { CheckBoxTemplate } from "@/app/lib/types/generalTypes";

export default function NewUnitModal({modalOpen, setModalOpen, units, setUnits}: {modalOpen: boolean, setModalOpen: (open: boolean) => void, units: Unit[], setUnits: (unit: Unit[]) => void}){

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [assignMode, setAssignMode] = useState(false);
    const [unassignedTopics, setUnassignedTopics] = useState<CheckBoxTemplate<Topic>[]>([])

    async function handleCreateUnit(){
        if (name === "" || message){
            if (name === ""){
                setMessage("Title cannot be empty");
            }
            return;
        }

        setLoading(true);
        const response = await createUnit(name, description);
        setLoading(false);
        if (response.status === "Success"){
            setMessage("");
            setName("");
            setDescription("");
            if (response.data){
                const newUnit = response.data as Unit;
                setUnits([...units, newUnit]);

                unassignedTopics.forEach(element => {
                    if (element.checked){
                        editTopic(element.object.id, element.object.title, element.object.description? element.object.description : "", newUnit.id);
                    }
                });

            }
            setModalOpen(false);
        }
        else {
            setMessage(response.reason ? response.reason : "Failed to create topic, try again later");
        }

        (async function(){
            const res = await getUnassignedTopics();

            if (res.status == "Success"){

                if (res.data){

                    const data = res.data.map((e) => {
                      const value : CheckBoxTemplate<Topic> = {
                        object: e,
                        checked: false
                      }
                      return value;
                    })
                    setUnassignedTopics(data);
                }

            }

        })()

    }



    useEffect(() => {
        (async function(){
            const res = await getUnassignedTopics();

            if (res.status == "Success"){

                if (res.data){

                    const data = res.data.map((e) => {
                      const value : CheckBoxTemplate<Topic> = {
                        object: e,
                        checked: false
                      }
                      return value;
                    })
                    setUnassignedTopics(data);
                }

            }

        })()
    },[])

    useEffect(() => {
        for (let topic of units){
            if (topic.name === name){
                setMessage("A topic with this title already exists, please choose a different title");
                return;
            }
        }
        setMessage("");
    },[name])

    useEffect(() => {
        if (!modalOpen){
            setName("");
            setDescription("");
            setMessage("");
            setLoading(false);
            setAssignMode(false);
        }
    },[modalOpen])
    
    return (
        <div className={`${modalOpen ? "fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center" : "hidden"}`}>
            <div className={`${modalOpen ? "block" : "hidden"} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg z-50 max-h[80vh] overflow-y-auto`}>
                <div className="pl-4 pr-4 m-4 flex flex-col gap-4 relative w-[80vh] h-[55vh]">
                    <button className="absolute top-2 right-3 text-gray-500 hover:text-gray-700" onClick={() => setModalOpen(false)}>✕</button>
                    <h2 className="text-2xl font-bold mb-4 text-black">Create New Unit</h2>
                    {assignMode ? (
                        <CheckBoxTable checkList={unassignedTopics} setCheckList={setUnassignedTopics}/>
                    ) : (
                        <div>
                            <div className="flex flex-col gap-2 w-full">
                                <h2 className="pl-[0.5] text-black text-[1.3rem]">Title</h2>
                                <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Write a name for your unit" className="border border-black text-black p-1.5 pl-4 rounded-xl border-[0.05rem]"></input>
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <h2 className="pl-[0.5] text-black text-[1.3rem]">Description</h2>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write a description for your unit" className="border border-black text-black p-1.5 pl-4 rounded-xl border-[0.05rem] h-[5rem]"></textarea>
                            </div>
                        </div>
                    )}
                    
                    <h1 className="text-red-500">{message}</h1>
                    <div className="flex gap-[2rem]">
                        <span className="ml-auto"/>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-2 self-end w-[8rem]" onClick={() => {setAssignMode(!assignMode)}}>{assignMode ? "Back" : "Asign topics"}</button>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-2 self-end" onClick={handleCreateUnit} disabled={loading}>
                            {loading ? "Creating..." : "Create Unit"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}