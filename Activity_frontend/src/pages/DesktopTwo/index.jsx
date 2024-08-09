import React, { useEffect, useState } from "react";
import {
  faUser,
  faEnvelope,
  faLocationCrosshairs,
  faIdCard,
  faKey,
  faLock,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import InputWithIconAndText from "components/inputwithicon/InputWithIconAndText";
import { Button } from "components";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { API_URL } from "Constant";
import { toast } from "react-toastify";
import { CirclesWithBar } from 'react-loader-spinner';
import imageCompression from 'browser-image-compression';

const Register = () => {
  const notify = (e) => toast(e);
  const navigate = useNavigate();
  const [isloading, setIsloading] = useState(false)

  // Use state to store form data
  const [formsData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    idCard: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(""); // State for error message
  const [passwordError, setPasswordError] = useState(false);
  const [mobileError, setMobileError] = useState(""); // State for mobile number error
  const [aadharError, setAadharError] = useState(""); // State for Aadhar number error
  const [emailError, setEmailError] = useState(""); // State for email error
  const [fileError, setFileError] = useState(false); // State for email error
  const [categories, setCategories] = useState([]);
  // console.log("ye hai selected categories", categories)
  const [selectedCategories, setSelectedCategories] = useState([]); // this function for get selected are
  const [organizations, setOrganizations] = useState([]); // State for organizations
  const [selectedOrganization, setSelectedOrganization] = useState(""); // State for selected organization
  const [buttonStates, setButtonStates] = useState(Array(6).fill(false)); // Assuming 6 buttons, adjust the size as needed
  const [selectedFile, setSelectedFile] = useState(null);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [fieldBeingEdited, setFieldBeingEdited] = useState("");



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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      // No file selected
      return;
    }

    // Get the file extension
    const fileExtension = file.name.split(".").pop().toLowerCase();

    // Allowed image extensions
    const allowedExtensions = ["jpg", "jpeg", "png", "gif", 'jfif'];

    // Check if the selected file is an image
    if (allowedExtensions.includes(fileExtension) && file.type.startsWith("image/")) {
      setFileError(false)
      setSelectedFile(file);
    } else {
      setFileError(true)
      // Handle error or notify the user that only image files are allowed
      notify("Please select an image file.");
    }
  };

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

  const handleInputChange = (e) => {
    // Check if e and e.target are defined
    // console.log("handle input change", e);
    if (e && e.target) {
      const { name, value } = e.target;
      setFieldBeingEdited(name);
      // Check if mobile number is verified when it reaches 10 digits
      if (name === "phone" && value.length === 10) {
        setIsMobileVerified(true);
        setMobileError("");
      } else {
        setIsMobileVerified(false);
        setMobileError(value.length > 0 ? "Invalid mobile number format" : "");
      }



      // Email validation
      if (name === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          setError("Invalid email format");
        } else {
          setError("");
        }
      }


      // Clear error for other input fields when they become empty
      if (value.length === 0) {
        switch (name) {
          case "name":
            setError("");
            break;
          case "email":
            setError("");
            break;
          case "phone":
            setMobileError("");
            break;
          case "address":
            // No error state for address field, add code here if needed
            break;
          case "password":
            setPasswordError(false);
            break;
          case "confirmPassword":
            setPasswordError(false);
            break;
          default:
            break;
        }
      }

      // Check if name is defined before updating state
      if (name !== undefined) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    // Check if passwords match
    if (formsData.password !== formsData.confirmPassword) {
      setPasswordError(true);
      // notify("pasword do not match")
      return; // Exit function if passwords don't match
    }
    // Reset password error state if passwords match
    setPasswordError(false);

    // Validate mobile number format
    if (!validateMobileNumber(formsData.phone)) {
      setMobileError("Invalid mobile number format");
      // notify(mobileError)
      return;
    }
    // Reset mobile number error state if valid
    setMobileError("");

    if (!selectedCategories || selectedCategories.length === 0) {
      notify("Please select at least one category to register.");
      return;
    }
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(selectedFile, options);


    const formsDATA = new FormData();
    formsDATA.append("name", e.target[0].value);
    formsDATA.append("email", e.target[1].value);
    formsDATA.append("phone", e.target[2].value);
    formsDATA.append("address", e.target[3].value);
    formsDATA.append("aadhar", e.target[4].value || null);
    formsDATA.append("password", e.target[5].value);
    formsDATA.append("cpassword", e.target[6].value);
    formsDATA.append("selectedCategories", JSON.stringify(selectedCategories));
    formsDATA.append("photo", compressedFile, selectedFile.name);
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
        if (!(data.message == 'Email already exists'))
          notify(data.message)
        else
          setEmailError(data.message)
      }
    } catch (error) {
      console.error("Error:", error);
    }
    finally {
      setIsloading(false)
    }
  };

  const validateMobileNumber = (mobile) => {
    // Implement your mobile number validation logic here
    // Example: check if mobile number is 10 digits long and contains only numbers
    const regex = /^\d{10}$/;
    return regex.test(mobile);
  };
  const direct = () => {
    navigate("/login");
  };
  return (
    <div className=" w-screen h-screen sm:w-screen sm:h-screen md:w-screen md:h-screen flex items-center justify-center pt-5 pb-5 sm:p-0">


      <div
        className="relative overflow-hidden bg-cover bg-center w-4/12 h-full sm:w-full sm:h-full md:w-2/4 md:h-full lg:w-3/4 lg:h-full flex flex-col items-center justify-center border-[1px] rounded-lg py-0 sm:border-none"

      >
        {isloading && (
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

        <div className="absolute -top-10 -right-20 w-64 h-64 bg-[#f5f6fe] rounded-full"></div>
        <div className="absolute -bottom-10 -left-20 w-64 h-64 bg-[#f5f6fe] rounded-full"></div>

        <div className="relative w-full h-full sm:w-full sm:h-full md:w-full md:h-full flex flex-col items-center justify-start gap-1 sm:-mt-0 ">
          <h3 className=" text-xl font-bold font-sans  sm:mt-4  text-black-900 ">
            Lets get started
          </h3>
          <h3 className="  text-center text-slate-600 font-medium">
            Create an account to access all features
          </h3>

          <form
            autocomplete="off"
            onSubmit={handleSubmit}
            className=" w-5/6 h-full sm:w-full sm:h-full md:w-full md:h-full flex flex-col items-center justify-between sm:justify-between gap-y-2.5 sm:gap-y-3 sm:mt-2 px-6  "
          >

            <div className="w-full h-7 flex flex-col items-center justify-center relative">
              <InputWithIconAndText
                icon={faUser} // Change the icon as needed
                iconColor={"#578be5"}
                placeholder="Name"
                className="text-sm w-full h-7 pl-10 border-solid border-[1px]  border-gray-300 bg-inherit rounded-md focus:border-emerald-300 ease-in duration-300 py-1"
                onChange={handleInputChange}
                name="name"
                required
              />
              <h1 className="text-red-500 absolute -left-2 -top-1">*</h1>
            </div>
            <div className="w-full h-7 flex flex-col items-center justify-center relative">
              <InputWithIconAndText
                icon={faEnvelope} // Change the icon as needed
                iconColor={"#645a9f"}
                placeholder="Email"
                className="text-sm w-full h-7 pl-10 border-solid border-[1px]  border-gray-300 bg-inherit rounded-md focus:border-emerald-300 ease-in duration-300 py-1"
                onChange={handleInputChange}
                name="email"
                type="email"
                required
              />
              <h1 className="text-red-500 absolute -left-2 -top-1">*</h1>
              {fieldBeingEdited === "email" && error && <div className="error-message">{error}</div>}
              {emailError && <div class="bg-red-50 px-4 text-xs text-red-500 rounded relative flex w-100 my-1" role="alert">

                <span class="block sm:inline py-2 text-xs">{emailError}</span>
                <span class="px-2 py-2" onClick={() => setMobileError(null)}>
                  <svg class="fill-current h-3.5 w-3.5 text-red-500 text-xs" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                </span>
              </div>}
            </div>
            <div className="w-full h-7 relative">
              <InputWithIconAndText
                icon={faPhone} // Change the icon as needed
                iconColor={"#419f44"}
                placeholder="Phone"
                className="text-sm w-full h-7 pl-10 border-solid border-[1px]  border-gray-300 bg-inherit rounded-md focus:border-emerald-300 ease-in duration-300 py-1"
                onChange={handleInputChange}
                name="phone"
                value={formsData.phone}
                type="number"
                required
              />
              <h1 className="text-red-500 absolute -left-2 -top-1">*</h1>

            </div>

            {fieldBeingEdited === "phone" && mobileError && <div class="bg-red-50 px-4 text-xs text-red-500 rounded relative flex my-2" role="alert">

              <span class="block sm:inline py-2 text-xs">{mobileError}</span>
              <span class="px-2 py-2" onClick={() => setMobileError(null)}>
                <svg class="fill-current h-3.5 w-3.5 text-red-500 text-xs" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
              </span>
            </div>}
            <div className="w-full h-7 flex flex-col items-center justify-center relative">
              <InputWithIconAndText
                icon={faLocationCrosshairs} // Change the icon as needed
                iconColor={"#d67500"}
                placeholder="Address"
                className="text-sm w-full h-7 pl-10 border-solid border-[1px]  border-gray-300 bg-inherit rounded-md focus:border-emerald-300 ease-in duration-300 py-1"
                onChange={handleInputChange}
                name="address"
                required
              />
              <h1 className="text-red-500 absolute -left-2 -top-1">*</h1>
            </div>
            {/* <div className="w-full h-7 flex flex-col items-center justify-center relative">
              <InputWithIconAndText
                icon={faIdCard} // Change the icon as needed
                iconColor={"#ffe93f"}
                placeholder="Aadhar Number"
                className="text-sm w-full h-7 pl-10 border-solid border-[1px]  border-gray-300 bg-inherit rounded-md focus:border-emerald-300 ease-in duration-300"
                onChange={handleInputChange}
                name="aadhar"
                type="number"
              />
            </div>
            {fieldBeingEdited === "aadhar" && aadharError && <div className="error-message">{aadharError}</div>} */}

            <div className="w-full h-7 flex flex-col items-center justify-center relative">
              <InputWithIconAndText
                icon={faKey} // Change the icon as needed
                iconColor={"#f4b8c0"}
                placeholder="Password"
                type="password"
                className="w-full h-7 text-sm  pl-10 border-solid border-[1px]  border-gray-300 bg-inherit rounded-md focus:border-emerald-300 ease-in duration-300 py-1"
                // inputClassName="password-input"
                onChange={handleInputChange}
                name="password"
                required
              />
              <h1 className="text-red-500 absolute -left-2 -top-1">*</h1>
            </div>
            <div className="w-full h-7 flex flex-col items-center justify-center relative">
              <InputWithIconAndText
                icon={faLock} // Change the icon as needed
                iconColor={"#f5191c"}
                placeholder="Confirm Password"
                type="password"
                className="w-full h-7 text-sm  pl-10 border-solid border-[1px]  border-gray-300 bg-inherit rounded-md focus:border-emerald-300 ease-in duration-300 py-1"
                // inputClassName="password-input"
                onChange={handleInputChange}
                name="confirmPassword"
                required
              />
              <h1 className="text-red-500 absolute -left-2 -top-1">*</h1>
              {/* {passwordError && (
                <div className="error-message">Passwords do not match</div>
              )} */}
              {passwordError && <div class="bg-red-50 px-4 text-xs text-red-500 rounded relative my-3 flex w-100" role="alert">

                <span class="block sm:inline py-2 text-xs">{'Password does not match'}</span>
                <span class="px-2 py-2" onClick={() => setPasswordError(false)}>
                  <svg class="fill-current h-3.5 w-3.5 text-red-500 text-xs" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                </span>
              </div>}
            </div>
            <div className="form-group w-full h-auto cursor-pointer">
              {/* <label htmlFor="organization">Select Organization</label> */}
              <select
                className="w-full  text-sm  pl-10 border-solid border-[1px]  border-gray-300 bg-inherit rounded-md focus:border-emerald-300 ease-in duration-300 cursor-pointer"
                id="organization"
                value={selectedOrganization}
                onChange={(e) => setSelectedOrganization(e.target.value)}

              >
                <option className="w-full" value="" disabled>Select Organization</option>
                {organizations.map((organization) => (
                  <option className="w-full" key={organization._id} value={organization._id}>
                    {organization.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-full">
              <label htmlFor="file-upload" className="flex items-center justify-center cursor-pointer border py-1 rounded-lg">
                <span className="mr-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </span>
                <span className="text-sm">Upload Profile Picture</span>
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                placeholder="select a file"
                required
              />
              <span className="absolute left-0 top-0 text-red-500">*</span>

              {selectedFile ? (
                <p className="mt-2 text-sm text-emerald-600">Selected: {selectedFile.name}</p>
              ) : (
                <p className="mt-2 text-sm text-gray-500">No file selected</p>
              )}
            </div>

            {fileError && <div class="bg-red-50 px-4 text-xs text-red-500 rounded relative my-3 flex w-100" role="alert">

              <span class="block sm:inline py-2 text-xs">{'Select one of these jpg , png, jpeg, jfif'}</span>
              <span class="px-2 py-2" onClick={() => setFileError(false)}>
                <svg class="fill-current h-3.5 w-3.5 text-red-500 text-xs" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
              </span>
            </div>}
            <div className="w-full h-auto flex flex-col items-center justify-center  relative ">
              <label className="block font-semibold mb-1 text-left w-full"><span className="text-red-500">*</span>Select Categories:</label>
              <div className="grid grid-cols-3 gap-1 w-full">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`p-1 rounded text-xs text-center ${buttonStates[index] ? "bg-[#546ef6] text-[#fff]" : "bg-gray-200 text-black"
                      }`}
                    onClick={() => handleButtonClick(index, category.name)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>



            <Button className="bg-[#546ef6] text-white-A700 text-lg w-full p-1 sm:w-5/6 rounded-md mt-[-5px]">
              Create Account
            </Button>
            <h3 className="mb-2">
              Already have an account?{" "}
              <span
                className="text-indigo-700 font-bold underline cursor-pointer
             "
                onClick={direct}
              >
                Login Here
              </span>
            </h3>
          </form>

        </div>
      </div>
    </div>

  );
};

export default Register;
