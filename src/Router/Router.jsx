import { createBrowserRouter } from "react-router";
import RootLayOut from "../RootLayOut/RootLayOut";
import Home from "../Pages/Home/Home/Home";
import Coverage from "../Components/Coverage/Coverage";
import AuthLayout from "../Components/AuthLayout/AuthLayout";
import Login from "../Components/Auth/Login";
import Register from "../Components/Auth/Register";
import PrivateRoute from "./PrivateRoute";
import Rider from "../Components/Rider/Rider";
import SendPercel from "../Components/SendPercel/SendPercel";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayOut,
        children: [
            {
                index: true,
                Component: Home

            },
            {
                path: "/rider",
                element: <PrivateRoute><Rider></Rider></PrivateRoute>
            },
            {
                path: "/send-percel",
                element: <PrivateRoute><SendPercel></SendPercel></PrivateRoute>,
                loader: () => fetch('/servicecenters.json')
            },
            {
                path: "/coverage",
                Component: Coverage,
                loader: () => fetch('/servicecenters.json')
            }
        ]
    },
    {
        path: "/",
        Component: AuthLayout,
        children: [
            {
                path: "/login",
                Component: Login
            },
            {
                path: "/register",
                Component: Register
            }
        ]
    }
]);