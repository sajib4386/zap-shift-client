import React from 'react'
import useAuth from '../Hooks/useAuth'
import useRole from '../Hooks/useRole';

const AdminRoute = ({ children }) => {
    const { loading } = useAuth();
    const { role, roleLoading } = useRole()


    if (loading || roleLoading) {
        return <span className="loading loading-infinity loading-xl"></span>
    }

    if (role !== 'Admin') {
        return <div>Forbidden.....</div>
    }
    return children
}

export default AdminRoute