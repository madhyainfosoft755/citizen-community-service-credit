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
  const [isClicked, setIsClicked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const myInputRef = React.createRef();
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
  console.log("formdata", formsData);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log("file", file.name);
  };

  // this function for get selected are
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleButtonClick2 = () => {
    navigate("/login" || "/createpost, { state: { user: formsData } }");
  };

  const [buttonStates, setButtonStates] = useState(Array(3).fill(false)); // Assuming 3 buttons, adjust the size as needed

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

  // End here

  const handleInputChange = (e) => {
    // Check if e and e.target are defined
    console.log("handle input change", e);
    if (e && e.target) {
      const { name, value } = e.target;

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

    console.log("event", e.target[0].value);

    const formsDATA = new FormData();
    formsDATA.append("name", e.target[0].value);
    formsDATA.append("email", e.target[1].value);
    formsDATA.append("groupThree", e.target[2].value);
    formsDATA.append("groupFour", e.target[3].value);
    formsDATA.append("groupFive", e.target[4].value);
    formsDATA.append("password", e.target[5].value);
    formsDATA.append("cpassword", e.target[6].value);

    formsDATA.append("selectedCategories", JSON.stringify(selectedCategories));

    console.log(formsDATA);
    // formsData.append('selectedFile',selectedFile);
    console.log(selectedFile, "selected file");
    formsDATA.append("photo", selectedFile);

    // Check the console to see if the data is correctly appended
    console.log(formsDATA.get("name"));

    const formDataJson = {};
    for (const [key, value] of formsDATA.entries()) {
      formDataJson[key] = value;
    }

    console.log("form data", formDataJson);

    try {
      const response = await fetch(
        `${API_URL}/activity/Register`,
        {
          method: "POST",
          body: formsDATA,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);
        navigate("/login" || "/createpost, { state: { user: formsData } }");
      } else {
        console.error("Error:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      className="sm:w-screen sm:h-screen   bg-cover bg-center"
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
          />
          <InputWithIconAndText
            icon={faEnvelope} // Change the icon as needed
            iconColor={"#645a9f"}
            placeholder="Email"
            className="text-xl  pl-10 border-2 bg-inherit rounded-full focus:border-emerald-300 ease-in duration-300"
            onChange={handleInputChange}
          />
          <InputWithIconAndText
            icon={faPhone} // Change the icon as needed
            iconColor={"#419f44"}
            placeholder="Phone"
            className="text-xl  pl-10 border-2 bg-inherit rounded-full focus:border-emerald-300 ease-in duration-300"
            onChange={handleInputChange}
          />
          <InputWithIconAndText
            icon={faLocationCrosshairs} // Change the icon as needed
            iconColor={"#d67500"}
            placeholder="Address"
            className="text-xl  pl-10 border-2 bg-inherit rounded-full focus:border-emerald-300 ease-in duration-300"
            onChange={handleInputChange}
          />
          <InputWithIconAndText
            icon={faIdCard} // Change the icon as needed
            iconColor={"#ffe93f"}
            placeholder="Aadhar Number"
            className="text-xl  pl-10 border-2 bg-inherit rounded-full focus:border-emerald-300 ease-in duration-300"
            onChange={handleInputChange}
          />
          <InputWithIconAndText
            icon={faKey} // Change the icon as needed
            iconColor={"#f4b8c0"}
            placeholder="Password"
            type="password"
            className="text-xl  pl-10 border-2 bg-inherit rounded-full focus:border-emerald-300 ease-in duration-300"
            onChange={handleInputChange}
          />
          <InputWithIconAndText
            icon={faLock} // Change the icon as needed
            iconColor={"#f5191c"}
            placeholder="Confirm Password"
            type="password"
            className="text-xl  pl-10 border-2 bg-inherit rounded-full focus:border-emerald-300 ease-in duration-300"
            onChange={handleInputChange}
          />
          <InputWithIconAndText
            type="file"
            className=" pt-2 pb-2 pl-1 border-double border-4  rounded-lg focus:border-emerald-300 ease-in duration-300"
            onChange={handleFileChange}
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
          <span className="text-indigo-700 font-bold">Login Here</span>
        </h3>
      </div>
    </div>
  );
};

export default Register;
