import React, { useEffect, useState } from 'react';

const EditProfile = ({ userData, setIsEditModalOpen }) => {

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        organisation: '',
    });

    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || '',
                phone: userData.phone || '',
                email: userData.email || '',
                address: userData.address || '',
                organisation: userData.organisation || '',
            });
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Call onSubmit with formData
        // onSubmit(formData);
    };

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
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Phone:</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Address:</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Organisation:</label>
                                <input
                                    type="text"
                                    name="organisation"
                                    value={formData.organisation}
                                    onChange={handleChange}
                                />
                            </div>
                            <button type="submit">Save Changes</button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
