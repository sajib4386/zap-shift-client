import { createBrowserRouter } from "react-router";
import RootLayOut from "../RootLayOut/RootLayOut";
import Home from "../Pages/Home/Home/Home";
import Coverage from "../Components/Coverage/Coverage";
import AuthLayout from "../Components/AuthLayout/AuthLayout";
import Login from "../Components/Auth/Login";
import Register from "../Components/Auth/Register";

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
                path: "/coverage",
                Component: Coverage,
                loader: () => fetch ('/servicecenters.json')
            }
        ]
    },
    {
        path:"/",
        Component:AuthLayout,
        children:[
            {
                path:"/login",
                Component:Login
            },
            {
                path:"/register",
                Component:Register
            }
        ]
    }
]);