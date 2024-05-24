import React, { useEffect, useState } from "react";

import { Button, Img, Text } from "components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faCircleXmark, faSquareCheck, faUser, faEnvelope, faPhone, faLocationCrosshairs, faIdCard, faKey, faLock } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { API_URL } from "Constant";
import "./style.css"
import InputWithIconAndText from "components/inputwithicon/InputWithIconAndText";

const DesktopEightPage = () => {
  const notify = (e) => toast(e);
  const navigate = useNavigate();
  const [showinput, setShowInput] = useState(false)
  const [error, setError] = useState("")

  const goback = () => {
    navigate("/admin")
  }

  const toggleinput = () => {
    setShowInput(!showinput)
  }

  const checkTokenExpiry = async (token) => {
    try {
      const response = await fetch(`${API_URL}/activity/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      // console.log("ye rha response", response)

      if (!response.ok) {
        // Token might be expired or invalid, so log the user out
        // handleLogout();
        navigate("/login")
        notify("Session time Out")
      }
    } catch (error) {
      notify(error)
      console.error("Error checking token expiry:", error);
    }
  };

  useEffect(() => {
    // Check if both token and user key are present in local storage
    const token = localStorage.getItem("token");
    const userKey = localStorage.getItem("userKey");

    // console.log("ye hai token ",token)

    if (!token || !userKey) {
      // Redirect to the login page if either token or user key is missing
      navigate("/login");
    } else {
      // Fetch user data when component mounts
      checkTokenExpiry(token);
      // fetchCategories(); // Fetch categories when component mounts
    }

    // You may also want to check the validity of the token here if needed

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures that this effect runs only once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      aadhar: formData.get("aadhar"),
    };

    try {
      const response = await fetch(`${API_URL}/approvers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        notify("Approver added successfully");
        setShowInput(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error adding approver");
        notify(errorData.message || "Error adding approver");
      }
    } catch (error) {
      setError(error.message);
      notify(error.message);
    }
  };
  return (
    <div className="w-screen h-screen  bg-white-A700 flex items-start justify-center sm:w-screen sm:h-screen md:w-screen md:h-screen p-5 sm:p-0">
      <div className=" relative w-4/12 h-full sm:w-full sm:h-full md:w-3/4 md:h-full  lg:w-3/4 lg:h-full  flex flex-col items-center  justify-start gap-5 border-[1px] rounded-lg sm:rounded-none overflow-hidden">
        <div className="relative w-full flex flex-col items-center justify-center gap-1 ">

          <div className="bg-white-A700 flex flex-row items-center justify-between p-3  shadow-bs3 w-full">
            <div onClick={goback}>
              <Img
                className="h-4 cursor-pointer"
                src="images/img_arrowleft.svg"
                alt="arrowleft"
              />
            </div>
            <Text
              className="text-gray-900"
              size="txtInterSemiBold17"
            >
              Manage Approvers
            </Text>
            <Button className="rounded-xl " onClick={toggleinput}>
              <FontAwesomeIcon icon={showinput ? faCircleXmark : faCirclePlus} className="text-[#546ef6] text-2xl " />
            </Button>
          </div>

          {showinput && (
            <div className="w-11/12 flex flex-col items-center justify-center absolute top-20 rounded-xl overflow-hidden shadow shadow-black-900">
              <form  onSubmit={handleSubmit} className="w-full h-full flex flex-col items-center justify-center gap-2 bg-white-A700/50 border-2  rounded-xl overflow-hidden p-2">

                <div className="w-full flex items-center justify-center bg-white-A700 rounded-md border-[1px] border-gray-300 overflow-hidden">
                  <FontAwesomeIcon icon={faUser} className="text-[#546ef6] ml-2" />
                  <input type="text" className="w-full h-7 border-none" name="name" placeholder="Name" required />
                </div>
                <div className="w-full flex items-center justify-center bg-white-A700 rounded-md border-[1px] border-gray-300 overflow-hidden">
                  <FontAwesomeIcon icon={faEnvelope} className="text-[#546ef6] ml-2" />
                  <input type="email" className="w-full h-7 border-none" name="email" placeholder="Email" required />
                </div>
                <div className="w-full flex items-center justify-center bg-white-A700 rounded-md border-[1px] border-gray-300 overflow-hidden">
                  <FontAwesomeIcon icon={faPhone} className="text-[#546ef6] ml-2" />
                  <input type="number" className="w-full h-7 border-none" placeholder="Phone Number" name="phone" />
                </div>
                <div className="w-full flex items-center justify-center bg-white-A700 rounded-md border-[1px] border-gray-300 overflow-hidden">
                  <FontAwesomeIcon icon={faLocationCrosshairs} className="text-[#546ef6] ml-2" />
                  <input type="text" className="w-full h-7 border-none" placeholder="Address" name="address" required />
                </div>
                <div className="w-full flex items-center justify-center bg-white-A700 rounded-md border-[1px] border-gray-300 overflow-hidden">
                  <FontAwesomeIcon icon={faIdCard} className="text-[#546ef6] ml-2" />
                  <input type="number" className="w-full h-7 border-none" placeholder="Aadhar" name="aadhar" />
                </div>
                <button className="bg-[#546ef6] px-4 py-2 w-3/5 rounded-full ">Submit</button>
              </form>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2.5 items-center justify-start w-11/12 scroller overflow-scroll ">


          <div className="w-full h-auto flex items-center justify-center p-2">
            <Img className="w-[80%] h-auto object-cover object-center" src="images/nopost.svg" alt="No posts available for endorsement" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopEightPage;
