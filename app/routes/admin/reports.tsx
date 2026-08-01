import Collapsible from "~/components/collapsible";
import type { Route } from "./+types/reports";
import { db, getAllPosts, getAllReports } from "../../../firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export function loader() {
    return { name: "Reports" };
}

export default function Reports({ loaderData }: Route.ComponentProps) {
    const [reports, setReports] = useState([{}]);
    const [posts, setPosts] = useState([{}]);

    useEffect(() => {
        return getAllReports(setReports);
    }, []);

    useEffect(() => {
        return getAllPosts(setPosts);
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
                            {reports.map((report: any) => {
                                return (
                                    <tr>
                                        <td>{report?.timestamp?.toDate()?.toString()}</td>
                                        <td>{report?.reportedBy}</td>
                                        <td>{report?.reasons?.join(", ")}</td>
                                        <td><button>View Details</button></td>
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
                            {reports.map((report: any) => {
                                return (
                                    <tr>
                                        <td>{report?.timestamp?.toDate()?.toString()}</td>
                                        <td>{report?.reportedBy}</td>
                                        <td>{report?.reasons?.join(", ")}</td>
                                        <td><button>View Details</button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
            }
        </div>
    );
}
