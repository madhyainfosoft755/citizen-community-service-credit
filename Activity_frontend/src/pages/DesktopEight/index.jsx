import React, { useEffect, useRef, useState } from "react";

import { Button, Img, Text } from "components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faCircleXmark, faSquareCheck, faUser, faEnvelope, faPhone, faLocationCrosshairs, faIdCard, faKey, faLock, faDeleteLeft, faDumpster, faTrash, faEdit, faCross } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { API_URL } from "Constant";
import "./style.css"
import InputWithIconAndText from "components/inputwithicon/InputWithIconAndText";

const DesktopEightPage = () => {
  const notify = (e) => toast(e);
  const navigate = useNavigate();
  const [showinput, setShowInput] = useState(false)
  const [error, setError] = useState("")
  const [approvers, setApprovers] = useState([]);
  const [errors, setErrors] = useState({});
  const popUpRef = useRef(null); // Create a ref for the pop-up


  
  const goback = () => {
    navigate("/admin")
  }

 

  const handleClickOutside = (event) => {
   if (true ){
      setShowInput(false); // Close the pop-up if click is outside it
      
      console.log("2",event.target)
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside); // Attach event listener on mount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Detach event listener on unmount
    };
  }, []); // Empty dependency array ensures that this effect runs only once on mount


  const toggleinput = () => {
    setShowInput(!showinput)
    console.log("thi is event", showinput)
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

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const validateAadhar = (aadhar) => {
    return /^\d{12}$/.test(aadhar);
  };


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

    const newErrors = {};

    if (!validateEmail(data.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!validatePhone(data.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (!validateAadhar(data.aadhar)) {
      newErrors.aadhar = "Aadhar number must be 12 digits";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("ye hai data ", data)
    try {
      const response = await fetch(`${API_URL}/activity/addApprover`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        notify("Approver added successfully");
        setShowInput(false);
        fetchApprovers();
        setError('')
        setErrors({})
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

  const fetchApprovers = async () => {
    try {
      const response = await fetch(`${API_URL}/activity/fetchApprovers`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setApprovers(data);
        notify(data.message)
      } else {
        setApprovers(data)
        notify(data.message);
      }
    } catch (error) {
      notify(error);
      console.error("Error fetching approvers:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userKey = localStorage.getItem("userKey");

    if (!token || !userKey) {
      navigate("/login");
    } else {
      checkTokenExpiry(token);
      fetchApprovers();
    }
  }, []);

  const handleUpdateApprover = (approverId) => {
    // Implement update logic here
    console.log("Update approver with ID:", approverId);
  };

  const handleDeleteApprover = async (approverId) => {
    try {
      const response = await fetch(`${API_URL}/activity/deleteApprover/${approverId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        notify("Approver deleted successfully");
        fetchApprovers(); // Refetch approvers after delete

      } else {
        fetchApprovers(); // Refetch approvers after delete
        console.error("Failed to delete approver");
      }
    } catch (error) {
      console.error("Error deleting approver:", error);
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
            {
              showinput ?
              
            <Button className="rounded-xl btn" key={0} onChange={()=>{}}>
              <FontAwesomeIcon icon={ faCircleXmark} className="text-[#546ef6] text-2xl " />
            </Button>:
            <Button className="rounded-xl " key={1} onClick={toggleinput}>
              <FontAwesomeIcon icon={ faCirclePlus} className="text-[#546ef6] text-2xl " />
            </Button>
            }
          </div>

          {showinput && (
            <div ref={popUpRef} className="w-11/12 flex flex-col items-center justify-center absolute top-20 rounded-xl overflow-hidden shadow shadow-black-900">
              <form onSubmit={handleSubmit} className="w-full h-full flex flex-col items-center justify-center gap-2 bg-white-A700/50 border-2  rounded-xl overflow-hidden p-2">

                <div className="w-full flex items-center justify-center bg-white-A700 rounded-md border-[1px] border-gray-300 overflow-hidden">
                  <FontAwesomeIcon icon={faUser} className="text-[#546ef6] ml-2" />
                  <input type="text" className="w-full h-7 border-none" name="name" placeholder="Name" required />
                </div>
                {errors.name && <small className="text-red-500">{errors.name}</small>}
                <div className="w-full">

                  <div className={`w-full flex  items-center justify-center bg-white-A700 rounded-md border-[1px] ${errors.email ? "input-error" : "border-gray-300"} overflow-hidden`}>
                    <FontAwesomeIcon icon={faEnvelope} className="text-[#546ef6] ml-2" />
                    <input type="email" className="w-full h-7 border-none" name="email" placeholder="Email" required />
                  </div>
                  {errors.email && <small className="text-red-500 text-xs w-full text-center">{errors.email}</small>}
                </div>
                <div className="w-full">
                  <div className={`w-full flex  items-center justify-center bg-white-A700 rounded-md border-[1px] ${errors.phone ? "input-error" : "border-gray-300"} overflow-hidden`}>
                    <FontAwesomeIcon icon={faPhone} className="text-[#546ef6] ml-2" />
                    <input type="number" className="w-full h-7 border-none" placeholder="Phone Number" name="phone" required />
                  </div>
                  {errors.phone && <small className="text-red-500 text-xs w-full text-center">{errors.phone}</small>}
                </div>
                <div className="w-full flex items-center justify-center bg-white-A700 rounded-md border-[1px] border-gray-300 overflow-hidden">
                  <FontAwesomeIcon icon={faLocationCrosshairs} className="text-[#546ef6] ml-2" />
                  <input type="text" className="w-full h-7 border-none" placeholder="Address" name="address" required />
                </div>
                {errors.address && <small className="text-red-500">{errors.address}</small>}
                <div className="w-full">

                  <div className={`w-full flex  items-center justify-center bg-white-A700 rounded-md border-[1px] ${errors.aadhar ? "input-error" : "border-gray-300"} overflow-hidden`}>
                    <FontAwesomeIcon icon={faIdCard} className="text-[#546ef6] ml-2" />
                    <input type="number" className="w-full h-7 border-none" placeholder="Aadhar" name="aadhar" />
                  </div>
                  {errors.aadhar && <small className="text-red-500 text-xs w-full text-center">{errors.aadhar}</small>}
                </div>
                <button className="bg-[#546ef6] px-4 py-2 w-3/5 rounded-full ">Submit</button>
              </form>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2.5 items-center justify-start w-11/12 scroller overflow-scroll">
          {approvers.length > 0 ? (
            approvers.map((approver, index) => (
              <div key={index} className="w-full border p-2 rounded-md flex items-center justify-between bg-[#e9ecfe]">
                <div>
                  <Text className="font-semibold text-xl ml-3">{approver.name}</Text>
                </div>
                <div className=" flex gap-3 " >
                  <Button className="rounded-md" onClick={() => handleUpdateApprover(approver.id)}>
                    <FontAwesomeIcon icon={faEdit} className="text-[#546ef6] text-xl" />
                  </Button>
                  <Button className="rounded-md" onClick={() => handleDeleteApprover(approver.id)}>
                    <FontAwesomeIcon icon={faTrash} className="text-[#546ef6] text-xl" />
                  </Button>
                </div>
                {/* <Text>Email: {approver.email}</Text> */}
                {/* Add other approver details here */}
              </div>
            ))
          ) : (
            <div className="w-full h-auto flex items-center justify-center p-2">
              <Img
                className="w-[80%] h-auto object-cover object-center"
                src="images/nopost.svg"
                alt="No approvers available"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopEightPage;
