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
];