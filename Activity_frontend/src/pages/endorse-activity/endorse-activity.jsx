import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { API_URL, APP_PATH } from 'Constant';

const ActivityDetails = () => {
    const { id } = useParams(); // Get the activity ID from the route
    const [activity, setActivity] = useState(null);
    const [rating, setRating] = useState(0);
    const [name, setName] = useState('');
    const [locationAddress, setLocationAddress] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        // Fetch activity details based on ID
        const fetchActivityDetails = async () => {
            try {
                const response = await fetch(`${API_URL}/admin/getActivityByIdOpen/${id}`);
                const data = await response.json();
                setActivity(data.activities[0]);

                // Fetch the address based on latitude and longitude
                if (data.activities[0].latitude && data.activities[0].longitude) {
                    fetchAddress(data.activities[0].latitude, data.activities[0].longitude);
                }
            } catch (error) {
                console.error('Error fetching activity details:', error);
            }
        };

        fetchActivityDetails();
    }, [id]);

    const fetchAddress = async (lat, lng) => {
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GoogleGeocode}`);
            const address = response.data.results[0]?.formatted_address;
            setLocationAddress(address || 'Address not found');
        } catch (error) {
            console.error('Error fetching address:', error);
            setLocationAddress('Address not found');
        }
    };

    const handleRating = (stars) => {
        setRating(stars);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || rating === 0) {
            setError('Please provide your name and a rating.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/activity/submitFeedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    activityId: id,
                    name,
                    rating,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }

            const result = await response.json();
            setSuccessMessage('Feedback submitted successfully!');
            setName('');
            setRating(0);
            setError(null);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setError('There was an error submitting your feedback. Please try again later.');
        }
    };

    if (!activity) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-5 flex items-center justify-center">
            <div className="w-auto mx-auto bg-white p-6 rounded-lg shadow-lg bg-white-A700   relative">
                <img src={APP_PATH + "images/2.png"} className=" w-14 h-14 rounded-full absolute top-0 right-0" alt="" />

                <h1 className="text-2xl font-semibold mb-4">Activity Details</h1>

                {/* Activity Details */}
                <div className="mb-4">
                    <div className="mb-2">
                        <strong>Category:</strong> <span>{activity.category}</span>
                    </div>
                    <div className="mb-2">
                        <strong>Time:</strong> <span>{activity.totalTime}</span>
                    </div>
                    <div className="mb-2">
                        <strong>Location:</strong> <span>{locationAddress}</span>
                    </div>
                    <div className="mb-2">
                        <strong>Date:</strong> <span>{activity.Date}</span>
                    </div>
                    <div className="mb-2">
                        <strong>Photo:</strong>
                        <img
                            src={`${API_URL}/image/` + activity.photos || 'https://via.placeholder.com/150'}
                            alt="Activity"
                            className="mt-2 rounded-lg"
                        />
                    </div>
                </div>

                {/* Feedback Section */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">Leave Your Feedback</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 font-semibold">
                                Name:
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Enter your name"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Rating:</label>
                            <div className="flex space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FontAwesomeIcon
                                        key={star}
                                        icon={faStar}
                                        className={`cursor-pointer ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                        onClick={() => handleRating(star)}
                                    />
                                ))}
                            </div>
                        </div>

                        {error && <div className="text-red-500 mb-4">{error}</div>}
                        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ActivityDetails;
