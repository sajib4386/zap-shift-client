import React, { useState } from 'react'
import useAuth from '../../../Hooks/useAuth'
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { FiShieldOff } from 'react-icons/fi';
import { FaUserShield } from 'react-icons/fa';
import Swal from 'sweetalert2';

const UsersManagement = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [searchText, setSearchText] = useState('')

    const { data: users = [], refetch } = useQuery({
        queryKey: ['users', searchText],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users?searchText=${searchText}`);
            return res.data;
        }
    })

    const handleMakeAdmin = user => {
        const roleInfo = { role: 'Admin' }
        axiosSecure.patch(`/users/${user._id}/role`, roleInfo)
            .then(res => {
                if (res.data.modifiedCount) {
                    refetch()
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `${user?.displayName} Marked as an Admin.`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
    }

    const handleRemoveAdmin = user => {
        const roleInfo = { role: 'User' }
        axiosSecure.patch(`/users/${user._id}/role`, roleInfo)
            .then(res => {
                if (res.data.modifiedCount) {
                    refetch()
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `${user?.displayName} Removed from Admin.`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
    }

    return (
        <div>
            <div className='flex flex-col justify-center items-center'>
                <h3 className='text-3xl font-bold text-center m-5'>Manage Users: {users.length}</h3>

                <label 
                onChange={(e)=>setSearchText(e.target.value)}
                 className="input">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                            fill="none"
                            stroke="currentColor"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input type="search" required placeholder="Search" />
                </label>
            </div>

            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>
                                SL NO
                            </th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Admin Actions</th>
                            <th>Others Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((user, index) => (
                                <tr key={user._id}>
                                    <th>
                                        {index + 1}
                                    </th>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle h-12 w-12">
                                                    <img
                                                        src={user?.photoURL}
                                                        alt="Avatar Tailwind CSS Component" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{user?.displayName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-ghost badge-sm">{user?.email}</span>
                                    </td>
                                    <td>
                                        <span className="badge badge-ghost badge-sm">{user?.role}</span>
                                    </td>
                                    <td>
                                        {
                                            user.role === 'Admin' ?
                                                <button
                                                    onClick={() => handleRemoveAdmin(user)}
                                                    className='btn btn-sm btn-secondary text-primary'><FiShieldOff></FiShieldOff></button> :
                                                <button
                                                    onClick={() => handleMakeAdmin(user)}
                                                    className='btn btn-sm btn-primary text-black'><FaUserShield></FaUserShield></button>
                                        }
                                    </td>
                                    <th>
                                        <button className="btn btn-ghost btn-xs">details</button>
                                    </th>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UsersManagement