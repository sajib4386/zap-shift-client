import React from 'react'
import useAuth from '../../../Hooks/useAuth'
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const AssignDeliveries = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { data: parcels = [], refetch } = useQuery({
        queryKey: ['parcels', user.email, 'driver_assigned'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/rider?riderEmail=${user.email}&deliveryStatus=driver_assigned`)
            return res.data;
        }
    })

    const handleDeliveryStatusUpdate = (parcel, status) => {
        const statusInfo = {
            deliveryStatus: status,
            riderId: parcel.riderId,
            trackingId:parcel.trackingId
        }
        let message = `Parcel status update with ${status.split('_').join(' ')}`
        axiosSecure.patch(`/parcels/${parcel._id}/status`, statusInfo)
            .then(res => {
                if (res.data.modifiedCount) {
                    refetch()
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: message,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
    }
    return (
        <div>
            <h3 className='text-3xl font-bold text-center m-5'>Parcels Pending Pickup: {parcels.length}</h3>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Confirm</th>
                            <th>Other Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            parcels.map((parcel, index) => <tr key={parcel._id}>
                                <th>{index + 1}</th>
                                <td>{parcel.parcelName}</td>
                                <td className='space-x-2'>
                                    {
                                        parcel.deliveryStatus === 'driver_assigned' ? <> <button
                                            onClick={() => handleDeliveryStatusUpdate(parcel, 'rider_arriving')}
                                            className="btn btn-primary text-black">
                                            Accept
                                        </button>
                                            <button className="btn btn-secondary">
                                                Reject
                                            </button></> : <span className="btn btn-accent text-black">Accepted</span>
                                    }
                                </td>
                                <td className='space-x-2'>
                                    <button
                                        onClick={() => handleDeliveryStatusUpdate(parcel, 'parcel_picked_up')}
                                        className="btn btn-primary text-black">
                                        Mark as picked up
                                    </button>

                                    <button
                                        onClick={() => handleDeliveryStatusUpdate(parcel, 'parcel_delivered')}
                                        className="btn btn-primary text-black">
                                        Mark as delivered
                                    </button>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AssignDeliveries