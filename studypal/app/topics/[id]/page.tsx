export default async function TopicPage({params}: {params: Promise<{id: string}>}){

    const { id } = await params;

    return (
        <div>
            <h1>Topic {id}</h1>
        </div>
    )
}