import { Timestamp } from "firebase/firestore";

type ReportCardProps = {
    report: any;
    reporter: any;
    post: any;
    handleReport: (id: string) => void;
    deleteAndHandleReport: (id: string, postId: string) => void;
};

function formatTimestamp(value: any): string {
    if (!value) return "";

    const date =
        value instanceof Timestamp
            ? value.toDate()
            : typeof value?.toDate === "function"
              ? value.toDate()
              : new Date(value);

    if (isNaN(date.getTime())) return "";

    return date.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

export default function ReportCard({
    report,
    reporter,
    post,
    handleReport,
    deleteAndHandleReport,
}: ReportCardProps) {
    return (
        <div className="w-[95%] my-4 p-4 border border-black rounded-2xl bg-orange-100">
            <h2 className="text-center font-bold text-2xl mb-4">
                Reported By: {reporter?.fullName}
            </h2>

            <div className="flex justify-between mb-3">
                <span className="font-bold">Email:</span>
                <span>{reporter?.email}</span>
            </div>

            <div className="flex justify-between mb-3">
                <span className="font-bold">Full Name:</span>
                <span>{reporter?.fullName}</span>
            </div>

            <div className="flex justify-between mb-3">
                <span className="font-bold">Username:</span>
                <span>{reporter?.username}</span>
            </div>

            <div className="flex justify-between mb-3">
                <span className="font-bold">Verified:</span>
                <span>{reporter?.verified ? "Yes" : "No"}</span>
            </div>

            <p className="mb-3">
                <span className="font-bold">Timestamp: </span>
                {formatTimestamp(report?.timestamp)}
            </p>

            <p className="mb-3">
                <span className="font-bold">Reasons: </span>
                {Array.isArray(report?.reasons)
                    ? report.reasons.join(", ")
                    : report?.reasons ?? report?.reason}
            </p>

            {post?.imageUrl && (
                <img
                    src={post.imageUrl}
                    alt="Reported post"
                    className="w-full max-h-96 object-cover border border-black mb-3"
                />
            )}

            {post?.caption && <p className="mb-3">{post.caption}</p>}

            {!report?.handled && (
                <div className="flex gap-3 justify-end">
                    <button
                        className="px-4 py-2 rounded-lg bg-green-600 text-white font-bold"
                        onClick={() => handleReport(report.id)}
                    >
                        Dismiss
                    </button>
                    <button
                        className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold"
                        onClick={() => deleteAndHandleReport(report.id, report.postId)}
                    >
                        Delete Post
                    </button>
                </div>
            )}
        </div>
    );
}