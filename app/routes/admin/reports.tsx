const pick = (obj: any, ...keys: string[]) => {
    for (const key of keys) {
        if (obj && obj[key] !== undefined && obj[key] !== null && obj[key] !== "") {
            return obj[key];
        }
    }
    return "";
};

const formatTimestamp = (value: any) => {
    if (!value) return "";
    if (typeof value?.toDate === "function") {
        return value.toDate().toString().replace(/ GMT.*$/, "");
    }
    return String(value).replace(/ GMT.*$/, "");
};

const formatReasons = (value: any) => {
    if (Array.isArray(value)) return value.join(", ");
    return value ? String(value) : "";
};

type ReportCardProps = {
    report: any;
    reporter: any;
    post: any;
    handleReport: (id: string) => void;
    deleteAndHandleReport: (id: string, postId: string) => void;
};

export default function ReportCard({
    report,
    reporter,
    post,
    handleReport,
    deleteAndHandleReport,
}: ReportCardProps) {
    const fullName = pick(reporter, "fullName", "fullname", "full_name", "name", "displayName");
    const username = pick(reporter, "username", "userName", "user_name");
    const email = pick(reporter, "email", "Email");
    const verified = pick(reporter, "verified", "isVerified");
    const image = pick(post, "imageUrl", "image", "photoUrl", "photo", "img", "url");
    const reasons = formatReasons(pick(report, "reasons", "reason"));
    const timestamp = formatTimestamp(pick(report, "timestamp", "createdAt", "date"));

    return (
        <div className="w-[95%] my-4 p-4 border border-black rounded-2xl bg-orange-100">
            <h2 className="text-center font-bold text-2xl mb-4">
                Reported By: {fullName}
            </h2>

            <div className="flex justify-between mb-3">
                <span className="font-bold">Email:</span>
                <span>{email}</span>
            </div>

            <div className="flex justify-between mb-3">
                <span className="font-bold">Full Name:</span>
                <span>{fullName}</span>
            </div>

            <div className="flex justify-between mb-3">
                <span className="font-bold">Username:</span>
                <span>{username}</span>
            </div>

            <div className="flex justify-between mb-3">
                <span className="font-bold">Verified:</span>
                <span>{verified === true || verified === "true" ? "Yes" : "No"}</span>
            </div>

            <p className="mb-3">
                <span className="font-bold">Timestamp: </span>
                {timestamp}
            </p>

            <p className="mb-3">
                <span className="font-bold">Reasons: </span>
                {reasons}
            </p>

            {image && (
                <img
                    src={image}
                    alt="Reported post"
                    className="w-full max-h-96 object-cover border border-black mb-3"
                />
            )}

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