import { useState, useEffect } from "react"

import { Square, SquareX} from "lucide-react"

import { CheckBoxTemplate } from "@/app/lib/types/generalTypes"


export default function CheckBoxTable<T>({checkList, setCheckList} : { checkList: CheckBoxTemplate<T>[], setCheckList: (checkList :CheckBoxTemplate<T>[]) => void }){

    function checkElement(state: boolean, id: number){
        const temp = [...checkList];
        temp[id].checked = state;
        setCheckList(temp);
    }

    return(
        <div>
            <h2 className="pl-[0.5] text-black text-[1.3rem]">Select the topics to assign</h2>
            <div className="border-[1.5] h-[25.5vh] rounded-lg overflow-y-auto">
                {checkList.length > 0 ? (
                    checkList.map((e, index) => {
                        if (index < checkList.length - 1){
                            return (
                                <div key={index}>
                                    <CheckBoxRow id={index} checkBoxElement={e} setChecked={checkElement}/>
                                    <span className="flex mx-auto bg-black h-[0.01rem]"/>
                                </div>
                            )
                        }
                        else {
                            return (
                                <div key={index}>
                                    <CheckBoxRow id={index} checkBoxElement={e} setChecked={checkElement}/>
                                </div>
                            )
                        }
                    })
                ) : (
                    <div className="flex w-auto min-h-[2rem] items-center pl-[1rem] rounded-s gap-1  my-[0.1rem]">
                        <span>There are no unassigned topics</span>
                    </div>
                )}
            </div>
        </div>
    )
}

function CheckBoxRow<T>({id, checkBoxElement, setChecked} : {id: number, checkBoxElement: CheckBoxTemplate<T> , setChecked: (state: boolean, id: number) => void}){

    const [name, setName] = useState("");

    useEffect(() => {
        if (typeof(checkBoxElement.object) === "object" && checkBoxElement.object !== null && "name" in checkBoxElement.object){
            setName(String(checkBoxElement.object.name));
        }
        else if (typeof(checkBoxElement.object) === "object" && checkBoxElement.object !== null && "title" in checkBoxElement.object){
            setName(String(checkBoxElement.object.title));
        }
    },[])

    return (
        <div className="flex w-auto min-h-[2rem] items-center pl-[1rem] rounded-s gap-1  my-[0.1rem]">
            <span className="max-w-[26rem] break-all">{name}</span>
            <span className="flex mx-auto h-[2rem] bg-black"/>
            <button className="cursor-pointer" onClick={() => {setChecked(!checkBoxElement.checked, id)}}>
                {checkBoxElement.checked ? (
                        <SquareX className="text-gray-600 mr-[1rem]"/>
                    ) : (
                        <Square className="text-gray-600 mr-[1rem]"/>
                    )
                }
            </button>
        </div>
    )
}