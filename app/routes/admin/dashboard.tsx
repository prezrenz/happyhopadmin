import Card from "~/components/card";
import type { Route } from "./+types/dashboard";

export function loader() {
    return { name: "Bunny Care Admin" };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
    return (
        <div className="grid grid-cols-3 place-content-center justify-center align-center">
            <Card mainText={"1"} subText={"Unhandled Reports"} />
            <Card mainText={"1"} subText={"Handled Reports"} />
            <Card mainText={"1"} subText={"Total Reports"} />

            <Card mainText={"1"} subText={"Unverified Users"} />
            <Card mainText={"1"} subText={"Verified Users"} />
            <Card mainText={"1"} subText={"Total Pet Owners"} />

            <Card mainText={"1"} subText={"Total Veterinary Users"} />
            <Card mainText={"1"} subText={"Total Users"} />
        </div>
    );
}
