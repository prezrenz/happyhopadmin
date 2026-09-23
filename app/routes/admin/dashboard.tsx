import Card from "~/components/card";
import type { Route } from "./+types/dashboard";
import { getAllPosts, getAllReports, getAllUsers, getReportsByHandling, getUsersByRole, getUsersByVerification } from "../../../firebase.config";
import { useEffect, useState } from "react";

export function loader() {
    return { name: "Bunny Care Admin" };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
    const [users, setUsers] = useState([{}]);
    const [reports, setReports] = useState([{}]);
    const [posts, setPosts] = useState([{}]);

    useEffect(() => {
        return getAllUsers(setUsers);
    }, []);
    
    useEffect(() => {
        return getAllReports(setReports);
    }, []);

    useEffect(() => {
        return getAllPosts(setPosts);
    }, []);


    return (
        <div className="p-4 gap-16 grid grid-cols-3 place-content-center justify-center align-center">
            <Card mainText={getReportsByHandling(reports, false).length.toString()} subText={"Unhandled Reports"} />
            <Card mainText={getReportsByHandling(reports, true).length.toString()} subText={"Handled Reports"} />
            <Card mainText={reports.length.toString()} subText={"Total Reports"} />

            <Card mainText={getUsersByVerification(users, false).length.toString()} subText={"Unverified Users"} />
            <Card mainText={getUsersByVerification(users, true).length.toString()} subText={"Verified Users"} />
            <Card mainText={getUsersByRole(users, "rabbit owner").length.toString()} subText={"Total Pet Owners"} />

            <Card mainText={getUsersByRole(users, "veterinary").length.toString()} subText={"Total Veterinary Users"} />
            <Card mainText={users.length.toString()} subText={"Total Users"} />
            <Card mainText={posts.length.toString()} subText={"Total Posts"} />
        </div>
    );
}
