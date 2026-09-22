import type { Route } from "./+types/training";

export function loader() {
    return { name: "ML Training" };
}

export default function Training({ loaderData }: Route.ComponentProps) {
    return (
        <h1>ML Training</h1>
    );
}
