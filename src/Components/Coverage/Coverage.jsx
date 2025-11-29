import React, { useRef } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useLoaderData } from 'react-router'

const Coverage = () => {
    const position = [23.6850, 90.3563];
    const serviceCenters = useLoaderData();
    const mapRef = useRef(null)

    const handleSearch = (e) => {
        e.preventDefault();
        const location = e.target.location.value;
        const district = serviceCenters.find(c => c.district.toLowerCase().includes(location.toLowerCase()));
        if (district) {
            const coord = [district.latitude, district.longitude]
            mapRef.current.flyTo(coord, 14)
        }
    }

    return (
        <div>
            <div className='space-y-5'>
                <h2 className='text-5xl font-bold'>We are available in 64 districts</h2>

                <form onSubmit={handleSearch}>
                    <label
                        className="input mb-10 rounded-2xl relative border border-base-300
             focus-within:outline-none focus-within:ring-0">

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

                        <input
                            name="location"
                            type="search"
                            className="grow focus:outline-none focus:ring-0"
                            placeholder="Search"
                        />

                        <button type='submit' className="btn bg-primary text-secondary rounded-2xl absolute -right-1">
                            Search
                        </button>
                    </label>
                </form>

            </div>
            <div className='w-full h-[800px]'>
                <MapContainer
                    ref={mapRef}
                    center={position}
                    zoom={8}
                    scrollWheelZoom={false}
                    className='h-[800px]'>

                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
                        serviceCenters.map((center, index) => <Marker
                            key={index}
                            position={[center.latitude, center.longitude]}>
                            <Popup>
                                <strong>{center.district}</strong> <br /> Service Center: {center.covered_area.join(", ")}
                            </Popup>
                        </Marker>)
                    }
                </MapContainer>
            </div>
        </div>
    )
}

export default Coverage