import { Navigate, Outlet } from "react-router-dom";
import { db, useAuth } from "../hooks";
import Loader from "./Loader";

export const PublicRoute = () => {
    const authUser = useAuth(db);

    if (authUser === undefined) return <Loader />;

    if (authUser) return <Navigate to="/" replace />;

    return <Outlet />;
}