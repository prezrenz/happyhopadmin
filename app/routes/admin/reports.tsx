import type { Route } from "./+types/reports";
import { deletePostById, getAllPosts, getAllReports, getAllUsers, getPostById, getReportById, getUserById, handleReport } from "../../../firebase.config";
import { useEffect, useState } from "react";
import ReportCard from "~/components/report-card";

export function loader() {
    return { name: "Reports" };
}

export default function Reports() {
    const [users, setUsers] = useState([{}]);
    const [reports, setReports] = useState([{}]);
    const [posts, setPosts] = useState([{}]);

    const deleteAndHandleReport = (id: string, postId: string) => {
        deletePostById(postId);
        handleReport(id);
    }

    useEffect(() => {
        return getAllReports(setReports);
    }, []);

    useEffect(() => {
        return getAllPosts(setPosts);
    }, []);

    useEffect(() => {
        return getAllUsers(setUsers);
    }, []);

    return (
        <div className="flex flex-col items-center">
            <h1 className="font-bold text-2xl">Reports</h1>
            {
                reports.filter((report: any) => !report.handled).map((report: any) => {
                    return (
                        <ReportCard
                            report={report}
                            reporter={getUserById(users, report?.reportedBy)}
                            post={getPostById(posts, report?.postId)}
                            handleReport={handleReport}
                            deleteAndHandleReport={deleteAndHandleReport}
                        />
                    )
                })
            }
            {
                reports.filter((report: any) => report.handled).map((report: any) => {
                    return (
                        <ReportCard
                            report={report}
                            reporter={getUserById(users, report?.reportedBy)}
                            post={getPostById(posts, report?.postId)}
                            handleReport={handleReport}
                            deleteAndHandleReport={deleteAndHandleReport}
                        />
                    )
                })
            }
        </div>
    );
}
