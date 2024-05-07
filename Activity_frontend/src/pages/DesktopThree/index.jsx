import React, { useEffect, useState } from "react";

import { Button, Img, List, Text } from "components";
import { API_URL } from "Constant";
// import { Card, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import Location from "pages/Location/Location";
import { useAuth } from "components/AuthProvider/AuthProvider";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

const Createpost = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState("");
  const handleDateChange = (e) => {
    setCurrentDate(e.target.value);
  };
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { authenticated, setAuthenticated } = useAuth();
  const [userData, setUserData] = useState();
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [totalTime, setTotalTime] = useState(""); // Added state for total time
  const [userName, setUserName] = useState(""); // Added state for user name
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);
  const [locationData, setLocationData] = useState({
    city: "",
    state: "",
  });
  const buttons = [
    { id: 1, label: "Gardening" },
    { id: 2, label: "Cleaning" },
    { id: 3, label: "Teaching Poor" },
    { id: 4, label: "Planting Tree" },
    { id: 5, label: "Marathon" },
    { id: 6, label: "SocialActivities" },
  ];

  // Function to get and format the current date
  useEffect(() => {
    const getCurrentDate = () => {
      const dateObj = new Date();
      const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString(
        "default",
        {
          month: "short",
        }
      )} ${dateObj.getFullYear()}`;
      setCurrentDate(formattedDate);
    };

    // Call the function when the component mounts
    getCurrentDate();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log("Photo file", file.name);
  };

  const handleVideoChange = (e) => {
    const videoFile = e.target.files[0];
    setSelectedVideo(videoFile);
    console.log("Video file", videoFile.name);
  };

  const handleLocationChange = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );

      if (response.data && response.data.address) {
        const { city, state } = response.data.address;
        setLocationData({ city, state });

        // Update formData with latitude, longitude, city, and state
        setFormData((prevData) => ({
          ...prevData,
          latitude: latitude,
          longitude: longitude,
        }));
      } else {
        console.error("Error fetching location data");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const handleButtonClick = (label) => {
    setSelectedButton(label);
    setSelectedCategories(label);
  };

  useEffect(() => {
    // Check if both token and user key are present in local storage
    const token = localStorage.getItem("token");
    const userKey = localStorage.getItem("userKey");

    // console.log("token", token)
    // console.log("userkey", userKey)
    if (!token || !userKey) {
      // Redirect to the login page if either token or user key is missing
      navigate("/login");
    } else {
      // Fetch user data when component mounts
      // fetchUserData(token);
      setAuthenticated(true);
    }
  }, []); // Empty dependency array ensures that this effect runs only once on mount

  useEffect(() => {
    const fetchUserData = async (token) => {
      // console.log("kya token aa rha hia", token)
      try {
        const response = await fetch(`${API_URL}/activity/profile`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // console.log("kya response aya", response)
          // Check content type before parsing as JSON
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const userData = await response.json();
            setUserName(userData.userData.name)
            setUserData(userData); // Update user data in the state
          } else {
            console.error("Error fetching user data: Response is not JSON");
            // Handle non-JSON response accordingly
          }
        } else {
          console.error("Error fetching user data:", response.status);
          const errorData = await response.text(); // Get the entire response as text
          console.error("Error details:", errorData);
          // Handle the error accordingly
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (authenticated) {
      fetchUserData(localStorage.getItem("token"));
    }
  }, [authenticated]);

  // Fetch historical data and calculate total time
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const token = localStorage.getItem("token");
        // console.log("token is coming", token)
        if (!token) {
          navigate("/login");
          return;
        }

        if (!userData || !userData.userData) {
          // Handle case where userData is not yet loaded
          return;
        }

        const response = await fetch(
          `${API_URL}/activity/AllDetails/${userData.userData.id}`, // Replace with your actual API endpoint
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const historicalData = await response.json();

          if (Array.isArray(historicalData) && historicalData.length > 0) {
            // Calculate total hours from all historical data
            const totalHours = calculateTotalHours(historicalData);
            setTotalTime(totalHours);
          }
        } else {
          console.error("Error fetching historical data:", response.status);
          // Handle error accordingly
        }
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    };

    fetchHistoricalData();
  }, [userData]);

  // Utility function to calculate total hours from historical data
  const calculateTotalHours = (historicalData) => {
    let totalHours = 0;

    historicalData.forEach((data) => {
      if (data.totalTime) {
        const [hours, minutes, seconds] = data.totalTime.split(":");
        totalHours += parseInt(hours) + parseInt(minutes) / 60;
      }
    });

    return totalHours.toFixed(2); // Limit to two decimal places
  };

  const handleLogout = () => {
    // Clear authentication status, remove token and user key, and redirect to the login page
    setAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userKey");
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object
    const formsDATA = new FormData();
    console.log(formsDATA);
    formsDATA.append("selectedCategories", selectedCategories);
    formsDATA.append("date", currentDate);
    formsDATA.append("photo", selectedFile);
    formsDATA.append("video", selectedVideo);
    formsDATA.append("fromTime", fromTime); // Add fromTime
    formsDATA.append("toTime", toTime); // Add toTime
    formsDATA.append("userId", userData && userData.userData.id);
    // Append latitude and longitude to formData
    formsDATA.append("latitude", formsData.latitude);
    formsDATA.append("longitude", formsData.longitude);

    console.log(formsDATA.get("name"));
    console.log("formData", formsDATA);

    const formDataJson = {};
    for (const [key, value] of formsDATA.entries()) {
      formDataJson[key] = value;
    }

    console.log("form data", formDataJson);

    try {
      const response = await fetch(`${API_URL}/activity/CreateActivity`, {
        method: "POST",
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        body: formsDATA,
        // body:formsDATA.stringify()
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);
        navigate("/activity");
      } else {
        console.error("Error:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const Name = userName.split(" ")[0];


  const direct = () => {
    navigate("/activity");
  };

  // 

  return (
    <>
      {authenticated && (
        <form className="w-screen h-screen   md:w-screen md:h-screen  flex items-center justify-center pt-5 pb-5 sm:w-screen sm:h-screen md:pt-5 md:pb-5 sm:p-0 " onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="hidden">
            <Location onLocationChange={handleLocationChange} />
          </div>

          <div className="w-1/4 h-full  sm:w-full sm:h-full md:w-3/4 md:h-full  lg:w-3/4 lg:h-full  flex flex-col items-center  justify-center  shadow-bs2 shadow-black-900 sm:shadow-none ">
            <div className=" flex flex-col gap-1 items-center justify-start w-full h-full ">
              <div className="bg-gray-50 flex flex-row items-center justify-between p-3 sm:p-5  sm:px-5 w-full ">
                <div className="flex flex-row gap-4 items-center justify-center ml-[1px]">
                  {userData && (
                    <Img
                      className=" sm:w-[58px] sm:h-[52px] md:w-[58px] md:h-[52px] lg:w-[58px] lg:h-[58px]  w-14 h-14 rounded-full object-cover object-top  "
                      src={`${API_URL}/image/${userData.userData.photo}`}
                      alt="image"
                    />
                  )}
                  <div className="flex flex-col items-center justify-center w-3/5">
                    <div className="flex flex-col items-start justify-center w-full">
                      <Text
                        className="text-center text-gray-900 uppercase"
                        size="txtInterSemiBold16Gray900"
                      >
                        {/* {userData && userData.userData.name} */}
                        {Name}
                      </Text>

                      {/* <Text className="text-center  text-gray-900 uppercase text-sm">
                        ID: {userData && userData.userData.id}
                      </Text> */}
                    </div>
                  </div>
                </div>
                <Button
                  className="font-semibold btn-11"
                  shape="round"
                  color="indigo_A200"
                  onClick={direct}
                >
                  {`${totalTime || "0"} hours`}
                </Button>
              </div>
              <div className="bg-gray-50 w-5/6  text-center border-2 border-solid border-zinc-300 rounded-md  ">
                <h1 className="text-md font-semibold">Add New Activity</h1>
              </div>

              <div className="  flex items-center justify-center gap-2 w-5/6 ">
                <h4 className="text-sm font-semibold">
                Time Spent:
                </h4>

                <div className="flex flex-1 flex-col items-start justify-center">
                  <label
                    htmlFor="fromTime"
                    className="text-xs  left-13 ml-2 mt-1 text-gray-500"
                  >
                    From
                  </label>
                  <input
                    type="time"
                    name="fromTime"
                    id="fromTime"
                    value={fromTime}

                    onChange={(e) => setFromTime(e.target.value)}
                    className="rounded-lg border-2 border-dashed text-xs h-6"
                  />{" "}
                </div>

                <div className="flex flex-col items-start justify-center"
                >
                  <label
                    htmlFor="toTime"
                    className="text-xs  ml-2 mt-1 text-gray-500"
                  >
                    To
                  </label>
                  <input
                    type="time"
                    name="toTime"
                    id="toTime"
                    value={toTime}
                    placeholder="To time"
                    onClick={(e) => e.target.focus()} // Trigger focus when clicked
                    onChange={(e) => setToTime(e.target.value)}
                    className="rounded-lg border-2 border-dashed text-xs h-6"
                  />
                </div>
              </div>
              <div className="flex flex-col items-start justify-center sm:gap-1 w-11/12 sm:w-11/12 ">
                <Text
                  className="text-base text-gray-900"
                  size="txtInterSemiBold16Gray900"
                >
                  Select Category
                </Text>
                <div className="flex flex-wrap  items-center justify-between  w-full ">
                  {buttons.map((button) => (
                    <label
                      key={button.id}
                      className={`flex flex-wrap text-sm rounded-[20px] items-center justify-center border-2 overflow-hidden border-double border-white p-2 sm:p-3 m-1 w-36 cursor-pointer ${selectedButton === button.label
                          ? "border-orange-400"
                          : ""
                        }`}
                    >
                      <input
                        type="radio"
                        name="radioButtons"
                        className="hidden"
                        onClick={() => handleButtonClick(button.label)}
                      />
                      <span className="font-semibold">{button.label}</span>
                    </label>
                  ))}
                </div>

                <div className="flex flex-row gap-2 items-center justify-between   w-full p-2 ">
                  <Button
                    className="flex items-center justify-center border-[1px] leading-[normal] text-[12px] font-semibold text-left w-1/2 h-full rounded-md"
                  // onClick={handleLocationClick}
                  >
                    <FontAwesomeIcon icon={faLocationDot} className="pr-3 text-blue-600" />
                    {locationData.city}, {locationData.state}
                  </Button>
                  <input
                    type="date"
                    id="datepicker"
                    name="datepicker"
                    value={currentDate}
                    onChange={handleDateChange}
                    className="w-1/2 h-full px-3 py-2 rounded-md border-[1px] border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <List className="flex items-center justify-center w-full gap-3 ">
                  <div className="flex flex-1 flex-col gap-1 mb-2 items-start justify-start w-full ">
                    <Text
                      className="text-base text-gray-900"
                      size="txtInterSemiBold16Gray900"
                    >
                      Photos
                    </Text>
                    <div className="bg-gray-50_01 border border-dashed border-indigo-500 flex flex-col  items-center justify-end p-2 rounded-[5px] shadow-bs1 w-full">
                      <div className="flex flex-row gap-2.5 items-start justify-center mt-0.5 w-full sm:w-full">
                        <Text
                          className="text-[13px] text-indigo-A200"
                          size="txtInterMedium13"
                        >
                          {" "}
                          <input
                            className="bg-gray-50_01  flex flex-col items-center justify-end p-2 rounded-[5px] shadow-bs1 w-full"
                            name="file"
                            type="file"
                            id="photo"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                          />
                          {/* Upload */}
                        </Text>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-1 mb-2 items-start justify-start w-full">
                    <Text
                      className="text-base text-gray-900"
                      size="txtInterSemiBold16Gray900"
                    >
                      Videos
                    </Text>
                    <div className="bg-gray-50_01 border border-dashed border-indigo-500 flex flex-col items-center justify-end p-2 rounded-[5px] shadow-bs1 w-full">
                      <div className="flex flex-row gap-2.5 items-start justify-center mt-0.5 w-full sm:w-full">
                        {/* <Img
                          className="h-3 w-3"
                          src="images/img_twitter.svg"
                          alt="twitter"
                        /> */}

                        <Text
                          className="text-[13px] text-indigo-A200"
                          size="txtInterMedium13"
                        >
                          <input
                            className="bg-gray-50_01  flex flex-col items-center justify-end p-2 rounded-[5px] shadow-bs1 w-full"
                            type="file"
                            id="video"
                            accept="video/*"
                            multiple
                            onChange={handleVideoChange}
                          />
                          {/* Upload */}
                        </Text>
                      </div>
                    </div>
                  </div>
                </List>
                {/* <Text
                    className="mt-[27px] text-base text-gray-900"
                    size="txtInterSemiBold16Gray900"
                  >
                    Add Hours Spent
                  </Text> */}
                <Button
                  className="cursor-pointer font-semibold w-full mt-3 mb-3 text-base text-center"
                  shape="round"
                  color="indigo_A200"
                >
                  SUBMIT
                </Button>
              <Button
                className="cursor-pointer font-semibold w-full  text-base text-center"
                shape="round"
                color="indigo_A200"
                onClick={handleLogout} // Add logout functionality
              >
                LOGOUT
              </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default Createpost;
