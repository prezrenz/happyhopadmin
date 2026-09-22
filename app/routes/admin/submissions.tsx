import type { Route } from "./+types/submissions";

export function loader() {
    return { name: "Image Submissions" };
}

export default function Submissions({ loaderData }: Route.ComponentProps) {
    return (
        <h1>Image Submissions</h1>
    );
}
