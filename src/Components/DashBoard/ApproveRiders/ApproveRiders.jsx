import React from 'react'
import useAxiosSecure from '../../../Hooks/useAxiosSecure'
import { useQuery } from '@tanstack/react-query';
import { FaUserCheck } from 'react-icons/fa';
import { MdPersonRemove } from 'react-icons/md';
import { FaTrashCan } from 'react-icons/fa6';
import Swal from 'sweetalert2';

const ApproveRiders = () => {
    const axiosSecure = useAxiosSecure();
    const { data: riders = [], refetch } = useQuery({
        queryKey: ['riders', 'pending'],
        queryFn: async () => {
            const res = await axiosSecure.get('/riders');
            return res.data;
        }
    })

    const updateRiderStatus = (rider, status) => {
        const updateInfo = { status: status, email: rider.email }
        axiosSecure.patch(`/riders/${rider._id}`, updateInfo)
            .then(res => {
                if (res.data.modifiedCount) {
                    refetch()
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `Rider status is set to ${status}.`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
    }

    const handleApproval = rider => {
        updateRiderStatus(rider, 'approved');
    }

    const handleRejection = rider => {
        updateRiderStatus(rider, 'rejected')
    }

    return (
        <div>
            <h3 className='text-3xl font-bold text-center m-5'>Riders Pending Approval: {riders.length}</h3>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>District</th>
                            <th>Application Status</th>
                            <th>Work Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            riders.map((rider, index) => (
                                <tr key={rider._id}>
                                    <th>{index + 1}</th>
                                    <td>{rider.name}</td>
                                    <td>{rider.email}</td>
                                    <td>{rider.district}</td>
                                    <td>

                                        {rider.status === "approved" && (
                                            <span className='btn btn-sm btn-secondary text-primary'>approved</span>
                                        )}

                                        {rider.status === "pending" && (
                                            <span className='btn btn-sm btn-primary text-black'>
                                                pending
                                            </span>
                                        )}

                                        {rider.status === "rejected" && (
                                            <span className='btn btn-sm btn-accent text-black'>
                                                rejected
                                            </span>
                                        )}
                                    </td>
                                    <td>{rider.workStatus}</td>
                                    <td className='space-x-2'>
                                        <button
                                            onClick={() => handleApproval(rider)}
                                            className="btn btn-square">
                                            <FaUserCheck />
                                        </button>
                                        <button
                                            onClick={() => handleRejection(rider)}
                                            className="btn btn-square">
                                            <MdPersonRemove />
                                        </button>
                                        <button className="btn btn-square">
                                            <FaTrashCan />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ApproveRiders