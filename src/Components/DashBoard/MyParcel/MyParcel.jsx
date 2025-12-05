import React from 'react'
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { MdPageview } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import Swal from 'sweetalert2';

const MyParcel = () => {

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();


  const { data: parcels = [], refetch } = useQuery({
    queryKey: ['myParcels', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user?.email}`);
      return res.data;
    }
  })

  const handleParcelDelete = (id) => {
    console.log(id)
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/parcels/${id}`)
          .then(res => {
            console.log(res.data);

            if (res.data.deletedCount)
              refetch();
            Swal.fire({
              title: "Deleted!",
              text: "Your parcel has been deleted.",
              icon: "success"
            });
          })

      }
    });
  }

  return (
    <div>
      <h3 className='text-3xl font-bold text-center m-5'>MyParcel {parcels.length}</h3>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Cost</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              parcels.map((parcel, index) => <tr key={parcel._id}>
                <th>{index + 1}</th>
                <td>{parcel.parcelName}</td>
                <td>{parcel.cost}</td>
                <td>Blue</td>
                <td className='space-x-2'>
                  <button className="btn btn-square">
                    <MdPageview />
                  </button>
                  <button className="btn btn-square">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleParcelDelete(parcel._id)} className="btn btn-square">
                    <RiDeleteBin5Fill />
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

export default MyParcel