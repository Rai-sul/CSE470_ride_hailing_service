import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import FinishRide from '../components/FinishRide'

const CaptainRides = () => {
    const [ rides, setRides ] = useState([])

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/stats`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                setRides(response.data.recentRides)
            } catch (err) {
                console.error(err)
            }
        }
        fetchRides()
    }, [])

    return (
        <div className='h-screen bg-gray-100'>
            <div className='fixed p-4 top-0 flex items-center justify-between w-full bg-white shadow-sm z-10'>
                <div className='flex items-center gap-3'>
                    <Link to='/captain-home' className='h-10 w-10 bg-gray-100 flex items-center justify-center rounded-full'>
                        <i className="text-lg font-medium ri-arrow-left-line"></i>
                    </Link>
                    <h2 className='text-xl font-semibold'>My Rides</h2>
                </div>
            </div>

            <div className='pt-20 p-4 pb-4'>
                <div className='flex flex-col gap-4'>
                    {rides && rides.map((ride) => (
                        <div key={ride._id} className='p-4 bg-white rounded-xl shadow-sm border border-gray-100'>
                            <div className='flex justify-between items-start mb-4'>
                                <div>
                                    <h3 className='text-lg font-semibold text-gray-800'>BDT {ride.fare}</h3>
                                    <p className='text-sm text-gray-500'>{ride.createdAt ? new Date(ride.createdAt).toLocaleString() : ''}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    ride.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {ride.status}
                                </div>
                            </div>

                            <div className='flex flex-col gap-3 relative pl-6 border-l-2 border-gray-200 ml-2'>
                                <div className='relative'>
                                    <div className='absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-gray-800 ring-4 ring-white'></div>
                                    <h4 className='text-sm font-medium text-gray-500 mb-1'>Pickup</h4>
                                    <p className='text-gray-800 text-sm leading-tight'>{ride.pickup}</p>
                                </div>
                                <div className='relative'>
                                    <div className='absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-black ring-4 ring-white'></div>
                                    <h4 className='text-sm font-medium text-gray-500 mb-1'>Dropoff</h4>
                                    <p className='text-gray-800 text-sm leading-tight'>{ride.destination}</p>
                                </div>
                            </div>

                            <div className='mt-4 pt-4 border-t border-gray-100 flex justify-between items-center'>
                                <div className='flex items-center gap-2 text-gray-600'>
                                    <i className="ri-road-map-line"></i>
                                    <span className='text-sm'>{ride.distance ? `${ride.distance.toFixed(1)} km` : 'N/A'}</span>
                                </div>
                                <div className='flex items-center gap-2 text-gray-600'>
                                    <i className="ri-time-line"></i>
                                    <span className='text-sm'>{ride.duration ? `${Math.round(ride.duration)} min` : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {(!rides || rides.length === 0) && (
                        <div className='flex flex-col items-center justify-center h-[60vh] text-gray-400'>
                            <i className="ri-file-list-3-line text-6xl mb-4"></i>
                            <p>No rides history yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CaptainRides