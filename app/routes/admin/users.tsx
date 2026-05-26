import type { Route } from "./+types/users";

export function loader() {
    return { name: "React Router" };
}

export default function Reports({ loaderData }: Route.ComponentProps) {
    return (
        <div className="text-center p-4">
            <h1 className="text-2xl">Hello, {loaderData.name}</h1>
            <p>Users</p>
        </div>
    );
}
