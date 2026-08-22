import PracticeDetail from "./practiceDetail";

export default async function PracticeUnitPage({params}: {params: Promise<{id: string}>}){

    const { id } = await params;

    return (
        <div>
            <PracticeDetail id={parseInt(id)} />
        </div>
    )
}