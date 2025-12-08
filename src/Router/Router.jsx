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
import PaymentSuccess from "../Components/DashBoard/Payment/PaymentSuccess";
import PaymentCancelled from "../Components/DashBoard/Payment/PaymentCancelled";
import PaymentHistory from "../Components/DashBoard/Payment/PaymentHistory";
import ApproveRiders from "../Components/DashBoard/ApproveRiders/ApproveRiders";
import UsersManagement from "../Components/DashBoard/UsersManagement/UsersManagement";
import AdminRoute from "./AdminRoute";
import AssignRiders from "../Components/DashBoard/AssignRiders/AssignRiders";
import AssignDeliveries from "../Components/DashBoard/AssignDeliveries/AssignDeliveries";
import RiderRoute from "./RiderRoute";
import CompletedDeliveries from "../Components/DashBoard/CompletedDeliveries/CompletedDeliveries";
import ParcelTrack from "../Components/ParcelTrack/ParcelTrack";

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
            },
            {
                path: "/parcel-track/:trackingId",
                Component: ParcelTrack
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

            // Rider Only
            {
                path: "/dashboard/assign-deliveries",
                element: <RiderRoute><AssignDeliveries></AssignDeliveries></RiderRoute>
            },
            {
                path: "/dashboard/completed-deliveries",
                element: <RiderRoute><CompletedDeliveries></CompletedDeliveries></RiderRoute>
            },


            // Admin Only
            {
                path: "/dashboard/approve-riders",
                element: <AdminRoute><ApproveRiders></ApproveRiders></AdminRoute>
            },
            {
                path: "/dashboard/assign-riders",
                element: <AdminRoute><AssignRiders></AssignRiders></AdminRoute>
            },
            {
                path: "/dashboard/users-management",
                element: <AdminRoute><UsersManagement></UsersManagement></AdminRoute>
            }
        ]
    }
]);