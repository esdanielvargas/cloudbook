import { useRoutes } from "react-router-dom";
import { publicRoutes } from "./publicRoutes";
import { ProtectedRoute, PublicRoute } from "../components";
import { privateRoutes } from "./privateRoutes";

export default function AppRoutes() {
    return useRoutes([
        {
            element: <PublicRoute />,
            children: publicRoutes,
        },
        {
            element: <ProtectedRoute />,
            children: privateRoutes,
        },
    ]);
}