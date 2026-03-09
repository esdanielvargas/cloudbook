import { Outlet } from "react-router-dom";
import { AuthLayout } from "../layouts";
import { AuthAction, Login, Register } from "../pages";

export const publicRoutes = [
    {
        element: <AuthLayout />,
        children: [
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
        ],
    },
    { path: "/auth/action", element: <AuthAction /> },
    {
        path: "/legal/", element: <Outlet />, children: [
            { path: "legal", element: "Hola" },
            { path: "", element: "" },
            { path: "", element: "" },
        ]
    },
];