"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifySession } from "../api/auth/authFunctions";
import { getUnits } from "../api/units/unitFunctions";

import NewUnitModal from "../components/units/newUnit";
import { NotebookPen } from "lucide-react";
import { Unit } from "@/app/lib/types/unitTypes";

export default function Topics(){

    const [units, setUnits] = useState<Unit[]>([]);
    const [message, setMessage] = useState("");
    const [loadingUnits, setLoadingUnits] = useState(true);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

    const router = useRouter();

    useEffect(() => {
        (async function (){
            setLoadingUnits(true);
            const res = await getUnits();
            if (res.status == "Success"){
                const data = res.data;
                if (data){
                    setUnits(data);
                    if (data.length == 0){
                        setMessage("No units created yet")
                    }
                }
                else{
                    setUnits([]);
                    setMessage("No units created yet")
                }
            }
            else{
                setMessage(`Error: ${res.reason}`);
            }
            setLoadingUnits(false);
        })();
    },[])

    useEffect(() => {
        (async () => {
            const session = await verifySession();
            if (!session){
                router.push("/login");
            }
        })();
    },[]);

    return (
        <div className="flex flex-col gap-5 p-5 vh-full">
            <div className="flex items-center gap-5">
                <h1 className="text-[3rem] font-bold text-black pl-15">Units</h1>
                <div className="flex-1"/>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-6 cursor-pointer" onClick={() => {setCreateModalOpen(true)}}> + Create Unit</button>
            </div>
            <table className="w-full border border-black border-collapse">
                <thead>
                    <tr>
                        <th className="border border-black px-4 py-2 text-left text-2xl font-bold text-black">Name</th>
                        <th className="border border-black px-4 py-2 text-left text-2xl font-bold text-black">Description</th>
                    </tr>
                </thead>

                <tbody>
                {(units.length > 0) ? (
                    units.map((unit) => (
                        <tr key={unit.id} onClick={()=> router.push(`/units/${unit.id}`)} className="group cursor-pointer hover:bg-gray-300">
                            <td className="border border-black px-4 py-2 text-left text-xl text-black">
                                <div className="flex items-center gap-2">
                                    {unit.name}
                                    <button className="ml-auto" onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            
                                        }
                                    }>                       
                                        <NotebookPen className="text-gray-500 hidden group-hover:block hover:text-blue-500 cursor-pointer"/>
                                    </button>
                                </div>
                            </td>
                            <td className={`border border-black px-4 py-2 text-left text-xl text-${unit.description ? "black" : "gray-500"}`}>
                                {unit.description ? unit.description : "No description available"} 
                                <span/>
                            </td>
                        </tr>
                    ))
                    ):
                    <tr>
                        <td className="border border-black px-4 py-2 text-left text-xl text-black" colSpan={2}>
                            {loadingUnits ? "Loading units..." : message}
                        </td>
                    </tr>
                }
                </tbody>
            </table>
            <NewUnitModal modalOpen={createModalOpen} setModalOpen={setCreateModalOpen} units={units} setUnits={setUnits} />
            {/* <EditUnitModal modalOpen={editModalOpen} setModalOpen={setEditModalOpen} units={units} setUnits={setUnits} unit={selectedUnit} /> */}
        </div>
    );
}