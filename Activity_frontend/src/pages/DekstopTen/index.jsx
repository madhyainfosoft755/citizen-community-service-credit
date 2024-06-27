import React, { useEffect, useState } from "react";

import { Button, Img, Text } from "components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faCircleXmark, faSquareCheck, faUser, faEnvelope, faPhone, faLocationCrosshairs, faIdCard, faKey, faLock, faDeleteLeft, faDumpster, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { API_URL } from "Constant";
import "./style.css"

const DesktopTenPage = () => {
  const notify = (e) => toast(e);
  const navigate = useNavigate();
  const [showinput, setShowInput] = useState(false)
  const [error, setError] = useState("")
  const [approvers, setApprovers] = useState([]);
  const [users, setUsers] = useState([]);


  const goback = () => {
    navigate("/admin")
  }

  // const toggleinput = () => {
  //   setShowInput(!showinput)
  // }

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

  // useEffect(() => {
  //   // Check if both token and user key are present in local storage
  //   const token = localStorage.getItem("token");
  //   const userKey = localStorage.getItem("userKey");

  //   // console.log("ye hai token ",token)

  //   if (!token || !userKey) {
  //     // Redirect to the login page if either token or user key is missing
  //     navigate("/login");
  //   } else {
  //     // Fetch user data when component mounts
  //     checkTokenExpiry(token);
  //     fetchUsers()
  //     // fetchCategories(); // Fetch categories when component mounts
  //   }

  //   // You may also want to check the validity of the token here if needed

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []); // Empty dependency array ensures that this effect runs only once on mount



  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/activity/getUsers`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        notify(data.message);
      }
    } catch (error) {
      notify(error);
      console.error("Error fetching users:", error);
    }
  };



  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/activity/deleteUser/${userId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        notify("User deleted successfully");
        fetchUsers(); // Refetch users after delete
      } else {
        notify("Failed to delete user");
      }
    } catch (error) {
      notify("Error deleting user");
      console.error("Error deleting user:", error);
    }
  };



  useEffect(() => {
    const token = localStorage.getItem("token");
    const userKey = localStorage.getItem("userKey");

    if (!token || !userKey) {
      navigate("/login");
    } else {
      checkTokenExpiry(token);
      fetchUsers()
    }
  }, []);



  return (
    <div className="w-screen h-screen bg-white-A700 flex items-start justify-center sm:w-screen sm:h-screen md:w-screen md:h-screen p-5 sm:p-0">
      <div className="relative w-4/12 h-full sm:w-full sm:h-full md:w-3/4 md:h-full lg:w-3/4 lg:h-full flex flex-col items-center justify-start gap-5 border-[1px] rounded-lg sm:rounded-none overflow-hidden">
        <div className="relative w-full flex flex-col items-center justify-center gap-1 ">
          <div className="bg-white-A700 flex flex-row items-center justify-between p-5 shadow-bs3 w-full">
            <div onClick={() => navigate("/admin")}>
              <Img className="h-4 cursor-pointer" src="images/img_arrowleft.svg" alt="arrowleft" />
            </div>
            <Text className="text-gray-900" size="txtInterSemiBold17">
              Manage Users
            </Text>
            <div />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 items-center justify-start w-11/12 scroller overflow-scroll">
          {users.length > 0 ? (
            users.map((user, index) => (
              <div key={index} className="w-full border p-2 rounded-md flex items-center justify-between bg-[#e9ecfe]">
                <div>
                  <Text className="font-semibold text-xl ml-3">{user.name}</Text>
                </div>
                <div className="flex gap-3">

                  <Button className="rounded-md" onClick={() => handleDeleteUser(user.id)}>
                    <FontAwesomeIcon icon={faTrash} className="text-[#546ef6] text-xl" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full h-auto flex items-center justify-center p-2">
              <Img className="w-[80%] h-auto object-cover object-center" src="images/nopost.svg" alt="No users available" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default DesktopTenPage;
