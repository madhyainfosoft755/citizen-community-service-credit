import React, { useEffect, useState } from "react";

import { Button, Img, List, Text } from "components";
import { API_URL } from "Constant";
// import { Card, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import Location from "pages/Location/Location";
import { useAuth } from "components/AuthProvider/AuthProvider";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { CirclesWithBar } from 'react-loader-spinner'
import { differenceInHours, parse, isSameDay } from 'date-fns'; // Importing necessary functions from date-fns

const Createpost = () => {
  const [selfDeclarationChecked, setSelfDeclarationChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const notify = (e) => toast(e);
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState("");
  const handleDateChange = (e) => {
    setCurrentDate(e.target.value);
  };
  const [categories, setCategories] = useState([]);
  // console.log("these are user categories" , categories)
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { authenticated, setAuthenticated } = useAuth();
  const [userData, setUserData] = useState();
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
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
        // console.log("data", data)
        if (response.ok) {
          if (data.length > 0) {

            const usercategories = userData && userData.userData.category
            // console.log("this is ", usercategories)
            const filterCategories = data.filter(cat => usercategories.includes(cat.name))
            const sortedCategories = filterCategories.sort((a, b) => a.name.localeCompare(b.name));
            const limitedCategories = sortedCategories.slice(0, 6);
            setCategories(limitedCategories);

            // Check if count is less than 6 and add "Others" category
            if (filterCategories.length < 6) {
              const othersCategory = { id: "others", name: "Others" };
              setCategories(prevCategories => [...prevCategories, othersCategory]);
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

  const handleFromTimeChange = (e) => {
    const fromTime = e.target.value;
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
  };

  const handleToTimeChange = (e) => {
    const toTime = e.target.value;
    const toTimeDate = parse(toTime, 'HH:mm', new Date());
    const fromTimeDate = parse(fromTime, 'HH:mm', new Date());

    if (!isSameDay(toTimeDate, fromTimeDate)) {
      toast.error('Time must be within the selected date');
      return;
    }


    const timeDifference = differenceInHours(toTimeDate, fromTimeDate);

    if (timeDifference <= 8 && timeDifference >= 0) {
      setToTime(toTime);
    } else {
      toast.error('To time must be within 8 hours of the from time');
    }
  };

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

  // console.log("ye hai user data", userData)
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
                  className="cursor-pointer font-semibold rounded-3xl w-5/12"
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
                    <h4 className="text-sm">Organization: <small>{userData.userData.organization ? userData.userData.organization : 'NA'}</small></h4>
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
                      max={new Date().toISOString().split('T')[0]} // Restrict to today's date
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
                  <h4 className="text-base font-semibold w-fit h-full flex items-center justify-start ">
                    Add Time:
                  </h4>

                  <div className="relative flex flex-col items-start justify-center w-1/3 ">
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

                      onChange={handleFromTimeChange}
                      className="rounded-lg border-[1px] border-dashed border-[#546ef6] text-xs h-auto w-full "
                    />{" "}
                  </div>

                  <div className="relative flex flex-col items-start justify-center w-1/3 "
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
                      // onClick={(e) => e.target.focus()} // Trigger focus when clicked
                      onChange={handleToTimeChange}
                      min={fromTime}
                      max={maxToTime}
                      className="rounded-lg border-[1px] border-dashed border-[#546ef6] text-xs h-auto w-full "
                    />
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
                        <Text
                          className="text-[13px] text-indigo-A200"
                          size="txtInterMedium13"
                        >
                          {" "}
                          <input
                            className="bg-gray-50_01  flex flex-col items-center justify-end p-1 rounded-[5px] shadow-bs1 w-full"
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
                  <div className="flex flex-1 flex-col  mb-1 items-start justify-start w-full">
                    <Text
                      className="text-sm font-semibold text-gray-900"
                    >
                      Videos
                    </Text>
                    <div className="bg-gray-50_01 border border-dashed border-indigo-500 flex flex-col items-center justify-end p-1 rounded-[5px] shadow-bs1 w-full">
                      <div className="flex flex-row gap-2.5 items-start justify-center mt-0.5 w-full sm:w-full">
                        <Text
                          className="text-[13px] text-indigo-A200"
                          size="txtInterMedium13"
                        >
                          <input
                            className="bg-gray-50_01  flex flex-col items-center justify-end p-1 rounded-[5px] shadow-bs1 w-full"
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

                <div className="flex items-start justify-center gap-1">
                  <input type="checkbox" checked={selfDeclarationChecked}
                    onChange={(e) => setSelfDeclarationChecked(e.target.checked)}
                    className="border-[2px] !border-gray-500 appearance-none checked:border-gray-500 h-4 w-4"
                  />
                  <h1 className="text-xs italic"><span className="text-xs font-bold">Self Declaration:</span> "I hereby declare that this is a non paid voluntary activity that I have done on my own in the interest of general public and social interest and I have submitted true and authentic information only".</h1>
                </div>
                <Button
                  className={`cursor-pointer font-semibold w-full mt-1 sm:mt-0 sm:p-2 mb-1 text-sm text-center rounded-3xl ${selfDeclarationChecked ? "bg-[#546ef6] text-yellow-400 " : "bg-gray-300 text-gray-500"}`}
                  disabled={!selfDeclarationChecked}
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
