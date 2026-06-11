import TopicDetail from "./topicDetail";

export default async function TopicPage({params}: {params: Promise<{id: string}>}){

    const { id } = await params;

    return (
        <div>
            <TopicDetail id={parseInt(id)} />
        </div>
    )
}