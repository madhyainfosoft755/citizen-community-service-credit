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
import { CirclesWithBar } from "react-loader-spinner";
import imageCompression from "browser-image-compression";
import Select from "react-select";
import axios from "axios";
const Register = () => {
  const notify = (e) => toast(e);
  const navigate = useNavigate();
  const [isloading, setIsloading] = useState(false);

  // Use state to store form data
  const [formsData, setFormData] = useState({
    name: "",
    email: "",
    // phone: "",
    // address: "",
    password: "",
    confirmPassword: "",
    selectedFile: "",
    categories: "",
  });
  const [error, setError] = useState(); // State for error message
  const [passwordError, setPasswordError] = useState(false);
  const [mobileError, setMobileError] = useState(""); // State for mobile number error
  const [aadharError, setAadharError] = useState(""); // State for Aadhar number error
  const [emailError, setEmailError] = useState(""); // State for email error
  const [fileError, setFileError] = useState(false); // State for email error
  const [categories, setCategories] = useState([]);
  // console.log("ye hai selected categories", categories)
  const [selectedCategories, setSelectedCategories] = useState([]); // this function for get selected are
  const [organizations, setOrganizations] = useState([]); // State for organizations
  const [selectedOrganization, setSelectedOrganization] = useState([]); // State for selected organization
  const [selectedOrganizationMenu, setSelectedOrganizationMenu] = useState([]); // State for selected organization
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
            // const sortedCategories = data.sort((a, b) => a.name.localeCompare(b.name));
            // const limitedCategories = sortedCategories.slice(0, 6);
            setCategories(
              data.map((value) => {
                return { value: value.name, label: value.name };
              })
            );
            // setButtonStates(Array(limitedCategories.length).fill(false)); // Adjust button states based on categories length
          } else {
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
          setOrganizations(
            data.map((value) => {
              return { value: value.id, label: value.name };
            })
          ); // Ensure data is an array
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

    setError({ ...error, selectedFile: "selected" });
    // Get the file extension
    const fileExtension = file.name.split(".").pop().toLowerCase();

    // Allowed image extensions
    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "jfif"];

    // Check if the selected file is an image
    if (
      allowedExtensions.includes(fileExtension) &&
      file.type.startsWith("image/")
    ) {
      setFileError(false);
      setSelectedFile(file);
    } else {
      setFileError(true);
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
  const handleCategoryChange = (selectedOptions) => {
    setError({ ...error, categories: "" });

    if (selectedOptions.length > 6) {
      return;
    }
    setSelectedCategories(selectedOptions.map((value) => value.value));
    console.log("Selected Categories:", selectedOptions);
    setSelectedOrganizationMenu(
      selectedOptions.map((value) => ({
        label: value.label,
        value: value.value,
      }))
    );
    setFormData((prevData) => ({
      ...prevData,
      categories: "selected",
    }));

    // You can perform other actions with selectedOptions here
  };

  const handleOrganizationChange = (selectedOptions) => {
    setSelectedOrganization(selectedOptions.map((value) => value.value));
    console.log("Selected organizations:", selectedOptions);
    // You can perform other actions with selectedOptions here
  };

  const handleEmptyFields = () => {
    let newErrors = { ...error };
    console.log(newErrors, "new errors");

    // Iterate over the formData object to check for empty fields
    Object.keys(formsData).forEach((field) => {
      if (!formsData[field]) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is a required field`;
      }
    });

    console.log(newErrors, "new errors");

    // Update the error state with the new errors
    setError(newErrors);
  };

  // function validatePassword(password) {
  //   const minLength = 8;
  //   const maxLength = 20;

  //   const lengthCheck = password.length >= minLength && password.length <= maxLength;
  //   const hasUppercase = /[A-Z]/.test(password);
  //   const hasLowercase = /[a-z]/.test(password);
  //   const hasNumber = /\d/.test(password);
  //   const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  //   if (!lengthCheck) {
  //     return `Password must be between ${minLength} and ${maxLength} characters.`;
  //   }
  //   if (!hasUppercase) {
  //     return "Password must contain at least one uppercase letter.";
  //   }
  //   if (!hasLowercase) {
  //     return "Password must contain at least one lowercase letter.";
  //   }
  //   if (!hasNumber) {
  //     return "Password must contain at least one number.";
  //   }
  //   if (!hasSpecialChar) {
  //     return "Password must contain at least one special character.";
  //   }

  //   return false;
  // }

  const validatePassword = (password) => {
    const errors = [];
    if (!/[a-z]/.test(password)) {
      errors.push("one small letter");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("one capital letter");
    }
    if (!/[~`!@#$%^&*()\-=+{}[\]\|;:'",.<>?\\\/]/.test(password)) {
      errors.push("one special character");
    }
    if (!/\d/.test(password)) {
      errors.push("one number");
    }
    return errors;
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "password") {
      if (!value) {
        setPasswordError("Password is required");
      } else if (value.length < 8) {
        setPasswordError("Password must be at least 8 characters");
      } else {
        const errors = validatePassword(value);
        if (errors.length > 0) {
          setPasswordError(
            `Password must include at least ${errors.join(", ")}`
          );
        } else {
          setPasswordError("");
        }
      }

      // Check if confirm password matches
      if (formsData.confirmPassword && value !== formsData.confirmPassword) {
        setError((prevError) => ({
          ...prevError,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setError((prevError) => ({
          ...prevError,
          confirmPassword: null,
        }));
      }
    } else if (name === "confirmPassword") {
      if (!value) {
        setError((prevError) => ({
          ...prevError,
          confirmPassword: "Confirm Password is required",
        }));
      } else if (value !== formsData.password) {
        setError((prevError) => ({
          ...prevError,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setError((prevError) => ({
          ...prevError,
          confirmPassword: null,
        }));
      }
    }
  };

  const handlePasswordBlur = () => {
    if (!formsData.password) {
      setPasswordError("Password is required");
    }
  };

  const handleInputChange = (e) => {
    // Check if e and e.target are defined
    // console.log("handle input change", e);
    if (e && e.target) {
      const { name, value } = e.target;
      setFieldBeingEdited(name);
      setError({ ...error, [name]: null });

      // Check if mobile number is verified when it reaches 10 digits
      if (name === "name") {
        setError({ ...error, [name]: null });
      }

      // if (name === "phone") {
      //   if (!/^\d+$/.test(value))
      //     setError({ ...error, [name]: `Incorrect mobile number format` })
      //   else {
      //     setError({ ...error, [name]: null })
      //     // checkIfExistPhone(value);
      //   }

      // }

      // if (name == 'address') {
      //   setError({ ...error, [name]: null })

      // }

      // Email validation
      if (name === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          setError({ ...error, [name]: "Incorrect email format" });

          if (!value) {
            setError({ ...error, [name]: null });
          }
        } else {
          setError({ ...error, [name]: null });
          // checkIfExistEmail(value);
        }
      }

      if (name == "passoword") {
        let passerror = validatePassword(value);

        if (passerror) {
          setError({ ...error, [name]: passerror });
        } else {
          setError({ ...error, [name]: null });
        }
        let passmatch = formsData.confirmPassword == value;
        console.log(passmatch, "passmatch");
        if (passmatch) {
          setError({ ...error, confirmPassword: null });
        }
      }

      if (name == "confirmPassword") {
        let passerror = !(formsData.password == value);
        if (passerror) {
          setError({ ...error, [name]: "Password did not match" });
        } else setError({ ...error, [name]: null });
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

  const checkIfExistEmail = async (e) => {
    // e.preventDefault();
    try {
      // Send a POST request to the API
      const response = await axios.post(`${API_URL}/activity/check-exists`, {
        email: e.target.value,
      });

      console.log(response.data);
      if (response.data.exists) {
        setError({ ...error, email: "Email already exist" });
      }
    } catch (error) {}
  };

  const checkIfExistPhone = async (e) => {
    // e.preventDefault();
    try {
      // Send a POST request to the API

      const response = await axios.post(`${API_URL}/activity/check-exists`, {
        phone: e.target.value,
      });
      if (response.data.exists) {
        setError({ ...error, phone: "Phone already exist" });
      }
    } catch (error) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    handleEmptyFields();
    // Check if passwords match
    // console.log(error, "submit")

    // Validate all fields, including password
    const passwordErrors = validatePassword(formsData.password);
    if (passwordErrors.length > 0) {
      setPasswordError(`Password is required`);
    }

    // ... existing validation for other fields ...

    if (passwordErrors.length > 0 /* || other field errors */) {
      // If there are any errors, don't submit the form
      return;
    }

    if (formsData.password !== formsData.confirmPassword) {
      setPasswordError(true);

      // notify("pasword do not match")
      return; // Exit function if passwords don't match
    }
    // Reset password error state if passwords match
    setPasswordError(false);

    // Validate mobile number format
    // Reset mobile number error state if valid
    setMobileError("");

    if (!selectedCategories || selectedCategories.length === 0) {
      // notify("Please select at least one category to register.");
      // setError({ ...error, categories: "Please select atleast one category" })
      return;
    }
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    let compressedFile = null;

    if (selectedFile) {
      compressedFile = await imageCompression(selectedFile, options);
    }

    const formsDATA = new FormData();
    formsDATA.append("name", e.target[0].value);
    formsDATA.append("email", e.target[1].value);
    formsDATA.append("phone", e.target[2].value);
    formsDATA.append("address", e.target[3].value);
    formsDATA.append("aadhar", e.target[4].value || null);
    formsDATA.append("password", e.target[5].value);
    formsDATA.append("cpassword", e.target[6].value);
    formsDATA.append("selectedCategories", JSON.stringify(selectedCategories));
    selectedFile &&
      formsDATA.append(
        "photo",
        compressedFile,
        selectedFile && selectedFile.name
      );
    formsDATA.append("organization", JSON.stringify(selectedOrganization));

    try {
      setIsloading(true);

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

        notify("Registration Successful");
        // setIsloading(false)
      } else {
        // setError(data.message); // Update error message state
        console.error("Error:", data.error);
        // Display error message to the user
        setError({ ...error, [data.field]: data.message });
      }
    } catch (error) {
      if (error.response) {
        // Access response details here
        console.log("Error status:", error.response.field); // e.g., 400
        console.log("Error data:", error.response.message); // Response body
      } else {
        // Handle other errors (e.g., network issues)
        console.log("Error message:", error.message);
      }
    } finally {
      setIsloading(false);
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

  const customStyles = {
    menu: (provided) => ({
      ...provided,
      maxHeight: 100, // Set the max height of the dropdown list
      overflowY: "auto", // Enable vertical scrolling
    }),
  };
  return (
    <div className=" w-screen h-screen sm:w-screen sm:h-screen md:w-screen md:h-screen flex items-center justify-center pt-5 pb-5 sm:p-0">
      <div className="relative overflow-hidden bg-cover bg-center w-4/12 h-full sm:w-full sm:h-full md:w-2/4 md:h-full lg:w-3/4 lg:h-full flex flex-col items-center justify-center border-[1px] rounded-lg py-0 sm:border-none">
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

        <div className="absolute  top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[75%] bg-white rounded-full overflow-hidden  opacity-25">
          <img src="./images/2.png" alt="" />
        </div>
        <div className="absolute -bottom-10 -left-20 w-64 h-64 bg-[#f5f6fe] rounded-full"></div>
        <div className="absolute -top-10 -right-20 w-64 h-64 bg-[#f5f6fe] rounded-full"></div>

        <div className="relative w-full h-full sm:w-full sm:h-full md:w-full md:h-full flex flex-col items-center justify-evenly gap-1 sm:-mt-0 ">
          <h3 className=" text-xl font-bold font-sans  sm:mt-4  text-black-900 ">
            Lets get started
          </h3>
          <h3 className="  text-center text-slate-600 font-medium">
            Create an account to access all features
          </h3>

          <form
            autocomplete="off"
            onSubmit={handleSubmit}
            className=" w-5/6 h-full sm:w-full sm:h-full md:w-full md:h-full flex flex-col items-center justify-between sm:justify-between gap-y-2.5 sm:gap-y-3 sm:mt-2 px-6 pb-4  "
          >
            <div className="w-full h-9 flex flex-col mt-2 justify-center relative">
              <InputWithIconAndText
                icon={faUser} // Change the icon as needed
                iconColor={"#578be5"}
                placeholder="Name"
                className="text-sm w-full h-7 pl-10 border-solid border-[1px]  border-gray-300 bg-inherit rounded-md focus:border-emerald-300 ease-in duration-300 py-1"
                onChange={handleInputChange}
                name="name"
              />
              {error && error.name && (
                <span className="text-red-500 text-xs text-left">
                  {error.name}
                </span>
              )}
              <h1 className="text-red-500 absolute -left-2 -top-1">*</h1>
            </div>

            <div className="w-full h-7 flex flex-col justify-center relative">
              <InputWithIconAndText
                icon={faEnvelope} // Change the icon as needed
                iconColor={"#645a9f"}
                placeholder="Email"
                className="text-sm w-full h-7 pl-10 border-solid border-[1px]  border-gray-300 bg-inherit rounded-md focus:border-emerald-300 ease-in duration-300 py-1"
                onChange={handleInputChange}
                onBlur={checkIfExistEmail}
                name="email"
                type="email"
              />
              <h1 className="text-red-500 absolute -left-2 -top-1">*</h1>
              {error && error.email && (
                <span className="text-red-500 text-xs text-left">
                  {error.email}
                </span>
              )}
            </div>
            <div className="w-full flex-col h-7 relative">
              <InputWithIconAndText
                icon={faPhone} // Change the icon as needed
                iconColor={"#419f44"}
                placeholder="Phone"
                className="text-sm w-full h-7 pl-10 border-solid border-[1px] border-gray-300 bg-inherit rounded-md focus:border-emerald-300 ease-in duration-300 py-1"
                onChange={handleInputChange}
                onBlur={checkIfExistPhone}
                name="phone"
                value={formsData.phone}
                type="number"
              />
            </div>

            <div className="w-full h-7 flex flex-col justify-center relative">
              <InputWithIconAndText
                icon={faLocationCrosshairs} // Change the icon as needed
                iconColor={"#d67500"}
                placeholder="Address"
                className="text-sm w-full h-7 pl-10 border-solid border-[1px]  border-gray-300 bg-inherit rounded-md focus:border-emerald-300 ease-in duration-300 py-1"
                onChange={handleInputChange}
                name="address"
              />
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

            <div className="w-full h-10 flex flex-col justify-center relative">
              <InputWithIconAndText
                icon={faKey} // Change the icon as needed
                iconColor={"#f4b8c0"}
                placeholder="Password"
                type="password"
                className="w-full h-7 text-sm  pl-10 border-solid border-[1px]  border-gray-300 bg-inherit rounded-md focus:border-emerald-300 ease-in duration-300 py-1"
                // inputClassName="password-input"
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                name="password"
                value={formsData.password}
              />
              <h1 className="text-red-500 absolute -left-2 -top-1">*</h1>
              {passwordError && (
                <span className="text-red-500 text-xs text-left">
                  {passwordError}
                </span>
              )}
            </div>
            <div className="w-full h-10 flex flex-col justify-center relative">
              <InputWithIconAndText
                icon={faLock} // Change the icon as needed
                iconColor={"#f5191c"}
                placeholder="Confirm Password"
                type="password"
                className="w-full h-7 text-sm  pl-10 border-solid border-[1px]  border-gray-300 bg-inherit rounded-md focus:border-emerald-300 ease-in duration-300 py-1"
                // inputClassName="password-input"
                onChange={handlePasswordChange}
                name="confirmPassword"
              />
              <h1 className="text-red-500 absolute -left-2 -top-1">*</h1>
              {error && error.confirmPassword && (
                <span className="text-red-500 text-xs text-left">
                  {error.confirmPassword}
                </span>
              )}
            </div>
            <div className="w-full h-auto flex flex-col justify-center relative">
              <label className="block font-semibold mb-1 text-left w-full">
                Organization:
              </label>

              <div className="w-full">
                {organizations && (
                  <Select
                    isMulti
                    name="options"
                    options={organizations}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    id="organization"
                    onChange={handleOrganizationChange}
                    styles={customStyles}
                  />
                )}
              </div>
            </div>

            <div className="relative w-full">
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center cursor-pointer border py-1 rounded-lg"
              >
                <span className="mr-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
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
              />
              <span className="absolute -left-2 -top-1 text-red-500">*</span>

              {selectedFile ? (
                <p className="mt-2 text-sm text-emerald-600">
                  Selected: {selectedFile.name}
                </p>
              ) : (
                error &&
                error.selectedFile && (
                  <p className="mt-2 text-sm text-red-500">No file selected</p>
                )
              )}
            </div>

            <div className="w-full h-auto flex flex-col justify-center relative">
              <label className="block font-semibold mb-1 text-left w-full">
                <span className="text-red-500">*</span>Select Categories:
              </label>

              <div className="w-full">
                {categories && (
                  <Select
                    isMulti
                    name="options"
                    options={categories}
                    value={selectedOrganizationMenu}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    id="category"
                    onChange={handleCategoryChange}
                    styles={customStyles}
                  />
                )}
                <div className="text-blue-500 mt-2">
                  You can only select up to {"6"} categories.
                </div>
                {error && error.categories && (
                  <span className="text-red-500 text-xs text-left">
                    {error.categories}
                  </span>
                )}
              </div>
            </div>

            {/* <div className="w-full h-auto flex flex-col items-center justify-center  relative ">
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
            </div> */}

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
