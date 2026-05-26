import { type RouteConfig, index } from "@react-router/dev/routes";
import { route } from "@react-router/dev/routes";

export default [
    index("./login.tsx"),
    route("admin", "routes/admin/layout.tsx", [
        index("routes/admin/dashboard.tsx"),
        route("reports", "routes/admin/reports.tsx"),
        route("users", "routes/admin/users.tsx")
    ]),
] satisfies RouteConfig;
