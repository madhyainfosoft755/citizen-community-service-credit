import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser, faPhone, faLocation, faIdCard } from "@fortawesome/free-solid-svg-icons";
import "./style.css"
import { API_URL } from "Constant";
import { toast } from "react-toastify";
const ProfilePage = () => {
    const navigate = useNavigate();
    const notify = (e) => toast(e);
    const location = useLocation();
    const { user } = location.state || {};
    const [categories, setCategories] = useState([]);
    const [organizations, setOrganizations] = useState([]); // State for organizations
    const [buttonStates, setButtonStates] = useState(Array(6).fill(false)); // Assuming 6 buttons, adjust the size as needed
    const [selectedCategories, setSelectedCategories] = useState([]); // this function for get selected are
    const [selectedOrganization, setSelectedOrganization] = useState(""); // State for selected organization
    const [passwordError, setPasswordError] = useState(false);
    const [mobileError, setMobileError] = useState(""); // State for mobile number error
    const [aadharError, setAadharError] = useState(""); // State for Aadhar number error
    const [formsData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        idCard: "",
        password: "",
        confirmPassword: "",
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [isMobileVerified, setIsMobileVerified] = useState(false);
    const [fieldBeingEdited, setFieldBeingEdited] = useState("");
    const [error, setError] = useState(""); // State for error message
    const [isloading, setIsloading] = useState(false)


    const validateMobileNumber = (mobile) => {
        // Implement your mobile number validation logic here
        // Example: check if mobile number is 10 digits long and contains only numbers
        const regex = /^\d{10}$/;
        return regex.test(mobile);
    };

    useEffect(() => {
        // Fetch categories from the database
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_URL}/activity/getCategories`);
                const data = await response.json();
                if (response.ok) {
                    if (data.length > 0) {

                        const sortedCategories = data.sort((a, b) => a.name.localeCompare(b.name));
                        const limitedCategories = sortedCategories.slice(0, 6);
                        setCategories(limitedCategories);
                        setButtonStates(Array(limitedCategories.length).fill(false)); // Adjust button states based on categories length
                    }
                    else {
                        // notify(data.message)
                    }
                } else {
                    console.error("Error fetching categories:", data.message);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        // Fetch organizations from the database
        const fetchOrganizations = async () => {
            try {
                const response = await fetch(`${API_URL}/activity/getOrganizations`);
                const data = await response.json();
                if (response.ok) {
                    setOrganizations(Array.isArray(data) ? data : []); // Ensure data is an array
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


    const handleButtonClick = (index, value) => {
        setButtonStates((prevButtonStates) => {
            const newButtonStates = [...prevButtonStates];
            newButtonStates[index] = !newButtonStates[index];
            return newButtonStates;
        });

        setSelectedCategories((prevCategories) => {
            //   if (prevCategories.includes(value)) {
            //     // If category is already selected, remove it
            //     return prevCategories.filter((category) => category !== value);
            //   } else {
            //     // If category is not selected, add it
            //     return [...prevCategories, value];
            //   }
            // });
            const updatedCategories = [...prevCategories];
            const valueIndex = updatedCategories.indexOf(value);
            if (valueIndex !== -1) {
                // If category is already selected, remove it
                updatedCategories.splice(valueIndex, 1);
            } else {
                // If category is not selected, add it
                updatedCategories.push(value);
            }
            return updatedCategories;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        // Check if passwords match
        if (formsData.password !== formsData.confirmPassword) {
            setPasswordError(true);
            notify("pasword do not match")
            return; // Exit function if passwords don't match
        }
        // Reset password error state if passwords match
        setPasswordError(false);

        // Validate mobile number format
        if (!validateMobileNumber(formsData.phone)) {
            setMobileError("Invalid mobile number format");
            notify(mobileError)
            return;
        }
        // Reset mobile number error state if valid
        setMobileError("");

        if (!selectedCategories || selectedCategories.length === 0) {
            notify("Please select at least one category to register.");
            return;
        }

        const formsDATA = new FormData();
        formsDATA.append("name", e.target[0].value);
        formsDATA.append("email", e.target[1].value);
        formsDATA.append("phone", e.target[2].value);
        formsDATA.append("address", e.target[3].value);
        formsDATA.append("aadhar", e.target[4].value);
        formsDATA.append("password", e.target[5].value);
        formsDATA.append("cpassword", e.target[6].value);
        formsDATA.append("selectedCategories", JSON.stringify(selectedCategories));
        formsDATA.append("photo", selectedFile);
        formsDATA.append("organization", selectedOrganization);



        try {
            setIsloading(true)

            const response = await fetch(`${API_URL}/activity/Register`, {
                method: "POST",
                body: formsDATA,
            });
            // console.log("kya response aa rha hai", response);

            const data = await response.json();
            // console.log("kya data aa rha hai", data);
            if (response.ok) {
                // console.log("Success:", data);
                navigate("/login" || "/createpost, { state: { user: formsData } }");

                // Reset form data after successful registration
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    address: "",
                    idCard: "",
                    password: "",
                    confirmPassword: "",
                });
                // Reset category button states
                setButtonStates(Array(categories.length).fill(false));
                // Clear selected categories
                setSelectedCategories([]);
                // Clear file input
                setSelectedFile(null);
                // Reset error states
                setPasswordError(false);
                setMobileError("");
                setAadharError("");
                setError("");

                notify("Registration Successful")
                // setIsloading(false)
            } else {
                // setError(data.message); // Update error message state
                console.error("Error:", data.error); // Display error message to the user
                notify(data.message)
            }
        } catch (error) {
            console.error("Error:", error);
        }
        finally {
            setIsloading(false)
        }
    };

    // console.log("what is the data", user)
    if (!user) {
        return <div>Loading...</div>; // or any loading indicator
    }


    const handleFocus = (e) => {
        e.target.parentElement.classList.add('focus-within');
      };
    
      const handleBlur = (e) => {
        e.target.parentElement.classList.remove('focus-within');
      };
    return (
        <div className="w-screen h-screen sm:w-screen sm:h-screen flex items-center justify-center pt-5 pb-5 sm:p-0 ">
            <form onSubmit={handleSubmit} className=" bg-red-50 gap-2 p-2 sm:pt-4 sm:pb-4 scroller relative w-4/12 h-full sm:w-full sm:h-full md:w-3/4 md:h-full lg:w-3/4 lg:h-full flex flex-col items-center justify-start sm:justify-between border-[1px] rounded-lg sm:rounded-none overflow-auto">

                    <img
                        src={user.picture}
                        alt="Profile"
                        className="rounded-full mx-auto mb-4"
                    />
                <div className="-mt-2 sm:w-5/6 w-4/6 h-10 bg-white-A700 flex items-center justify-center  p-2 rounded-xl border-[1px] border-white-A700 green-border">
                    <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                    <input name="name" className="w-full h-full bg-inherit border-none  " type="text" value={user.name} disabled />
                </div>
                <div className="sm:w-5/6 w-4/6 h-10 bg-white-A700 flex items-center justify-center  p-2 rounded-xl border-[1px] border-white-A700 green-border">
                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-500" />
                    <input name="email" className="w-full h-full bg-inherit border-none " type="email" value={user.email} disabled />
                </div>
                <div className="sm:w-5/6 w-4/6 h-10 bg-white-A700 flex items-center justify-center  p-2 rounded-xl border-[1px] border-white-A700 green-border">
                    <FontAwesomeIcon icon={faPhone} className="text-gray-500" />
                    <input name="phone" className="w-full h-full bg-inherit border-none no-spinner " type="number" placeholder="Phone Number" />
                </div>
                <div className="sm:w-5/6 w-4/6 h-10 bg-white-A700 flex items-center justify-center  p-2 rounded-xl border-[1px] border-white-A700 green-border">
                    <FontAwesomeIcon icon={faLocation} className="text-gray-500" />
                    <input name="phone" className="w-full h-full bg-inherit border-none no-spinner " type="text" placeholder="Address" />
                </div>
                <div className="sm:w-5/6 w-4/6 h-10 bg-white-A700 flex items-center justify-center  p-2 rounded-xl border-[1px] border-white-A700 green-border">
                    <FontAwesomeIcon icon={faIdCard} className="text-gray-500" />
                    <input name="phone" className="w-full h-full bg-inherit border-none no-spinner " type="text" placeholder="Aadhar Number" />
                </div>
                <div className="form-group sm:w-5/6 w-4/6 h-10  bg-white-A700 green-border flex items-center justify-center  p-2 rounded-xl overflow-hidden">
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
                    <label className="block font-bold mb-1">Select Categories:</label>
                    <div className="grid grid-cols-3 gap-1 w-full">
                        {categories.map((category, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`p-1 rounded text-xs text-center ${buttonStates[index] ? "bg-[#546ef6] text-white" : "bg-gray-200 text-black"
                                    }`}
                                onClick={() => handleButtonClick(index, category.name)}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                <button className="bg-[#546ef6] text-white-A700 text-lg  p-2 sm:w-5/6 w-4/6 h-10 rounded-md">
                    Create Account
                </button>
            </form>
        </div>
    )
}

export default ProfilePage