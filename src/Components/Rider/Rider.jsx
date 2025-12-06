import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";

const Rider = () => {
  const { register, handleSubmit, control } = useForm();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  // const navigate = useNavigate();

  const servicecenters = useLoaderData();

  // Unique Regions
  const regionsDuplicate = servicecenters.map(c => c.region);
  const regions = [...new Set(regionsDuplicate)];

  // Watching region to load districts dynamically
  const riderRegion = useWatch({ control, name: "region" });

  const districtsByRegion = region => {
    const regionDistrict = servicecenters.filter(c => c.region === region);
    return regionDistrict.map(d => d.district);
  };

  const handleRegisterRider = data => {
    console.log(data)
    Swal.fire({
      title: "Submit Rider Information?",
      text: "Make sure your information is correct!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Submit"
    }).then((result) => {
      if (result.isConfirmed) {

        axiosSecure.post("/riders", data)
          .then(res => {
            if (res.data.insertedId) {
              // navigate("");
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Rider registration successful!",
                showConfirmButton: false,
                timer: 1500
              });
            }
          });
      }
    });
  };

  return (
    <div className="max-w-[900px] mx-auto bg-white rounded-2xl shadow p-10 mt-10 mb-20">

      <h1 className="text-[32px] font-bold mb-4">Be a Rider</h1>
      <p className="text-gray-500 mb-6">
        Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle.
      </p>

      <div className="border-b mb-8"></div>

      <form onSubmit={handleSubmit(handleRegisterRider)}>

        <p className="font-semibold text-lg mb-6">Tell us about yourself</p>

        <div className="grid grid-cols-2 gap-8">

          {/* NAME */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm">Your Name</label>
            <input
              type="text"
              {...register("name")}
              defaultValue={user?.displayName}
              placeholder="Your Name"
              className="input input-bordered h-12 text-sm"
            />
          </div>

          {/* AGE */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm">Your Age</label>
            <input
              type="number"
              {...register("age")}
              placeholder="Your Age"
              className="input input-bordered h-12 text-sm"
            />
          </div>

          {/* EMAIL */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm">Your Email</label>
            <input
              type="email"
              {...register("email")}
              defaultValue={user?.email}
              placeholder="Your Email"
              className="input input-bordered h-12 text-sm"
            />
          </div>

          {/* DRIVING LICENCE */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm">Driving Licence Number</label>
            <input
              type="text"
              {...register("drivingLicence")}
              placeholder="Driving Licence Number"
              className="input input-bordered h-12 text-sm"
            />
          </div>

          {/* NID */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm">NID Number</label>
            <input
              type="text"
              {...register("nid")}
              placeholder="NID Number"
              className="input input-bordered h-12 text-sm"
            />
          </div>

          {/* PHONE */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm">Phone Number</label>
            <input
              type="text"
              {...register("phone")}
              placeholder="Phone Number"
              className="input input-bordered h-12 text-sm"
            />
          </div>

          {/* REGION */}
          <div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Your Region</legend>
              <select
                {...register("region")}
                defaultValue="Pick a Region"
                className="select w-full"
              >
                <option disabled>Pick a Region</option>
                {regions.map((r, i) => (
                  <option key={i} value={r}>{r}</option>
                ))}
              </select>
            </fieldset>
          </div>

          {/* DISTRICT */}
          <div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Your District</legend>
              <select
                {...register("district")}
                defaultValue="Pick a District"
                className="select w-full"
              >
                <option disabled>Pick a District</option>
                {districtsByRegion(riderRegion)?.map((d, i) => (
                  <option key={i} value={d}>{d}</option>
                ))}
              </select>
            </fieldset>
          </div>

          {/* BIKE BRAND / MODEL / YEAR */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm">Bike Brand Model and Year</label>
            <input
              type="text"
              {...register("bikeModel")}
              placeholder="Bike Brand Model and Year"
              className="input input-bordered h-12 text-sm"
            />
          </div>

          {/* BIKE REGISTRATION NUMBER */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm">Bike Registration Number</label>
            <input
              type="text"
              {...register("bikeRegistration")}
              placeholder="Bike Registration Number"
              className="input input-bordered h-12 text-sm"
            />
          </div>

          {/* ADDRESS */}
          <div className="col-span-2 flex flex-col gap-1">
            <label className="font-medium text-sm">Your Address</label>
            <input
              type="text"
              {...register("address")}
              placeholder="Your Address"
              className="input input-bordered h-12 text-sm"
            />
          </div>



        </div>

        <button
          type="submit"
          className="btn bg-green-600 text-white px-10 py-2 mt-8 normal-case"
        >
          Submit
        </button>

      </form>
    </div>
  );
};

export default Rider;
