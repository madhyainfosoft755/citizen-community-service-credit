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

const Register = () => {
  const navigate = useNavigate();
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
  const [selectedCategories, setSelectedCategories] = useState([]); // this function for get selected are
  const [buttonStates, setButtonStates] = useState(Array(3).fill(false)); // Assuming 3 buttons, adjust the size as needed
  const [selectedFile, setSelectedFile] = useState(null);
  const [isMobileVerified, setIsMobileVerified] = useState(false);

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

      // Check if mobile number is verified when it reaches 10 digits
      if (name === "phone" && value.length === 10) {
        setIsMobileVerified(true);
      } else {
        setIsMobileVerified(false);
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
    console.log("Mobile number verified");
    // You can set state or perform any action after mobile number verification
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formsData.password !== formsData.confirmPassword) {
      setPasswordError(true);
      return; // Exit function if passwords don't match
    }
    // Reset password error state if passwords match
    setPasswordError(false);

    // Validate mobile number format
    if (!validateMobileNumber(formsData.phone)) {
      setMobileError("Invalid mobile number format");
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
      } else {
        setError(data.message); // Update error message state
        console.error("Error aa gai re baba:", data.error); // Display error message to the user
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
    <div className="w-screen h-screen flex items-center justify-center pt-5 pb-5">
      
    <div
      className="    bg-cover bg-center w-1/4 h-full sm:w-screen sm:h-screen md:w-2/4 md:h-screen  lg:w-3/4 lg:h-3/4 flex flex-col items-center justify-center shadow-bs2 shadow-black-900"
      style={{ backgroundImage: 'url("./images/img_whitewall.jpg")' }}
    >
      <div className=" flex flex-col items-center justify-center">
        <h3 className=" text-xl font-bold font-sans pt-4 mb-1 text-white-A700 ">
          Lets get started
        </h3>
        <h3 className="  text-center text-slate-600 font-medium mb-5 ">
          Create an account to access all features
        </h3>

        <form
          onSubmit={handleSubmit}
          action=""
          className="flex flex-col items-center justify-center  w-4/6 max-w-sm gap-y-6 "
        >
          <InputWithIconAndText
            icon={faUser} // Change the icon as needed
            iconColor={"#578be5"}
            placeholder="Name"
            className="text-xl  pl-10 border-2 bg-inherit rounded-full focus:border-emerald-300 ease-in duration-300"
            onChange={handleInputChange}
            name="name"
          />
          <InputWithIconAndText
            icon={faEnvelope} // Change the icon as needed
            iconColor={"#645a9f"}
            placeholder="Email"
            className="text-xl  pl-10 border-2 bg-inherit rounded-full focus:border-emerald-300 ease-in duration-300"
            onChange={handleInputChange}
            name="email"
          />
          {error && <div className="error-message">{error}</div>}

          <div className="flex ">
            <InputWithIconAndText
              icon={faPhone} // Change the icon as needed
              iconColor={"#419f44"}
              placeholder="Phone"
              className="text-xl  pl-10 border-2 bg-inherit rounded-full focus:border-emerald-300 ease-in duration-300"
              onChange={handleInputChange}
              name="phone"
              value={formsData.phone}
            />
            {mobileError && <div className="error-message">{mobileError}</div>}
            {isMobileVerified && (
              <Button type="button" className="bg-blue-400 text-white-A700 rounded-2xl" onClick={handleVerifyMobile}>Verify</Button>
            )}
          </div>

          <InputWithIconAndText
            icon={faLocationCrosshairs} // Change the icon as needed
            iconColor={"#d67500"}
            placeholder="Address"
            className="text-xl  pl-10 border-2 bg-inherit rounded-full focus:border-emerald-300 ease-in duration-300"
            onChange={handleInputChange}
            name="address"
          />
          <InputWithIconAndText
            icon={faIdCard} // Change the icon as needed
            iconColor={"#ffe93f"}
            placeholder="Aadhar Number"
            className="text-xl  pl-10 border-2 bg-inherit rounded-full focus:border-emerald-300 ease-in duration-300"
            onChange={handleInputChange}
            name="aadhar"
          />
          <InputWithIconAndText
            icon={faKey} // Change the icon as needed
            iconColor={"#f4b8c0"}
            placeholder="Password"
            type="password"
            className="h-8 text-xl  pl-10 border-2 bg-inherit rounded-full focus:border-emerald-300 ease-in duration-300"
            // inputClassName="password-input"
            onChange={handleInputChange}
            name="password"
          />
          <InputWithIconAndText
            icon={faLock} // Change the icon as needed
            iconColor={"#f5191c"}
            placeholder="Confirm Password"
            type="password"
            className="h-8 text-xl  pl-10 border-2 bg-inherit rounded-full focus:border-emerald-300 ease-in duration-300"
            // inputClassName="password-input"
            onChange={handleInputChange}
            name="confirmPassword"
          />
          {passwordError && (
            <div className="error-message">Passwords do not match</div>
          )}
          <InputWithIconAndText
            type="file"
            className=" pt-2 pb-2 pl-1 border-double border-4  rounded-lg focus:border-emerald-300 ease-in duration-300"
            onChange={handleFileChange}
            placeholder="select a file"
          />

          <h2 className="text-xl font-bold mt-[-15px]">
            Select Intrested Areas
          </h2>
          <div className="sm:w-screen grid grid-cols-2  gap-2 pl-3 pr-3  ">
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
          <Button className="bg-sky-600 text-white-A700 text-2xl sm:w-5/6 rounded-full mt-[-5px]">
            Create Account
          </Button>
        </form>
        <h3 className="mb-2">
          Already have an account?{" "}
          <span
            className="text-indigo-700 font-bold underline  "
            onClick={direct}
          >
            Login Here
          </span>
        </h3>
      </div>
    </div>
    </div>

  );
};

export default Register;
