import Collapsible from "~/components/collapsible";
import type { Route } from "./+types/reports";
import { db, deletePostById, getAllPosts, getAllReports, getAllUsers, getPostById, getReportById, getUserById, handleReport } from "../../../firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Modal from "~/components/modal";

export function loader() {
    return { name: "Reports" };
}

export default function Reports({ loaderData }: Route.ComponentProps) {
    const [users, setUsers] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [currentReport, setCurrentReport] = useState<any>({});
    const [currentReportPost, setCurrentReportPost] = useState<any>({});
    const [currentReporter, setCurrentReporter] = useState<any>({});
    const [currentReportPoster, setCurrentReportPoster] = useState<any>({});
    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = (id: string) => {
        setCurrentReport(getReportById(reports, id));
        setCurrentReportPost(getPostById(posts, currentReport?.postId));
        setCurrentReporter(getUserById(users, currentReport?.reportedBy));
        setCurrentReportPoster(getUserById(users, currentReportPost?.posterId));
        setModalOpen(true);
    }

    const closeModal = () => {
        setModalOpen(false);
    }

    const deleteAndHandleReport = (id: string) => {
        deletePostById(currentReportPost?.id);
        handleReport(id);
    }

    const getReporterName = (id: string) => {
        const reporter: any = getUserById(users, id);
        return reporter?.firstName + " " + reporter?.lastName;
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
        <div>
            <h1>Unhandled Reports</h1>
            {
                reports.filter((report: any) => !report?.handled).length <= 0 ?
                    <p>All current reports are handled!</p> :
                    <table>
                        <thead>
                            <tr>
                                <th>Reported On</th>
                                <th>Reported By</th>
                                <th>Reason</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.filter((report: any) => !report?.handled).map((report: any) => {
                                return (
                                    <tr key={report?.id}>
                                        <td>{report?.timestamp?.toDate()?.toString()}</td>
                                        <td>{getReporterName(report?.reportedBy)}</td>
                                        <td>{report?.reasons?.join(", ")}</td>
                                        <td><button onClick={() => openModal(report?.id)}>View Details</button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
            }
            <h1>Handled Reports</h1>
            {
                reports.filter((report: any) => report?.handled).length <= 0 ?
                    <p>No reports have been handled so far!</p> :
                    <table>
                        <thead>
                            <tr>
                                <th>Reported On</th>
                                <th>Reported By</th>
                                <th>Reason</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.filter((report: any) => report?.handled).map((report: any) => {
                                return (
                                    <tr key={report?.id}>
                                        <td>{report?.timestamp?.toDate()?.toString()}</td>
                                        <td>{getReporterName(report?.reportedBy)}</td>
                                        <td>{report?.reasons?.join(", ")}</td>
                                        <td><button onClick={() => openModal(report?.id)}>View Details</button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
            }
            <Modal isOpen={isModalOpen}>
                <div className="flex flex-col justify-center max-w-md mx-auto p-4 gap-1">
                    <div className="flex flex-row gap-1">
                        <b>Reported By: </b>
                        <p>{currentReporter?.firstName} {currentReporter?.lastName}</p>
                    </div>
                    <div className="flex flex-row gap-1">
                        <b>Timestamp: </b>
                        {currentReport?.timestamp?.toDate()?.toString()}
                    </div>
                    <div className="flex flex-row gap-1">
                        <b>Reasons: </b>
                        {currentReport?.reasons?.join(", ")}
                    </div>
                    <div className="flex flex-col justify-center gap-1">
                        <img
                            src={currentReportPost?.postImage}
                            className="w-full max-h-48 object-cover rounded"
                        />
                        <div className="flex flex-row gap-1">
                            <b>Poster Name: </b>
                            {currentReportPost?.posterName}
                        </div>
                        <div className="flex flex-row gap-1">
                            <b>Posted On: </b>
                            {currentReportPost?.timestamp?.toDate()?.toString()}
                        </div>
                        <div className="flex flex-row gap-1">
                            <b>Post Text: </b>
                            {currentReportPost?.post}
                        </div>
                        <div className="flex flex-row gap-1">
                            <b>Like Count: </b>
                            {currentReportPost?.likesCount}
                        </div>
                        <div className="flex flex-row gap-1">
                            <b>Comment Count: </b>
                            {currentReportPost?.commentCount}
                        </div>
                    </div>
                </div>
                <div className="flex flex-row gap-2 justify-center mt-2">
                    <button onClick={closeModal}>Close</button>
                    {
                        !currentReport?.handled &&
                        <button onClick={() => handleReport(currentReport?.id)}>Handle</button>
                    }
                    {
                        !currentReport?.handled &&
                        <button onClick={() => deleteAndHandleReport(currentReport?.id)}>Delete Post</button>
                    }
                </div>
            </Modal>
        </div>
    );
}