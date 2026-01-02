import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const RateDriver = (props) => {
    const [ rating, setRating ] = useState(0)
    const [ feedback, setFeedback ] = useState('')
    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/rate`, {
                rideId: props.ride._id,
                rating,
                feedback
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            navigate('/home')
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className='h-screen w-full fixed top-0 left-0 bg-white z-50 flex flex-col items-center justify-center p-4'>
            <div className='w-full max-w-md'>
                <h3 className='text-2xl font-semibold mb-6 text-center'>Rate your Driver</h3>
                
                <div className='flex items-center justify-center gap-4 mb-6'>
                    <img className='h-20 w-20 rounded-full object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="" />
                    <div>
                        <h2 className='text-xl font-medium capitalize'>{props.ride?.captain.fullname.firstname}</h2>
                        <p className='text-gray-600'>{props.ride?.captain.vehicle.plate}</p>
                    </div>
                </div>

                <div className='flex justify-center gap-4 mb-6'>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <i 
                            key={star}
                            onClick={() => setRating(star)}
                            className={`ri-star-fill text-3xl cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        ></i>
                    ))}
                </div>

                <form onSubmit={submitHandler}>
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className='w-full bg-gray-100 p-3 rounded-lg mb-4'
                        placeholder='Write your feedback (optional)'
                        rows="4"
                    ></textarea>

                    <button 
                        disabled={rating === 0}
                        className={`w-full p-3 rounded-lg font-semibold text-white ${rating === 0 ? 'bg-gray-400' : 'bg-green-600'}`}
                    >
                        Submit Rating
                    </button>
                </form>
            </div>
        </div>
    )
}

export default RateDriver