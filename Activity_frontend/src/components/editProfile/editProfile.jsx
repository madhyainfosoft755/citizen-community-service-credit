import React from 'react';

const EditProfile = ({ user, setIsEditModalOpen }) => {
    return (
        <div className="popup-container overflow-auto absolute top-0 left-0 z-50 w-screen h-screen pt-6 pb-6 bg-white-A700/50 flex justify-start items-start sm:gap-3">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-3xl mx-auto mt-4" style={{ background: "#ffffff" }}>
                <button
                    onClick={() => {
                        setIsEditModalOpen(false);
                    }}
                    className="mb-4 p-2 bg-red-500 text-white rounded-md"
                >
                    Close
                </button>
                <div className="flex flex-col md:flex-row md:items-start md:justify-start space-y-4 md:space-y-0 md:space-x-6">
                    <h1 className="text-2xl font-semibold mb-4">Edit Profile</h1>

                    <div className="flex flex-col items-start w-full space-y-4">
                        {/* Name Input */}
                        <div className="flex flex-col md:flex-row items-center w-full space-y-2 md:space-y-0 md:space-x-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
                                Update Name
                            </button>
                        </div>

                        {/* Profile Picture Input */}
                        <div className="flex flex-col md:flex-row items-center w-full space-y-2 md:space-y-0 md:space-x-4">
                            <input
                                type="file"
                                accept="image/jpeg, image/png"
                                name="profile_pic"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
                                Update Profile Picture
                            </button>
                        </div>

                        {/* Telephone Input */}
                        <div className="flex flex-col md:flex-row items-center w-full space-y-2 md:space-y-0 md:space-x-4">
                            <input
                                type="text"
                                name="telephone"
                                placeholder="Enter your telephone number"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
                                Update Telephone
                            </button>
                        </div>

                        {/* Email Input */}
                        <div className="flex flex-col md:flex-row items-center w-full space-y-2 md:space-y-0 md:space-x-4">
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
                                Update Email
                            </button>
                        </div>

                        {/* Additional Input */}
                        <div className="flex flex-col md:flex-row items-center w-full space-y-2 md:space-y-0 md:space-x-4">
                            <input
                                type="text"
                                name="additionalField"
                                placeholder="Additional Information"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
                                Update Additional Info
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
