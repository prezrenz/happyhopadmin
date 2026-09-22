interface ReportCardProps {
    report: any,
    reporter: any,
    post: any,
    handleReport: (id: any) => void,
    deleteAndHandleReport: (id: any, postId: any) => void
}

export default function ReportCard({ report, reporter, post, handleReport, deleteAndHandleReport }: ReportCardProps) {
    return (
        <div className={"rounded-2xl bg-orange-100 border-1 aspect-square flex flex-col place-items-center w-10/12 h-auto m-3 " + (report?.handled ? "opacity-25" : "")}>
            <div className="flex flex-col justify-center w-full p-4">
                <h2 className="self-center font-bold text-2xl">
                    Reported By: {reporter?.firstName} {reporter?.lastName}
                </h2>
                <div className="flex flex-row">
                    <b>Timestamp: </b>
                    {report?.timestamp?.toDate()?.toString()}
                </div>
                <div className="flex flex-row">
                    <b>Reasons: </b>
                    {report?.reasons?.join(", ")}
                </div>
                <div className="flex flex-col justify-center">
                    <img className="w-full h-128 object-cover border-1" src={post?.postImage} />
                    <div className="flex -flex-row">
                        <b>Poster Name: </b>
                        {post?.posterName}
                    </div>
                    <div className="flex -flex-row">
                        <b>Posted On: </b>
                        {post?.timestamp?.toDate()?.toString()}
                    </div>
                    <div className="flex -flex-row">
                        <b>Post Text: </b>
                        {post?.post}
                    </div>
                    <div className="flex -flex-row">
                        <b>Like Count: </b>
                        {post?.likesCount}
                    </div>
                    <div className="flex -flex-row">
                        <b>Comment Count: </b>
                        {post?.commentCount}
                    </div>
                </div>
            </div>
            <div className="flex flex-row">
                {
                    !report?.handled &&
                    <button onClick={() => handleReport(report?.id)}>Handle</button>
                }
                {
                    !report?.handled &&
                    <button onClick={() => deleteAndHandleReport(report?.id, post?.id)}>Delete Post</button>
                }
            </div>
        </div>
    )
}
