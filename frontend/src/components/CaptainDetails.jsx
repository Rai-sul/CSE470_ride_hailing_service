
import React, { useContext, useEffect, useState } from 'react'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'

const CaptainDetails = () => {

    const { captain } = useContext(CaptainDataContext)
    const [ stats, setStats ] = useState({
        earnings: 0,
        totalRides: 0,
        averageRating: 0,
        recentRides: []
    })

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/stats`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                setStats(response.data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchStats()
    }, [])

    return (
        <div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start gap-3'>
                    <img className='h-10 w-10 rounded-full object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="" />
                    <h4 className='text-lg font-medium capitalize'>{captain.fullname.firstname + " " + captain.fullname.lastname}</h4>
                </div>
                <div>
                    <h4 className='text-xl font-semibold'>BDT {stats.earnings}</h4>
                    <p className='text-sm text-gray-600'>Earned</p>
                </div>
            </div>
            <div className='flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start'>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
                    <h5 className='text-lg font-medium'>{stats.totalRides}</h5>
                    <p className='text-sm text-gray-600'>Total Rides</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-star-line"></i>
                    <h5 className='text-lg font-medium'>{stats.averageRating.toFixed(1)}</h5>
                    <p className='text-sm text-gray-600'>Rating</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
                    <h5 className='text-lg font-medium'>10.2</h5>
                    <p className='text-sm text-gray-600'>Hours Online</p>
                </div>
            </div>
        </div>
    )
}

export default CaptainDetails