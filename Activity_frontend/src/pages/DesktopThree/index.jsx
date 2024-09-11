import React, { useEffect, useRef, useState } from "react";

import { Button, Img, List, Text } from "components";
import { API_URL, APP_PATH } from "Constant";
// import { Card, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import Location from "pages/Location/Location";
import { useAuth } from "components/AuthProvider/AuthProvider";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faUser } from "@fortawesome/free-solid-svg-icons";
// import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { CirclesWithBar } from 'react-loader-spinner'
import { differenceInHours, parse, isSameDay, format, isEqual } from 'date-fns'; // Importing necessary functions from date-fns
import PopupComponent from "components/popup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TimePicker } from "react-ios-time-picker"
import "./style.css"
import imageCompression from 'browser-image-compression';
import { convertToHours } from "utils";
import Select from "react-select";



const Createpost = () => {
  const [imageLoaded, setImageLoaded] = useState(true);
  const dateInputRef = useRef(null); // Ref for the date input
  const [showCalendar, setShowCalendar] = useState(false); // State for calendar visibility
  const [isPopUpVisible, setIsPopUpVisible] = useState(false); // State for pop-up visibility
  const [selectedPost, setSelectedPost] = useState(null); // State for selected post
  const [selfDeclarationChecked, setSelfDeclarationChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const notify = (e) => toast(e);
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const handleDateChange = (value) => {
    setCurrentDate(value);
  };
  const [categories, setCategories] = useState([]);
  // console.log("these are user categories" , categories)
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { authenticated, setAuthenticated } = useAuth();
  const [userData, setUserData] = useState({ userData: {} });
  const [maxToTime, setMaxToTime] = useState(""); // Added state for max to time
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
  const [locationData, setLocationData] = useState({
    city: "",
    state: "",
  });
  const [error, setError] = useState(null);
  const [description, setDescription] = useState("");
  const [organization, setOrganizations] = useState();
  const [selectedOrganization, setSelectedOrganization] = useState()
  // Utility function to get the current time in HH:mm format
  const getCurrentTime = () => {
    const now = new Date();
    return format(now, 'HH:mm');
  };

  const [fromTime, setFromTime] = useState(getCurrentTime());
  const [toTime, setToTime] = useState(getCurrentTime());


  useEffect(() => {
    // Function to handle clicks outside the date input
    const handleClickOutside = (event) => {
      if (dateInputRef.current && !dateInputRef.current.contains(event.target)) {
        setShowCalendar(false); // Close calendar if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Listen for clicks

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup on unmount
    };
  }, []);


  // Function to handle date input click
  const handleDateInputClick = () => {
    setShowCalendar(true); // Open calendar when input is clicked
  };


  const handleInputChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length <= 300) {
      setDescription(inputText);
    }
  };
  const remainingChars = 300 - description.length;

  // console.log("user categoriees", userData.userData.category)

  // Fetch categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/activity/getCategories`);
        const data = await response.json();

        if (response.ok) {
          if (data.length > 0) {
            const userCategories = userData?.userData.category || [];
            const filteredCategories = data.filter(cat => userCategories.includes(cat.name));
            const sortedCategories = filteredCategories.sort((a, b) => a.name.localeCompare(b.name));
            const limitedCategories = sortedCategories.slice(0, 6);

            // Check if "Other" category is already included
            const hasOtherCategory = filteredCategories.some(cat => cat.name.toLowerCase() === "other");

            if (limitedCategories.length < 6 && !hasOtherCategory) {
              const othersCategory = { id: "other", name: "Other" };
              setCategories([...limitedCategories, othersCategory]);
            } else {
              setCategories(limitedCategories);
            }
          } else {
            console.log(data.message);
          }
        } else {
          console.error("Error fetching categories:", data.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (userData) {
      fetchCategories();
    }
  }, [userData]);

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
      // notify(error)
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
    // Fetch organizations from the database
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(`${API_URL}/activity/getOrganizations`);
        const data = await response.json();
        if (response.ok) {
          setOrganizations(data.map((value) => {
            return { value: value.id, label: value.name };
          })); // Ensure data is an array
        } else {
          console.error("Error fetching organizations:", data.message);
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };
    fetchOrganizations();
  }, []);

  const convertTo24HourFormat = (time) => {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}`;
  };

  /**
 * Function to calculate the time difference between two times
 * @param {string} startTime - The start time in "HH:MM:SS" format
 * @param {string} endTime - The end time in "HH:MM:SS" format
 * @returns {object} An object containing the difference in hours, minutes, and seconds
 */
  function getTimeDifference(startTime, endTime) {
    // Convert time strings to Date objects
    const start = new Date(`1970-01-01T${startTime}Z`);
    const end = new Date(`1970-01-01T${endTime}Z`);

    // Calculate the difference in milliseconds
    let differenceInMs = end - start;

    // If the end time is before the start time, add 24 hours to the end time
    if (differenceInMs < 0) {
      differenceInMs += 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    }

    // Calculate hours, minutes, and seconds from the difference
    const hours = Math.floor(differenceInMs / (1000 * 60 * 60));
    const minutes = Math.floor((differenceInMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((differenceInMs % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  }
  // console.log("what is the description", description)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    if (!selectedFile) {
      // notify("Please upload a photo ");
      return;
    }
    const compressedFile = await imageCompression(selectedFile, options);

    // const timeDifference = differenceInHours(toTime, fromTime);
    // console.log(fromTime, toTime);
    if (fromTime == toTime) {
      toast.error("from time and to time can not be same ");
      return;
    }
    // Create FormData object
    const formsDATA = new FormData();
    // console.log(formsDATA);
    formsDATA.append("selectedCategories", selectedCategories);
    formsDATA.append("date", currentDate);
    formsDATA.append("photo", compressedFile, selectedFile.name);
    formsDATA.append("video", selectedVideo);
    formsDATA.append("fromTime", fromTime); // Add fromTime
    formsDATA.append("toTime", toTime); // Add toTime
    // formsDATA.append("userId", userData && userData.userData.id);
    // Append latitude and longitude to formData
    formsDATA.append("latitude", formsData.latitude);
    formsDATA.append("longitude", formsData.longitude);
    formsDATA.append("description", description);
    formsDATA.append("organization", selectedOrganization);

    // console.log(formsDATA.get("name"));
    // console.log("formData", formsDATA);

    // const formDataJson = {};
    // for (const [key, value] of formsDATA.entries()) {
    //   formDataJson[key] = value;
    // }





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
        const timeSpent = getTimeDifference(fromTime, toTime)
        // notify(data.message)
        navigate("/activity", { state: { timeSpent, data } });
      } else {
        console.error("Error:", data.error);
        // notify(`${data.error}`)
      }
    } catch (error) {
      console.error("Error:", error);
    }
    finally {
      setIsLoading(false)
    }
  };

  const handleOrganizationChange = (selectedOptions) => {
    setSelectedOrganization(selectedOptions);
    console.log('Selected organizations:', selectedOptions);
    // You can perform other actions with selectedOptions here
  };

  const timeOptions = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      const hour = String(i).padStart(2, "0");
      const minute = String(j).padStart(2, "0");
      const timeOption = `${hour}:${minute}`;
      timeOptions.push(timeOption);
    }
  }

  const Name = userName.split(" ")[0];


  const direct = () => {
    navigate("/activity");
  };

  const Endorse = () => {
    navigate("/endorse");
  }

  const [textIndex, setTextIndex] = useState(0);
  const carouselTexts = [`${totalTime || 0} Hours`, 'My Activity']; // Add your carousel text here

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTextIndex((prevIndex) => (prevIndex + 1) % carouselTexts.length);
  //   }, 2000); // Change text every 2 seconds

  //   return () => clearInterval(interval);
  // }, []);

  // console.log("ye hai user data", userData)

  const openProfilePopup = () => {
    // if (userData && userData.userData) {
    //   setSelectedPost({ photos: userData.userData.photo });
    //   setIsPopUpVisible(true);
    // }
    // navigate("/userprofile")
  };

  const onChangeFromTime = (timeValue) => {
    const fromTime = timeValue;
    setFromTime(fromTime);

    const fromTime24 = convertTo24HourFormat(fromTime);
    const [hours, minutes] = fromTime24.split(':');
    const fromTimeDate = new Date();
    fromTimeDate.setHours(parseInt(hours));
    fromTimeDate.setMinutes(parseInt(minutes));
    fromTimeDate.setSeconds(0);

    const maxToTimeDate = new Date(fromTimeDate.getTime() + 8 * 60 * 60 * 1000);
    const maxHours = String(maxToTimeDate.getHours()).padStart(2, '0');
    const maxMinutes = String(maxToTimeDate.getMinutes()).padStart(2, '0');
    const maxToTime = `${maxHours}:${maxMinutes}`;

    setMaxToTime(maxToTime);
  }

  const onChangeToTime = (timeValue) => {
    const toTime = timeValue;
    const toTimeDate = parse(toTime, 'HH:mm', new Date());
    const fromTimeDate = parse(fromTime, 'HH:mm', new Date());

    if (!isSameDay(toTimeDate, fromTimeDate)) {
      toast.error('Time must be within the selected date');
      return;
    }
    if (isEqual(toTimeDate, fromTimeDate)) {
      toast.error('Both times cannot be the same. Please select a time later than the from time.');
      return;
    }

    const timeDifference = differenceInHours(toTimeDate, fromTimeDate);

    if (timeDifference <= 8 && timeDifference >= 0) {
      setToTime(toTime);
    } else {
      toast.error('To time must be within 8 hours of the from time');
    }
  }


  const handleLogout = () => {
    // Clear authentication status, remove token and user key, and redirect to the login page
    setAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userKey");
    navigate("/login");
  };

  const customStyles = {
    menu: (provided) => ({
      ...provided,
      maxHeight: 100, // Set the max height of the dropdown list
      overflowY: 'auto', // Enable vertical scrolling
    }),
  };




  return (
    <>
      {authenticated && (
        <form className="w-screen h-screen   md:w-screen md:h-screen flex items-center justify-center pt-5 pb-5 sm:w-screen sm:h-screen md:pt-5 md:pb-5 sm:p-0 " onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="hidden">
            <Location onLocationChange={handleLocationChange} />
          </div>

          {isPopUpVisible && (
            <PopupComponent post={selectedPost} onClose={() => setIsPopUpVisible(false)} />
          )}

          <div className=" scroller relative w-4/12 h-full sm:w-full sm:h-full md:w-3/4 md:h-full  lg:w-3/4 lg:h-full flex flex-col items-center justify-start gap-2 border-[1px]  rounded-lg sm:rounded-none overflow-auto">
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

            <div className="bg-gray-50 flex flex-row items-center justify-between p-3   sm:px-2 w-full ">

              <div className="  flex gap-3 items-center justify-center " onClick={openProfilePopup}>

                {userData && userData.userData && (
                  userData.userData.photo && imageLoaded ? (
                    <Img
                      className="cursor-pointer w-14 h-14 rounded-full object-cover object-top"
                      src={`${API_URL}/image/${userData.userData.photo}`}
                      alt="User Photo"
                      onClick={() => { navigate("/users-profile") }}
                      onError={() => setImageLoaded(false)}
                    />
                  ) : (
                    <div className="bg-white-A700 w-16 h-14 rounded-full flex items-center justify-center">

                    <FontAwesomeIcon
                      icon={faUser}
                      className="ri-user-fill h-1/2 cursor-pointer text-gray-600"
                      onClick={() => { navigate("/users-profile") }}
                    />
                    </div>
                  )
                )}
                <div className="flex flex-col items-center justify-center w-3/5">
                  <div className=" cursor-default flex flex-col items-start justify-center w-full">
                    <Text
                      className="text-center text-gray-900 uppercase"
                      size="txtInterSemiBold16Gray900"
                    >
                      {Name}
                    </Text>
                  </div>
                </div>
              </div>


              <Button
                type="button"
                className="cursor-pointer font-semibold rounded-3xl  text-blue-500 bg-white-A700 text-xs"
                // color="indigo_A200"
                onClick={direct}
              >
                {`${totalTime || 0} Hrs | ${totalTime && convertToHours(totalTime)} Pts`}
                {/* <FontAwesomeIcon icon={faLocationDot} className="pr-3 text-blue-600" /> */}
              </Button>
              <img src={APP_PATH + "images/2.png"} className=" w-14 h-14 rounded-full" alt="" />

            </div>

            <div className=" flex flex-col gap-3  items-center justify-start w-full h-full overflow-auto scroller">
              <div className="flex flex-col items-center justify-start md:gap-8 gap-4 sm:gap-6 w-11/12 h-full sm:w-11/12 mt-1  ">
                <div className="bg-white-A700 w-full  text-center flex items-start justify-between gap-5">
                  <h1 className="text-sm font-semibold bg-[#546ef6] text-white-A700  py-1  w-1/2 h-full flex items-center justify-center rounded-3xl mb-2">+ Add New Activity</h1>
                  <button type="button" onClick={Endorse} className={`text-sm text-black-900 shadow-bs3 shadow-gray-300 w-1/2 h-full font-semibold rounded-3xl hover:bg-[#546ef6] hover:text-white-A700`}>Endorse Activities</button>
                </div>

                <div className="w-full flex items-center justify-between">
                  <Text
                    className="text-sm text-gray-900 font-semibold"
                  >
                    Select Category
                  </Text>
                  {userData && (
                    <h4 className="text-sm font-semibold">Organization: <small className="font-thin">{userData.userData.organization ? userData.userData.organization : 'NA'}</small></h4>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-between w-full">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <label
                        key={category.id}
                        className={`flex flex-wrap text-xs text-center rounded-lg items-center justify-center border-2 overflow-hidden border-double border-white mt-1 w-5/12 px-5 py-2 sm:px-5 sm:py-2 cursor-pointer ${selectedCategories === category.name ? "border-[1px] border-[#546ef6] text-[#546ef6] bg-sky-50/40" : ""}`}
                      >
                        <input
                          type="radio"
                          name="radioButtons"
                          className="hidden"
                          onClick={() => handleButtonClick(category.name)}
                        />
                        <span className="font-medium">{category.name}</span>
                      </label>
                    ))
                  ) : (
                    <div className="w-full text-center py-4">
                      No categories to display
                    </div>
                  )}
                </div>

                <div className="w-full flex items-center justify-center border-[1px] px-1 rounded-md">
                  <small className="font-bold inline">Description:</small>
                  <input
                    type="text"
                    name="description"
                    placeholder="Add description for the selected category"
                    className="w-full h-8 border-none text-xs text-center"
                    value={description}
                    onChange={handleInputChange}
                  />
                  <span className="text-xs text-gray-500 ">{description.length}/300</span>

                </div>
                <div className="flex flex-row gap-2 items-center justify-between   w-full  mt-4 mb-4">
                  <div className="relative w-1/2 h-full  bg-cyan-50">
                    <h1 className="absolute  -top-5 left-0  text-sm">Location</h1>
                    <Button
                      type="button"
                      className=" cursor-default flex items-center justify-center bg-[#eff2ff] border-[1px] leading-[normal] text-[12px] font-semibold text-left w-full h-full rounded-md"
                    // onClick={handleLocationClick}
                    >
                      <FontAwesomeIcon icon={faLocationDot} className="pr-3 text-blue-600" />
                      {locationData.city}, {locationData.state}
                    </Button>
                  </div>

                  <div className="relative w-1/2 h-full border-[1px] rounded-md bg-[#eff2ff] shadow flex items-center justify-center">
                    <DatePicker
                      selected={currentDate}
                      onChange={handleDateChange}
                      maxDate={new Date()} // Restrict to today's date
                      // showYearDropdown
                      dateFormat="dd/MM/yyyy"
                      id="date"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className={`absolute -top-5 left-0 text-sm ${currentDate ? 'text-gray-700' : 'text-gray-500'}`}>
                        Select Date
                      </span>
                    </div>
                  </div>
                </div>
                <div className="  flex items-center justify-between  gap-2 w-full ">
                  <h4 className="text-sm font-semibold w-fit h-full flex items-center justify-start ">
                    Add Time:
                  </h4>

                  <div className="relative flex flex-col items-start justify-center w-1/3 ">
                    <label
                      htmlFor="fromTime"
                      className="absolute -top-5 -left-1 text-xs  left-13 ml-2 mt-1 text-gray-500"
                    >
                      From
                    </label>
                    {/* <input
                      type="time"
                      name="fromTime"
                      id="fromTime"
                      value={fromTime}
                      onClick={(e) => e.target.focus()}
                      onChange={handleFromTimeChange}
                      className="rounded-lg border-[1px] border-dashed border-[#546ef6] text-xs h-auto w-full "
                    />{" "} */}
                    <TimePicker onChange={onChangeFromTime} value={fromTime} id="fromtime" />

                  </div>

                  <div className="relative flex flex-col items-start justify-center w-1/3 "
                  >
                    <label
                      htmlFor="toTime"
                      className="absolute -top-5 -left-1 text-xs  ml-2 mt-1 text-gray-500"
                    >
                      To
                    </label>
                    <TimePicker name="toTime" onChange={onChangeToTime} value={toTime} id="totime" min={fromTime} />
                  </div>
                </div>
                <div className="w-full h-auto flex flex-col items-center justify-center relative">
                  <label className="block font-semibold mb-1 text-left w-full">
                    Organization:
                  </label>

                  <div className="w-full">
                    {organization && (
                      <Select

                        name="options"
                        options={organization}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        id="organization"
                        onChange={handleOrganizationChange}
                        styles={customStyles}
                      />
                    )}
                  </div>
                </div>
                <List className="flex items-center justify-center w-full gap-3 ">
                  <div className="flex flex-1 flex-col mb-1 items-start justify-start w-full ">
                    <Text
                      className="text-sm font-semibold text-gray-900"
                    >
                      Photos
                    </Text>
                    <div className="bg-gray-50_01 border border-dashed border-indigo-500 flex flex-col  items-center justify-end p-1 rounded-[5px] shadow-bs1 w-full">
                      <div className="flex flex-row gap-2.5 items-start justify-center mt-0.5 w-full sm:w-full">

                        <input
                          className="bg-gray-50_01  flex flex-col items-center justify-end p-1 rounded-[5px] shadow-bs1 w-full text-xs"
                          name="file"
                          type="file"
                          id="photo"
                          accept="image/*"
                          multiple
                          onChange={handleFileChange}
                          required
                        />
                        {/* Upload */}
                      </div>
                    </div>
                  </div>
                  {/* <div className="flex flex-1 flex-col  mb-1 items-start justify-start w-full">
                    <Text
                      className="text-sm font-semibold text-gray-900"
                    >
                      Videos
                    </Text>
                    <div className="bg-gray-50_01 border border-dashed border-indigo-500 flex flex-col items-center justify-end p-1 rounded-[5px] shadow-bs1 w-full">
                      <div className="flex flex-row gap-2.5 items-start justify-center mt-0.5 w-full sm:w-full">

                        <input
                          className="bg-gray-50_01 flex flex-col items-center justify-end p-1 rounded-[5px] shadow-bs1 w-full text-xs"
                          type="file"
                          id="video"
                          accept="video/*"
                          multiple
                          onChange={handleVideoChange}
                        />
                      </div>
                    </div>
                  </div> */}
                </List>

                <div className="flex items-start justify-center gap-1 ">
                  <input type="checkbox" checked={selfDeclarationChecked}
                    onChange={(e) => setSelfDeclarationChecked(e.target.checked)}
                    className="border-[1px] !border-gray-500 border-solid appearance-none checked:border-gray-500 h-4 w-4"
                  // style={{border:"1px solid gray" }}
                  />
                  <h1 className="text-xs italic leading-1"><span className="text-xs font-bold">Self Declaration:</span> "I hereby declare that this is a non paid voluntary activity that I have done on my own in the interest of general public and social interest and I have submitted true and authentic information only".</h1>
                </div>
                <div className="flex flex-col gap-3 items-center justify-center w-full ">

                  <Button
                    className={`cursor-pointer font-semibold w-1/2 mt-1 sm:mt-0 sm:p-2  text-sm text-center rounded-3xl tracking-widest ${selfDeclarationChecked ? "bg-[#546ef6] text-white-A700 " : "bg-gray-300 text-gray-500"}`}
                    disabled={!selfDeclarationChecked}
                  >
                    SUBMIT
                  </Button>

                  <button onClick={handleLogout} className=" bg-[#546ef6] text-sm tracking-widest font-semibold text-white-A700 w-1/2 py-3  mb-2 rounded-full">
                    LOGOUT
                  </button>
                </div>

              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default Createpost;
