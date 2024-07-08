import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser, faPhone, faLocation, faIdCard } from "@fortawesome/free-solid-svg-icons";
import "./style.css";
import { API_URL } from "Constant";
import { toast } from "react-toastify";
import { CirclesWithBar } from 'react-loader-spinner';
import { useAuth } from "components/AuthProvider/AuthProvider";

const ProfilePage = () => {
    const { setAuthenticated, setIsAdmin } = useAuth();
    const navigate = useNavigate();
    const notify = (e) => toast(e);
    const location = useLocation();
    const { user } = location.state || {};

    console.log("kya hai user", user)
    const [categories, setCategories] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [buttonStates, setButtonStates] = useState(Array(6).fill(false));
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedOrganization, setSelectedOrganization] = useState("");
    const [mobileError, setMobileError] = useState("");
    const [aadharError, setAadharError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        aadhar: "",
        password: "",
        confirmPassword: "",
    });
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_URL}/activity/getCategories`);
                const data = await response.json();
                if (response.ok) {
                    const sortedCategories = data.sort((a, b) => a.name.localeCompare(b.name));
                    const limitedCategories = sortedCategories.slice(0, 6);
                    setCategories(limitedCategories);
                    setButtonStates(Array(limitedCategories.length).fill(false));
                } else {
                    console.error("Error fetching categories:", data.message);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const fetchOrganizations = async () => {
            try {
                const response = await fetch(`${API_URL}/activity/getOrganizations`);
                const data = await response.json();
                if (response.ok) {
                    setOrganizations(Array.isArray(data) ? data : []);
                } else {
                    console.error("Error fetching organizations:", data.message);
                }
            } catch (error) {
                console.error("Error fetching organizations:", error);
            }
        };

        fetchCategories();
        fetchOrganizations();
    }, []);

    const validateMobileNumber = (mobile) => {
        const regex = /^\d{10}$/;
        return regex.test(mobile);
    };

    const validateAadharNumber = (aadhar) => {
        const regex = /^\d{12}$/;
        return regex.test(aadhar);
    };

    const handleButtonClick = (index, value) => {
        setButtonStates((prevButtonStates) => {
            const newButtonStates = [...prevButtonStates];
            newButtonStates[index] = !newButtonStates[index];
            return newButtonStates;
        });

        setSelectedCategories((prevCategories) => {
            const updatedCategories = [...prevCategories];
            const valueIndex = updatedCategories.indexOf(value);
            if (valueIndex !== -1) {
                updatedCategories.splice(valueIndex, 1);
            } else {
                updatedCategories.push(value);
            }
            return updatedCategories;
        });

        // Clear the error if a category is selected
        if (selectedCategories.length > 0) {
            setFormErrors((prevErrors) => {
                const { categories, ...rest } = prevErrors;
                return rest;
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));

        if (name === "phone" && validateMobileNumber(value)) {
            setFormErrors((prevErrors) => {
                const { phone, ...rest } = prevErrors;
                return rest;
            });
        }


    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = {};

        if (!validateMobileNumber(formData.phone)) {
            errors.phone = "Invalid mobile number format";
        }


        if (!selectedCategories || selectedCategories.length === 0) {
            errors.categories = "Please select at least one category";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const formDataToSubmit = new FormData();
        formDataToSubmit.append("name", user.name);
        formDataToSubmit.append("email", user.email);
        formDataToSubmit.append("phone", formData.phone);
        formDataToSubmit.append("address", formData.address);
        formDataToSubmit.append("aadhar", formData.aadhar || null);
        formDataToSubmit.append("selectedCategories", JSON.stringify(selectedCategories));
        formDataToSubmit.append("organization", selectedOrganization);
        formDataToSubmit.append("photo", user.picture);

        try {
            setIsLoading(true);

            const response = await fetch(`${API_URL}/activity/RegisterLinkedin`, {
                method: "POST",
                body: formDataToSubmit,
            });

            const data = await response.json();
            console.log("kya data mila : ", data)

            const { token, userKey } = data.data;

            console.log("user key :", userKey)
            console.log("token:", token)

            if (response.ok) {
                notify(data.message);

                if (token && userKey) {
                    localStorage.setItem("token", token);
                    localStorage.setItem("userKey", JSON.stringify(userKey));
                    // setLoginSuccess(true);
                    setAuthenticated(true);
                    notify("Login Successful")
                    navigate("/create");
                } else {
                    console.log("Response is missing");
                    notify(data.message);
                }
                // navigate("/create", { state: { data } });
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    address: "",
                    aadhar: "",
                    password: "",
                    confirmPassword: "",
                });
                setButtonStates(Array(categories.length).fill(false));
                setSelectedCategories([]);
                setSelectedFile(null);
                setFormErrors({});
            } else {
                notify(response.message);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFocus = (e) => {
        e.target.parentElement.classList.add('focus-within');
    };

    const handleBlur = (e) => {
        e.target.parentElement.classList.remove('focus-within');
    };

    return (
        <div className="w-screen h-screen sm:w-screen sm:h-screen md:w-screen md:h-screen lg:w-screen lg:h-screen flex items-center justify-center pt-5 pb-5 sm:p-0 ">
            <form onSubmit={handleSubmit} className="bg-white-A700_33 gap-4 p-2 sm:pt-4 sm:pb-4 scroller relative w-4/12 h-full sm:w-full sm:h-full md:w-3/4 md:h-full lg:w-3/4 lg:h-full flex flex-col items-center justify-start md:justify-between md:pt-10 md:pb-10 sm:justify-between border-[1px] rounded-lg sm:rounded-none overflow-auto scroller">
                <img src="/apps/images/2.png" className="w-14 h-14 absolute top-0 right-0 rounded-full" alt="" />
                {isLoading && (
                    <div className="w-full h-full bg-black-900/30 absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                        <CirclesWithBar
                            height="100"
                            width="100"
                            color="#546ef6"
                            outerCircleColor="#546ef6"
                            innerCircleColor="#ffffff"
                            barColor="#ffffff"
                            ariaLabel="circles-with-bar-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                        />
                    </div>
                )}
                <img
                    src={user.picture}
                    alt="Profile"
                    className="rounded-full"
                />
                <div className="relative -mt-2 sm:w-5/6 w-4/6 h-10 bg-gray-50 flex items-center justify-center  p-2 rounded-xl border-[1px] border-white-A700 green-border">
                    <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                    <input name="name" className="w-full h-full bg-inherit border-none  " type="text" value={user.name} disabled />
                    <h1 className="text-red-500 absolute -left-3 -top-1 text-xl">*</h1>
                </div>
                <div className="relative sm:w-5/6 w-4/6 h-10 bg-gray-50 flex items-center justify-center  p-2 rounded-xl border-[1px] border-white-A700 green-border">
                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-500" />
                    <input name="email" className="w-full h-full bg-inherit border-none " type="email" value={user.email} disabled />
                    <h1 className="text-red-500 absolute -left-3 -top-1 text-xl">*</h1>
                </div>
                <div className={`relative sm:w-5/6 w-4/6 h-10 bg-gray-50 flex items-center justify-center  p-2 rounded-xl border-[1px] ${formErrors.aadhar ? 'border-red-500' : 'border-white-A700'}  green-border`}>
                    <FontAwesomeIcon icon={faPhone} className="text-gray-500" />
                    <h1 className="text-red-500 absolute -left-3 -top-1 text-xl">*</h1>
                    <input
                        name="phone"
                        className="w-full h-full bg-inherit border-none no-spinner"
                        type="number"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                    />
                    {formErrors.phone && <small className="error absolute left-0 -bottom-4 text-red-500">{formErrors.phone}</small>}
                </div>
                <div className="relative sm:w-5/6 w-4/6 h-10 bg-gray-50 flex items-center justify-center  p-2 rounded-xl border-[1px] border-white-A700 green-border">
                    <FontAwesomeIcon icon={faLocation} className="text-gray-500" />
                    <input
                        name="address"
                        className="w-full h-full bg-inherit border-none no-spinner"
                        type="text"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleInputChange}
                    />
                    {/* <h1 className="text-red-500 absolute -left-3 -top-1 text-xl">*</h1> */}

                </div>
                <div className={`relative sm:w-5/6 w-4/6 h-10 bg-gray-50 flex items-center justify-center  p-2 rounded-xl border-[1px] ${formErrors.aadhar ? 'border-red-500' : 'border-white-A700'}  green-border`}>
                    <div className="w-full h-full flex items-center justify-center">

                        <FontAwesomeIcon icon={faIdCard} className="text-gray-500" />
                        <input
                            name="aadhar"
                            className="w-full h-full bg-inherit border-none no-spinner"
                            type="text"
                            placeholder="Aadhar Number"
                            value={formData.aadhar}
                        // onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-group sm:w-5/6 w-4/6 h-10  bg-gray-50 green-border flex items-center justify-center  p-2 rounded-xl overflow-hidden">
                    <select
                        className="w-full  text-sm  pl-10 border-none bg-inherit"
                        id="organization"
                        value={selectedOrganization}
                        onChange={(e) => setSelectedOrganization(e.target.value)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    >
                        <option className="w-full" value="" disabled>Select Organization</option>
                        {organizations.map((organization) => (
                            <option className="w-full" key={organization._id} value={organization._id}>
                                {organization.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-4/6  sm:w-5/6 h-auto flex flex-col items-center justify-center  relative ">
                    <label className="block font-bold mb-1"><span className="text-red-500">*</span>Select Categories:</label>
                    <div className="grid grid-cols-3 gap-1 w-full">
                        {categories.map((category, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`p-1 rounded text-xs text-center ${buttonStates[index] ? "bg-[#546ef6] text-white" : "bg-gray-50 text-black"
                                    }`}
                                onClick={() => handleButtonClick(index, category.name)}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                    {formErrors.categories && <small className="error text-red-500">{formErrors.categories}</small>}
                </div>

                <button className="bg-[#546ef6] text-white-A700 text-lg  p-2 sm:w-5/6 w-4/6 h-10 rounded-md">
                    Create Account
                </button>
            </form>
        </div>
    );
};

export default ProfilePage;
