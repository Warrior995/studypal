import UnitDetail from "./unitDetail";

export default async function TopicPage({params}: {params: Promise<{id: string}>}){

    const { id } = await params;

    return (
        <div>
            <UnitDetail id={parseInt(id)} />
        </div>
    )
}