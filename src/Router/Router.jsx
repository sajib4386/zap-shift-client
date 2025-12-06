import { createBrowserRouter } from "react-router";
import RootLayOut from "../RootLayOut/RootLayOut";
import Home from "../Pages/Home/Home/Home";
import Coverage from "../Components/Coverage/Coverage";
import AuthLayout from "../Components/AuthLayout/AuthLayout";
import Login from "../Components/Auth/Login";
import Register from "../Components/Auth/Register";
import PrivateRoute from "./PrivateRoute";
import Rider from "../Components/Rider/Rider";
import SendParcel from "../Components/SendParcel/SendParcel";
import DashboardLayout from "../Components/DashboardLayout/DashboardLayout";
import MyParcel from "../Components/DashBoard/MyParcel/MyParcel";
import Payment from "../Components/DashBoard/Payment/Payment";
import PaymentSuccess from "../Components/DashBoard/Payment/PaymentSuccess";
import PaymentCancelled from "../Components/DashBoard/Payment/PaymentCancelled";
import PaymentHistory from "../Components/DashBoard/Payment/PaymentHistory";
import ApproveRiders from "../Components/DashBoard/ApproveRiders/ApproveRiders";

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
                path: "/riders",
                element: <PrivateRoute><Rider></Rider></PrivateRoute>,
                loader: () => fetch('/servicecenters.json')
            },
            {
                path: "/send-parcel",
                element: <PrivateRoute><SendParcel></SendParcel></PrivateRoute>,
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
    },
    {
        path: "/dashboard",
        element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
        children: [
            {
                path: "/dashboard/my-parcels",
                Component: MyParcel
            },
            {
                path: "/dashboard/payment/:parcelId",
                Component: Payment
            },
            {
                path: "payment-success",
                Component: PaymentSuccess
            },
            {
                path: "payment-cancelled",
                Component: PaymentCancelled
            },
            {
                path: "/dashboard/payment-history",
                Component: PaymentHistory
            },
            {
                path: "/dashboard/approve-riders",
                Component: ApproveRiders
            }
        ]
    }
]);