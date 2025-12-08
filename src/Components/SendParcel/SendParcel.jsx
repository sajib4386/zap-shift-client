import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";


const SendParcel = () => {
  const {
    register,
    handleSubmit,
    control,
  } = useForm();

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const servicecenters = useLoaderData();
  const regionsDuplicate = servicecenters.map(c => c.region)
  const regions = [...new Set(regionsDuplicate)];

  const senderRegion = useWatch({ control, name: 'senderRegion' });
  const receiverRegion = useWatch({ control, name: 'receiverRegion' });

  const districtsByRegion = region => {
    const regionDistrict = servicecenters.filter(c => c.region === region);
    const districts = regionDistrict.map(d => d.district);
    return districts;
  }

  const handleSendParcel = data => {
    console.log("Form Data:", data);

    // 🛒 Pricing Structure
    // Parcel Type    =	Weight    = Within City	 = Outside City/District
    // Document       =	Any	      = ৳60	         = ৳80
    // Non-Document   =	Up to 3kg	= ৳110         = ৳150
    // Non-Document   =	>3kg	    = +৳40/kg      = +৳40/kg +৳40 extra


    const isDocument = data.parcelType === 'Document';
    const isSameDistrict = data.senderDistrict === data.receiverDistrict;
    const parcelWeight = parseFloat(data.parcelWeight)

    let cost = 0;

    if (isDocument) {
      cost = isSameDistrict ? 60 : 80;
    }
    else {
      if (parcelWeight < 3) {
        cost = isSameDistrict ? 110 : 150;
      }
      else {
        const minCharge = isSameDistrict ? 110 : 150;
        const extraWeight = parcelWeight - 3;
        const extraCharge = isSameDistrict ? extraWeight * 40 : extraWeight * 40 + 40;

        cost = minCharge + extraCharge;
      }
    }

    data.cost = cost;
    console.log("Final Cost:", cost);
    Swal.fire({
      title: "Agree With the Cost",
      text: `You will be charged ${cost} Taka!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm and Continue Payment"
    }).then((result) => {
      if (result.isConfirmed) {

        axiosSecure.post("/parcels", data)
          .then(res => {
            console.log('after saving parcel', res.data)
            if (res.data.insertedId) {
              navigate("/dashboard/my-parcels")
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Parcel has created. Please pay",
                showConfirmButton: false,
                timer: 1500
              });
            }
          })
      }
    });
  };


  return (
    <div className="max-w-[950px] mx-auto bg-white rounded-2xl shadow p-12 mt-10 mb-20">

      {/* Title */}
      <h1 className="text-[32px] font-bold mb-6">Send A Parcel</h1>

      {/* Sub Title */}
      <p className="text-[18px] font-semibold mb-4">Enter your parcel details</p>

      <div className="border-b mb-8"></div>

      <form onSubmit={handleSubmit(handleSendParcel)}>

        {/* PARCEL TYPE */}
        <div className="flex items-center gap-8 mb-10">
          <label className="flex gap-2 text-[15px] items-center">
            <input
              type="radio"
              value="Document"
              {...register("parcelType")}
              defaultChecked
              className="radio"
            />
            Document
          </label>

          <label className="flex gap-2 text-[15px] items-center">
            <input
              type="radio"
              value="Not-Document"
              {...register("parcelType")}
              className="radio"
            />
            Not-Document
          </label>
        </div>

        {/* PARCEL DETAILS */}
        <div className="grid grid-cols-2 gap-8 mb-10">

          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm">Parcel Name</label>
            <input
              type="text"
              placeholder="Enter Parcel Name"
              {...register("parcelName")}
              className="input input-bordered h-12 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm">Parcel Weight (KG)</label>
            <input
              type="number"
              placeholder="Enter Parcel Weight"
              {...register("parcelWeight")}
              className="input input-bordered h-12 text-sm"
            />
          </div>

        </div>

        <div className="border-b mb-10"></div>

        {/* SENDER + RECEIVER  */}
        <div className="grid grid-cols-2 gap-12">

          {/* Sender */}
          <div>
            <h2 className="font-semibold mb-4 text-[15px]">Sender Details</h2>

            <div className="flex flex-col gap-4">

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Sender Name</label>
                <input
                  type="text"
                  placeholder="Enter Sender Name"
                  {...register("senderName")}
                  defaultValue={user?.displayName}
                  className="input input-bordered h-12 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Sender Email</label>
                <input
                  type="text"
                  placeholder="Enter Sender Email"
                  {...register("senderEmail")}
                  defaultValue={user?.email}
                  className="input input-bordered h-12 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Address</label>
                <input
                  type="text"
                  placeholder="Enter Address"
                  {...register("senderAddress")}
                  className="input input-bordered h-12 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Sender Phone No</label>
                <input
                  type="text"
                  placeholder="Enter Phone Number"
                  {...register("senderPhone")}
                  className="input input-bordered h-12 text-sm"
                />
              </div>

              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Sender Regions</legend>
                  <select {...register("senderRegion")}
                    defaultValue="Pick a Region" className="select">
                    <option disabled={true}>Pick a Region</option>
                    {
                      regions.map((r, i) => <option key={i} value={r}>{r}</option>)
                    }
                  </select>
                </fieldset>
              </div>

              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Sender Districts</legend>
                  <select {...register("senderDistrict")}
                    defaultValue="Pick a District" className="select">
                    <option disabled={true}>Pick a District</option>
                    {
                      districtsByRegion(senderRegion).map((d, i) => <option key={i} value={d}>{d}</option>)
                    }
                  </select>
                </fieldset>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Pickup Instruction</label>
                <textarea
                  {...register("pickupInstruction")}
                  placeholder="Enter Pickup Instruction"
                  className="textarea textarea-bordered h-24 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Receiver */}
          <div>
            <h2 className="font-semibold mb-4 text-[15px]">Receiver Details</h2>

            <div className="flex flex-col gap-4">

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Receiver Name</label>
                <input
                  type="text"
                  placeholder="Enter Receiver Name"
                  {...register("receiverName")}
                  className="input input-bordered h-12 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Receiver Email</label>
                <input
                  type="text"
                  placeholder="Enter Receiver Email"
                  {...register("receiverEmail")}
                  className="input input-bordered h-12 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Receiver Address</label>
                <input
                  type="text"
                  placeholder="Enter Receiver Address"
                  {...register("receiverAddress")}
                  className="input input-bordered h-12 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Receiver Phone No</label>
                <input
                  type="text"
                  placeholder="Enter Receiver Phone"
                  {...register("receiverPhone")}
                  className="input input-bordered h-12 text-sm"
                />
              </div>

              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Receiver Regions</legend>
                  <select {...register("receiverRegion")}
                    defaultValue="Pick a Region" className="select">
                    <option disabled={true}>Pick a Region</option>
                    {
                      regions.map((r, i) => <option key={i} value={r}>{r}</option>)
                    }
                  </select>
                </fieldset>
              </div>

              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Receiver Districts</legend>
                  <select {...register("receiverDistrict")}
                    defaultValue="Pick a District" className="select">
                    <option disabled={true}>Pick a District</option>
                    {
                      districtsByRegion(receiverRegion).map((d, i) => <option key={i} value={d}>{d}</option>)
                    }
                  </select>
                </fieldset>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Delivery Instruction</label>
                <textarea
                  {...register("deliveryInstruction")}
                  placeholder="Enter Delivery Instruction"
                  className="textarea textarea-bordered h-24 text-sm"
                />
              </div>

            </div>
          </div>
        </div>
        <p className="text-sm mt-8 mb-5">* Pickup Time 4pm–7pm Approx.</p>
        <button
          type="submit"
          className="btn bg-green-600 text-white px-10 py-2 normal-case"
        >
          Proceed to Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default SendParcel;
