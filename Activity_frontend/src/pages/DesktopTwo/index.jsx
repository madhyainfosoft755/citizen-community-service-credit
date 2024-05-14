import React, { useState } from "react";
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
  const [selectedCategories, setSelectedCategories] = useState([]); // this function for get selected are
  const [buttonStates, setButtonStates] = useState(Array(3).fill(false)); // Assuming 3 buttons, adjust the size as needed
  const [selectedFile, setSelectedFile] = useState(null);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [fieldBeingEdited, setFieldBeingEdited] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log("file", file.name);
  };

  const handleButtonClick = (index, value) => {
    setButtonStates((prevButtonStates) => {
      const newButtonStates = [...prevButtonStates];
      newButtonStates[index] = !newButtonStates[index];
      return newButtonStates;
    });

    setSelectedCategories((prevCategories) => {
      if (prevCategories.includes(value)) {
        // If category is already selected, remove it
        return prevCategories.filter((category) => category !== value);
      } else {
        // If category is not selected, add it
        return [...prevCategories, value];
      }
    });
  };

  const handleInputChange = (e) => {
    // Check if e and e.target are defined
    console.log("handle input change", e);
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

      // Aadhar number validation
      if (name === "aadhar" && value.length !== 12) {
        setAadharError("Aadhar number should be a 12-digit number");
      } else {
        setAadharError(value.length > 0 ? "" : "Aadhar number is required");
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
          case "aadhar":
            setAadharError("");
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

  const handleVerifyMobile = () => {
    // Your logic to verify mobile number can go here
    toast.success("Mobile number verified", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    })
    console.log("Mobile number verified");
    // You can set state or perform any action after mobile number verification
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsloading(true)

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

    const formDataJson = {};
    for (const [key, value] of formsDATA.entries()) {
      formDataJson[key] = value;
    }

    try {
      const response = await fetch(`${API_URL}/activity/Register`, {
        method: "POST",
        body: formsDATA,
      });
      console.log("kya response aa rha hai", response);

      const data = await response.json();
      console.log("kya data aa rha hai", data);
      if (response.ok) {
        console.log("Success:", data);
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
        notify("Registration Successful")
        setIsloading(false)
      } else {
        setError(data.message); // Update error message state
        console.error("Error aa gai re baba:", data.error); // Display error message to the user
        notify(data.message)
      }
    } catch (error) {
      console.error("Error aa gai re baba:", error);
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
    <div className="relative w-screen h-screen sm:w-screen sm:h-screen md:w-screen md:h-screen flex items-center justify-center pt-5 pb-5 sm:p-0">
      {isloading && (
        <CirclesWithBar className="absolute top-[50%] left-[50%]"
          height="100"
          width="100"
          color="#546ef6"
          outerCircleColor="#4fa94d"
          innerCircleColor="#4fa94d"
          barColor="#4fa94d"
          ariaLabel="circles-with-bar-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      )}

      <div
        className="relative overflow-hidden bg-cover bg-center w-4/12 h-full sm:w-full sm:h-full md:w-2/4 md:h-full lg:w-3/4 lg:h-full flex flex-col items-center justify-center border-[1px] rounded-lg py-0 sm:border-none"

      >

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
            onSubmit={handleSubmit}
            className=" w-5/6 h-full sm:w-full sm:h-full md:w-full md:h-full flex flex-col items-center justify-start sm:justify-start gap-y-3 sm:gap-y-4 sm:mt-2 px-6  "
          >

            <div className="w-full h-7 flex flex-col items-center justify-center relative">
              <InputWithIconAndText
                icon={faUser} // Change the icon as needed
                iconColor={"#578be5"}
                placeholder="Name"
                className="text-sm w-full h-7 pl-10 border-solid border-[1px]  border-gray-300 bg-inherit rounded-md focus:border-emerald-300 ease-in duration-300"
                onChange={handleInputChange}
                name="name"
                required
              />
            </div>
            <div className="w-full h-7 flex flex-col items-center justify-center relative">
              <InputWithIconAndText
                icon={faEnvelope} // Change the icon as needed
                iconColor={"#645a9f"}
                placeholder="Email"
                className="text-sm w-full h-7 pl-10 border-solid border-[1px]  border-gray-300 bg-inherit rounded-md focus:border-emerald-300 ease-in duration-300"
                onChange={handleInputChange}
                name="email"
                type="email"
              />
              {fieldBeingEdited === "email" && error && <div className="error-message">{error}</div>}
            </div>
            <div className="w-full h-7 flex  items-center justify-center relative">
              <InputWithIconAndText
                icon={faPhone} // Change the icon as needed
                iconColor={"#419f44"}
                placeholder="Phone"
                className="text-sm w-full h-7 pl-10 border-solid border-[1px]  border-gray-300 bg-inherit rounded-md focus:border-emerald-300 ease-in duration-300"
                onChange={handleInputChange}
                name="phone"
                value={formsData.phone}
                type="number"
              />

              {/* {isMobileVerified && (
                <Button type="button" className="bg-blue-400 text-white-A700 rounded-2xl absolute right-0" onClick={handleVerifyMobile}>Verify</Button>
              )} */}
            </div>
            {fieldBeingEdited === "phone" && mobileError && <div className="error-message ">{mobileError}</div>}

            <div className="w-full h-7 flex flex-col items-center justify-center relative">
              <InputWithIconAndText
                icon={faLocationCrosshairs} // Change the icon as needed
                iconColor={"#d67500"}
                placeholder="Address"
                className="text-sm w-full h-7 pl-10 border-solid border-[1px]  border-gray-300 bg-inherit rounded-md focus:border-emerald-300 ease-in duration-300"
                onChange={handleInputChange}
                name="address"
              />
            </div>
            <div className="w-full h-7 flex flex-col items-center justify-center relative">
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
            {fieldBeingEdited === "aadhar" && aadharError && <div className="error-message">{aadharError}</div>}

            <div className="w-full h-7 flex flex-col items-center justify-center relative">
              <InputWithIconAndText
                icon={faKey} // Change the icon as needed
                iconColor={"#f4b8c0"}
                placeholder="Password"
                type="password"
                className="w-full h-7 text-sm  pl-10 border-solid border-[1px]  border-gray-300 bg-inherit rounded-md focus:border-emerald-300 ease-in duration-300"
                // inputClassName="password-input"
                onChange={handleInputChange}
                name="password"
              />
            </div>
            <div className="w-full h-7 flex flex-col items-center justify-center relative">
              <InputWithIconAndText
                icon={faLock} // Change the icon as needed
                iconColor={"#f5191c"}
                placeholder="Confirm Password"
                type="password"
                className="w-full h-7 text-sm  pl-10 border-solid border-[1px]  border-gray-300 bg-inherit rounded-md focus:border-emerald-300 ease-in duration-300"
                // inputClassName="password-input"
                onChange={handleInputChange}
                name="confirmPassword"
              />
              {passwordError && (
                <div className="error-message">Passwords do not match</div>
              )}
            </div>

            <div className="w-full h-7 mt-1 flex items-center justify-center">
              <h2 className="font-semibold">Profile Picture </h2>
              <InputWithIconAndText
                type="file"
                className="w-[250px] pt-1 pb-1 pl-1 border-double border-4  rounded-lg focus:border-emerald-300 ease-in duration-300"
                onChange={handleFileChange}
                placeholder="select a file"
              />
            </div>

            <h2 className="text-xl font-bold ">
              Select Interested Areas
            </h2>
            <div className="sm:w-full grid grid-cols-2  gap-2 pl-3 pr-3  ">
              <InputWithIconAndText
                type="checkbox"
                text={"Planting Tree"}
                className=" p-2 border-double border-4  rounded-lg focus:border-emerald-300  ease-in duration-300"
                onClick={() => handleButtonClick(0, "Planting tree")}
              />
              <InputWithIconAndText
                type="checkbox"
                text={"Teaching Kids"}
                className=" p-2 border-double border-4  rounded-lg focus:border-emerald-300 ease-in duration-300"
                onClick={() => handleButtonClick(1, "Teaching Kids")}
              />
              <InputWithIconAndText
                type="checkbox"
                text={"Feeding the poor"}
                className=" p-2 border-double border-4  rounded-lg focus:border-emerald-300 ease-in duration-300"
                onClick={() => handleButtonClick(2, "Feeding the poor")}
              />
              <InputWithIconAndText
                type="checkbox"
                text={"Local Cleaning"}
                className=" p-2 border-double border-4  rounded-lg focus:border-emerald-300 ease-in duration-300"
                onClick={() => handleButtonClick(3, "Local Cleaning")}
              />
              <InputWithIconAndText
                type="checkbox"
                text={"Blood Donation"}
                className=" p-2 border-double border-4  rounded-lg focus:border-emerald-300 ease-in duration-300"
                onClick={() => handleButtonClick(4, "Blood Donation")}
              />
              <InputWithIconAndText
                type="checkbox"
                text={"Running a marathon"}
                className=" p-2 border-double border-4  rounded-lg focus:border-emerald-300 ease-in duration-300"
                onClick={() => handleButtonClick(5, "Running a marathon")}
              />
            </div>
            <Button className="bg-[#546ef6] text-white-A700 text-lg w-full p-0 sm:w-5/6 rounded-md mt-[-5px]">
              Create Account
            </Button>
            <h3 className="sm:-mt-2 mb-2">
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
