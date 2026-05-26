import Collapsible from "~/components/collapsible";
import type { Route } from "./+types/reports";
import { db } from "../../../firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export function loader() {
    return { name: "Reports" };
}

export default function Reports({ loaderData }: Route.ComponentProps) {
    const reportsCollectionRef = collection(db, "reports");
    const [unhandledReports, setUnhandledReports]: any[] = useState([]);
    const usersCollectionRef = collection(db, "users");
    const [users, getUsers]: any[] = useState([]);

    const getUserById = (id: string) => {
        for(let u of users) {
            if(u.id == id) return u;
        }
    }

    useEffect(() => {
        const getReports = async () => {
            const data = await getDocs(reportsCollectionRef);
            data.docs.map((doc) => {
                console.log(unhandledReports);
                unhandledReports.push(doc.data());
            })
        };

        getReports();
    }, [])

    return (
        <>
            <Collapsible label="Unhandled Reports">
                <table>
                    <thead>
                        <tr>
                            <th>Reported By</th>
                            <th>Reported On</th>
                            <th>Reasons</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {unhandledReports.map((report: any) =>
                            (
                                <tr key={report.id}>
                                    <td>{getUserById(report.reportedBy)?.firstName ?? ""}</td>
                                    <td>{report.timestamp.toString()}</td>
                                    <td>{report?.reasons.map((item: any) => item.name).join(', ') ?? ""}</td>
                                    <td><button>View Report</button></td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </Collapsible>

            <Collapsible label="Handled Reports">
                <table>
                    <tr>
                        <th>Reported By</th>
                        <th>Reported On</th>
                        <th>Reasons</th>
                        <th>Actions</th>
                    </tr>
                    <tr>
                        <td>Alfreds Futterkiste</td>
                        <td>Maria Anders</td>
                        <td>Inappropriate</td>
                        <td><button>View Report</button></td>
                    </tr>
                    <tr>
                        <td>Alfreds Futterkiste</td>
                        <td>Maria Anders</td>
                        <td>Inappropriate</td>
                        <td><button>View Report</button></td>
                    </tr>
                </table>
            </Collapsible>

        </>
    );
}
