import React, { useEffect, useState } from "react";

import { Button, Img, Text } from "components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faCircleXmark, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { API_URL } from "Constant";
import * as Switch from '@radix-ui/react-switch';
// import * as ToggleGroup from '@radix-ui/react-toggle-group';
import "./style.css"

const DesktopSixPage = () => {
  const notify = (e) => toast(e);
  const navigate = useNavigate();
  const [showinput, setShowInput] = useState(false)
  const [categoryName, setCategoryName] = useState(""); // State for the category name
  const [error, setError] = useState("")
  const [categories, setCategories] = useState([]); // State for the categories

  const toggleInput = () => {
    setShowInput(!showinput);
    setCategoryName("");
    setError("");
  };


  const goback = () => {
    navigate("/admin")
  }

  const toggleinput = () => {
    setShowInput(!showinput)
  }

  const handleInputChange = (e) => {
    setCategoryName(e.target.value); // Update state on input change
    setError(""); // Clear error when user starts typing
  };

  const handleCreateCategory = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/activity/createCategory`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryName }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
        // notify(data.message)
      } else {
        // console.log(data); // Handle success (e.g., update UI or show success message)
        setCategoryName(""); // Clear the input field
        setShowInput(false)
        notify(data.message)
        fetchCategories()
        setError(""); // Clear error
        toggleInput();
      }
    } catch (error) {
      console.error("Error creating category:", error); // Handle error (e.g., show error message)
      notify(error)
    }
  };

  const handleToggleCategory = async (categoryId, isEnabled) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/activity/toggleCategory/${categoryId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isEnabled: !isEnabled }),
      });
      const data = await response.json();
      if (!response.ok) {
        notify(data.message);
      } else {
        notify(data.message);
        fetchCategories();
      }
    } catch (error) {
      console.error("Error toggling category:", error);
      notify("Failed to toggle category");
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/activity/getCategoriesAdmin`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("ye hai data", data)
      if (response.ok) {
        if(data.length >0){

          // Sort categories alphabetically by name
          const sortedCategories = data.sort((a, b) => a.name.localeCompare(b.name));
          setCategories(sortedCategories);
        }
        else {
          notify(data.message);
        }
      } 
      else {
        notify(data.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      notify(error);
    }
  };

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
      fetchCategories(); // Fetch categories when component mounts
    }

    // You may also want to check the validity of the token here if needed

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures that this effect runs only once on mount

  console.log("ye hai posts", categories)

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
            Manage Categories
          </Text>
          <Button className="rounded-xl " onClick={toggleinput}>
            <FontAwesomeIcon icon={showinput ? faCircleXmark : faCirclePlus} className="text-[#546ef6] text-2xl " />
          </Button>
        </div>

        {showinput && (
          <div className="w-11/12 flex flex-col items-center justify-center absolute top-20  z-20">
          <div className={`w-11/12 rounded-xl flex items-center justify-center gap-1 border-[1px] p-1 bg-white-A700/70 ${error ? 'border-[1px] border-red-500' : 'border-gray-500 shadow  shadow-black-900 '}`}>
            <input
              type="text"
              className="w-full rounded-xl outline-none border-0 bg-white-A700/70 "
              onChange={handleInputChange}
              value={categoryName}
            />
            <FontAwesomeIcon
              icon={faSquareCheck}
              className="text-[#546ef6] text-3xl"
              onClick={handleCreateCategory}
            />
          </div>
          {error && <small className="text-red-500 w-11/12  -pt-3 text-left">{error}</small>}
          </div>

        )}
        </div>

        <div className="flex flex-col gap-2.5 items-center justify-start w-11/12 scroller overflow-scroll ">
          
        {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className={`bg-gray-100 p-2 rounded-md w-full flex items-center justify-between overflow-hidden ${category.isEnabled ? 'border-2 border-green-300 shadow-green-glow' : ''}`}>
                <h1>{category.name}</h1>
                
                <Switch.Root
                  className="SwitchRoot"
                  checked={category.isEnabled}
                  onCheckedChange={(checked) => handleToggleCategory(category.id, category.isEnabled)}
                >
                  <Switch.Thumb className="SwitchThumb" />
                </Switch.Root>
                
                {/* <Button className="rounded-xl" onClick={() => handleToggleCategory(category.id, category.isEnabled)}>
                  {category.isEnabled ? "Disable" : "Enable"}
                </Button> */}
              </div>
            ))
          ) : (
            <div className="w-full h-auto flex items-center justify-center p-2">
              <Img className="w-[80%] h-auto object-cover object-center" src="images/nopost.svg" alt="No posts available for endorsement" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopSixPage;
