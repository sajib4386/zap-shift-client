import React from 'react'
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { MdPageview } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import Swal from 'sweetalert2';
import { Link } from 'react-router';

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

  const handlePayment = async (parcel) => {
    const paymentInfo = {
      cost: parcel.cost,
      parcelId: parcel._id,
      senderEmail: parcel.senderEmail,
      parcelName: parcel.parcelName
    }
    const res = await axiosSecure.post('/create-checkout-session', paymentInfo)
    console.log(res.data)
    window.location.assign(res.data.url);
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
              <th>Delivery Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              parcels.map((parcel, index) => <tr key={parcel._id}>
                <th>{index + 1}</th>
                <td>{parcel.parcelName}</td>
                <td>{parcel.cost}</td>
                <td>
                  {
                    parcel.paymentStatus === 'paid' ?
                      <span className='btn btn-sm btn-secondary text-primary'>Paid</span> :

                      // OLD
                      // <Link to={`/dashboard/payment/${parcel._id}`}>
                      //   <button className='btn btn-sm btn-primary text-black'>
                      //     Pay
                      //   </button>
                      // </Link>

                      <button onClick={() => handlePayment(parcel)} className='btn btn-sm btn-primary text-black'>
                        Pay
                      </button>
                  }
                </td>
                <td>{parcel.deliveryStatus}</td>
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