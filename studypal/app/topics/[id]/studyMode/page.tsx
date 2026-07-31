import StudyDetail from "./studyDetail";

export default async function StudyTopicPage({params}: {params: Promise<{id: string}>}){

    const { id } = await params;

    return (
        <div>
            <StudyDetail id={parseInt(id)} />
        </div>
    )
}