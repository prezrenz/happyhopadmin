import type { Route } from "./+types/recommendations";

export function loader() {
    return { name: "Recommendations" };
}

export default function Recommendations({ loaderData }: Route.ComponentProps) {
    return (
        <h1>Recommendations</h1>
    );
}
