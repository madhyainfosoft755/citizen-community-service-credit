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
import { toast } from "react-toastify";
import { CirclesWithBar } from 'react-loader-spinner'

const Createpost = () => {
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const [password, setPassword] = useState("");
  const notify = (e) => toast(e);
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState("");
  const handleDateChange = (e) => {
    setCurrentDate(e.target.value);
  };
  const [categories, setCategories] = useState([]);
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
  // const buttons = [
  //   { id: 1, label: "Gardening" },
  //   { id: 2, label: "Cleaning" },
  //   { id: 3, label: "Teaching Poor" },
  //   { id: 4, label: "Planting Tree" },
  //   { id: 5, label: "Marathon" },
  //   { id: 6, label: "Social Activities" },
  // ];

  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch categories from the database
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/activity/getCategories`);
        const data = await response.json();
        // console.log("data", data)
        if (response.ok) {
          if (data.length > 0) {

            const sortedCategories = data.sort((a, b) => a.name.localeCompare(b.name));
            const limitedCategories = sortedCategories.slice(0, 6);
            setCategories(limitedCategories);
          }
          else {
            // notify(data.message)
            console.log(data.message)

          }

        } else {
          console.error("Error fetching categories:", data.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    // console.log("Photo file", file.name);
  };

  const handleVideoChange = (e) => {
    const videoFile = e.target.files[0];
    setSelectedVideo(videoFile);
    // console.log("Video file", videoFile.name);
  };

  const handleLocationChange = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GoogleGeocode}`
      );

      if (response.data && response.data.results) {
        const addressComponents = response.data.results[0].address_components;
        const cityObj = addressComponents.find(component =>
          component.types.includes('locality')
        );
        const stateObj = addressComponents.find(component =>
          component.types.includes('administrative_area_level_1')
        );

        const city = cityObj ? cityObj.long_name : 'Unknown City';
        const state = stateObj ? stateObj.long_name : 'Unknown State';

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

  const handleButtonClick = (name) => {
    setSelectedButton(name);
    setSelectedCategories(name);
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

    // console.log("token", token)
    // console.log("userkey", userKey)
    if (!token || !userKey) {
      // Redirect to the login page if either token or user key is missing
      navigate("/login");
    } else {
      // Fetch user data when component mounts
      // fetchUserData(token);
      setAuthenticated(true);
      checkTokenExpiry(token);
    }
  }, [userData]); // Empty dependency array ensures that this effect runs only once on mount

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

  useEffect(() => {
    const totalTimeSpent = async (userId) => {
      try {
        if (userData && userData.userData) {
          const token = localStorage.getItem("token");
          const response = await fetch(`${API_URL}/activity/TotalTimeSpent/${userData.userData.id}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = await response.json();
          if (response.ok) {
            setTotalTime(data.totalTimeSum)
          }
        }
      }
      catch (error) {
        console.error("Error fetching user total time", error);
        setError("An error occurred while fetching users Time.");
      }
    }
    totalTimeSpent()
  }, [userData])




  // Function to fetch user data and check if confirm is true
  const checkUserConfirmation = async () => {
    // console.log("checking")
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/activity/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = await response.json();
      // console.log("kya hia ", userData)
      if (response.ok) {
      } else {
        console.error("Error fetching user data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    checkUserConfirmation();
  }, []);





  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object
    const formsDATA = new FormData();
    // console.log(formsDATA);
    formsDATA.append("selectedCategories", selectedCategories);
    formsDATA.append("date", currentDate);
    formsDATA.append("photo", selectedFile);
    formsDATA.append("video", selectedVideo);
    formsDATA.append("fromTime", fromTime); // Add fromTime
    formsDATA.append("toTime", toTime); // Add toTime
    // formsDATA.append("userId", userData && userData.userData.id);
    // Append latitude and longitude to formData
    formsDATA.append("latitude", formsData.latitude);
    formsDATA.append("longitude", formsData.longitude);

    // console.log(formsDATA.get("name"));
    // console.log("formData", formsDATA);

    const formDataJson = {};
    for (const [key, value] of formsDATA.entries()) {
      formDataJson[key] = value;
    }

    // console.log("form data", formDataJson);
    const token = localStorage.getItem("token");
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/activity/CreateActivity`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,

        },
        body: formsDATA,
        // body:formsDATA.stringify()
      });

      const data = await response.json();
      if (response.ok) {
        // console.log("Success:", data);
        notify(data.message)
        navigate("/activity");
      } else {
        console.error("Error:", data.error);
        notify(`${data.error}`)
      }
    } catch (error) {
      console.error("Error:", error);
    }
    finally {
      setIsLoading(false)
    }
  };
  //CREATE A CODE THAT CHECKS IF THE USERS TOKEN HAS EXPIRED AND IF IT IS EXPIRED THEN THE USER SHOULD BE LOGGED OUT AND REDIRECTED TO THE LOGIN PAGE?

  const Name = userName.split(" ")[0];


  const direct = () => {
    navigate("/activity");
  };

  const Endorse = () => {
    navigate("/endorse")
  }

  const [textIndex, setTextIndex] = useState(0);
  const carouselTexts = [`${totalTime || 0} Hours`, 'My Activity']; // Add your carousel text here

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % carouselTexts.length);
    }, 2000); // Change text every 2 seconds

    return () => clearInterval(interval);
  }, []);
  // 

  console.log("ye hai user data", userData)
  return (
    <>
      {authenticated && (
        <form className="w-screen h-screen   md:w-screen md:h-screen flex items-center justify-center pt-5 pb-5 sm:w-screen sm:h-screen md:pt-5 md:pb-5 sm:p-0 " onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="hidden">
            <Location onLocationChange={handleLocationChange} />
          </div>


          <div className="relative w-4/12 h-full sm:w-full sm:h-full md:w-3/4 md:h-full  lg:w-3/4 lg:h-full  flex flex-col items-center  justify-center border-[1px]  rounded-lg sm:rounded-none overflow-hidden">
            {isLoading && (
              <div className="w-full h-full bg-black-900/30 absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                <CirclesWithBar
                  height="100"
                  width="100"
                  color="#4fa94d"
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
                  type="button"
                  className="cursor-pointer font-semibold rounded-3xl w-4/12"
                  // shape="round"
                  color="indigo_A200"
                  onClick={direct}
                >
                  {carouselTexts[textIndex]}
                </Button>
              </div>

              <div className="flex flex-col items-start justify-center gap-1 sm:gap-1 w-11/12  sm:w-11/12 mt-1  ">
                <div className="bg-white-A700 w-full  text-center flex items-start justify-between gap-5">
                  <h1 className="text-md font-semibold shadow-bs3 shadow-gray-300 py-1  w-1/2 h-full flex items-center justify-center rounded-3xl mb-2">+ Add New Activity</h1>
                  <button type="button" onClick={Endorse} className="bg-[#546ef6] w-1/2 h-full font-semibold rounded-3xl text-white-A700">Endorse Activities</button>
                </div>

                <div className="w-full flex items-center justify-between">
                <Text
                  className="text-base text-gray-900"
                  size="txtInterSemiBold16Gray900"
                >
                  Select Category
                </Text>
                  {userData && (
                <small>Organization: <span>{userData.userData.organization ? userData.userData.organization: 'NA'}</span></small>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-between  w-full">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className={`flex flex-wrap text-sm rounded-lg items-center justify-center border-2 overflow-hidden border-double border-white mt-1 w-5/12 px-5 py-2 sm:px-5 sm:py-3 cursor-pointer ${selectedCategories === category.name ? "border-[1px] border-[#546ef6] text-[#546ef6] bg-sky-50/40" : ""} `}
                    >
                      <input
                        type="radio"
                        name="radioButtons"
                        className="hidden"
                        onClick={() => handleButtonClick(category.name)}
                      />
                      <span className="font-medium">{category.name}</span>
                    </label>
                  ))}
                  {/* {buttons.map((button) => (
                    <label
                      key={button.id}
                      className={`flex flex-wrap text-sm rounded-lg items-center justify-center border-2 overflow-hidden border-double border-white mt-1 w-5/12 px-5 py-2  sm:px-5 sm:py-3  cursor-pointer ${selectedButton === button.label
                        ? "border-[1px] border-[#546ef6] text-[#546ef6] bg-sky-50/40" : ""} `}
                    >
                      <input
                        type="radio"
                        name="radioButtons"
                        className="hidden"
                        onClick={() => handleButtonClick(button.label)}
                      />
                      <span className="font-medium">{button.label}</span>
                    </label>
                  ))} */}
                </div>

                <div className="flex flex-row gap-2 items-center justify-between   w-full  mt-4 mb-4">
                  <div className="relative w-1/2 h-full  bg-cyan-50">
                    <h1 className="absolute  -top-5 left-0  text-sm">Location</h1>
                    <Button
                      type="button"
                      className="flex items-center justify-center bg-[#eff2ff] border-[1px] leading-[normal] text-[12px] font-semibold text-left w-full h-full rounded-md"
                    // onClick={handleLocationClick}
                    >
                      <FontAwesomeIcon icon={faLocationDot} className="pr-3 text-blue-600" />
                      {locationData.city}, {locationData.state}
                    </Button>
                  </div>

                  <div className="relative w-1/2 h-full">
                    <input
                      type="date"
                      id="datepicker"
                      name="datepicker"
                      value={currentDate}
                      onChange={handleDateChange}
                      className="w-full h-full px-3 py-2 bg-[#eff2ff] text-sm shadow-sm shadow-black-900/10 rounded-md border-[1px] border-gray-300 focus:outline-none focus:border-blue-500 appearance-none"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className={`absolute -top-5 left-0 text-sm ${currentDate ? 'text-gray-700' : 'text-gray-500'}`}>
                        Select Date
                      </span>
                    </div>
                  </div>
                </div>
                <div className="  flex items-center justify-between  gap-2 w-full ">
                  <h4 className="text-base font-semibold w-1/5 h-full flex items-center justify-start">
                    Add Time:
                  </h4>

                  <div className="relative flex flex-col items-start justify-center w-1/3 h-full">
                    <label
                      htmlFor="fromTime"
                      className="absolute -top-5 -left-1 text-xs  left-13 ml-2 mt-1 text-gray-500"
                    >
                      From
                    </label>
                    <input
                      type="time"
                      name="fromTime"
                      id="fromTime"
                      value={fromTime}

                      onChange={(e) => setFromTime(e.target.value)}
                      className="rounded-lg border-[1px] border-dashed border-[#546ef6] text-xs h-8 w-full "
                    />{" "}
                  </div>

                  <div className="relative flex flex-col items-start justify-center w-1/3"
                  >
                    <label
                      htmlFor="toTime"
                      className="absolute -top-5 -left-1 text-xs  ml-2 mt-1 text-gray-500"
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
                      className="rounded-lg border-[1px] border-dashed border-[#546ef6] text-xs h-8 w-full"
                    />
                  </div>
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
                  className="cursor-pointer font-semibold w-full mt-3 mb-1 text-sm text-center rounded-3xl"
                  // shape="round"
                  color="indigo_A200"
                >
                  SUBMIT
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
