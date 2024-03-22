import React, { useEffect, useState } from "react";

import { Button, Img, List, Text } from "components";
import { API_URL } from "Constant";
// import { Card, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import Location from "pages/Location/Location";
import { useAuth } from "components/AuthProvider/AuthProvider";

const Createpost = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { authenticated, setAuthenticated } = useAuth();
  const [userData, setUserData] = useState();
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  // const [calculatedTime, setCalculatedTime] = useState("0 Hours");
  // const [storedTime, setStoredTime] = useState("");

  const [totalTime, setTotalTime] = useState(""); // Added state for total time


  useEffect(() => {
    // Fetch historical data and calculate total time
    const fetchHistoricalData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
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



  
  useEffect(() => {
    // Function to get and format the current date

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

  // const myInputRef = React.createRef();
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

  // console.log(formsData);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log("Photo file", file.name);
  };
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleVideoChange = (e) => {
    const videoFile = e.target.files[0];
    setSelectedVideo(videoFile);
    console.log("Video file", videoFile.name);
  };

  const handleLocationChange = (address) => {
    setFormData((prevData) => ({
      ...prevData,
      address: address,
    }));
    // console.log(location)
  };

  const [selectedButton, setSelectedButton] = useState(null);

  const buttons = [
    { id: 1, label: "Gardening" },
    { id: 2, label: "Cleaning" },
    { id: 3, label: "Teaching Poor" },
    { id: 4, label: "Planting Tree" },
    { id: 5, label: "Marathon" },
    { id: 6, label: "Social Activities" },
  ];

  const handleButtonClick = (label) => {
    setSelectedButton(label);
    setSelectedCategories(label);
  };

  // const [buttonStates, setButtonStates] = useState(Array(6).fill(false)); // Assuming 3 buttons, adjust the size as needed

  // const handleButtonClick = (index, value) => {
  //   setButtonStates(3);

  //   setSelectedCategories(value);
  // };

  // const handleInputChange = (e) => {
  //   // Check if e and e.target are defined
  //   console.log("handle inpu cahe", e);
  //   if (e && e.target) {
  //     const { name, value } = e.target;

  //     // Check if name is defined before updating state
  //     if (name !== undefined) {
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         [name]: value,
  //       }));
  //     }
  //   }
  // };

  useEffect(() => {
    // Check if both token and user key are present in local storage
    const token = localStorage.getItem("token");
    const userKey = localStorage.getItem("userKey");

    if (!token || !userKey) {
      // Redirect to the login page if either token or user key is missing
      navigate("/login");
    } else {
      // Fetch user data when component mounts
      fetchUserData(token);
    }

    // You may also want to check the validity of the token here if needed
  }, []); // Empty dependency array ensures that this effect runs only once on mount

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(
        `${API_URL}/activity/profile`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Check content type before parsing as JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const userData = await response.json();

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
    // formsDATA.append('selectedActivity', selectedActivity);
    formsDATA.append("name", formsData.name);
    formsDATA.append("email", formsData.email);
    formsDATA.append("selectedCategories", (selectedCategories));

    formsDATA.append("date", currentDate);
    formsDATA.append("photo", selectedFile);
    formsDATA.append("video", selectedVideo);
    formsDATA.append("fromTime", fromTime); // Add fromTime
    formsDATA.append("toTime", toTime); // Add toTime
    formsDATA.append("userId", userData && userData.userData.id);
    formsDATA.append("location", formsData.address); // Include location data

    console.log(formsDATA.get("name"));
    console.log("formData", formsDATA);

    const formDataJson = {};
    for (const [key, value] of formsDATA.entries()) {
      formDataJson[key] = value;
    }

    console.log("form data", formDataJson);

    try {
      const response = await fetch(
        `${API_URL}/activity/CreateActivity`,
        {
          method: "POST",
          // headers: {
          //   'Content-Type': 'application/json',
          // },
          body: formsDATA,
          // body:formsDATA.stringify()
        }
      );

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

  const direct = () => {
    navigate("/activity");
  };

  return (
    <>
      {authenticated && (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="bg-white-A700 flex flex-col items-center justify-center sm:px-5 rounded-[5px] shadow-bs2 w-[33%] sm:w-full">
            <div className=" flex flex-col gap-2 items-center justify-center w-full">
              <div className="bg-gray-50 flex flex-row items-center justify-between p-7 sm:px-5 w-full rounded-xl">
                <div className="flex flex-row gap-4 items-center justify-center ml-[5px]">
                  {userData && (
                    <Img
                      className=" sm:w-16 sm:h-14   rounded-full object-cover object-top "
                      src={`${API_URL}/image/${userData.userData.photo}`}
                      alt="userimage"
                    />
                  )}
                  <div className="flex flex-col items-center justify-center w-3/5">
                    <div className="flex flex-col items-start justify-center w-full">
                      <Text
                        className="text-center text-gray-900 uppercase"
                        size="txtInterSemiBold16Gray900"
                      >
                        {userData && userData.userData.name}
                      </Text>
                      <Text className="text-center  text-gray-900 uppercase text-sm">
                        ID: {userData && userData.userData.id}
                      </Text>
                    </div>
                  </div>
                </div>
                <Button
                  className="font-semibold btn-11"
                  shape="round"
                  color="indigo_A200"
                  onClick={direct}
                >
                  {`${totalTime ||'0'} hours`}
                </Button>
                
                
              </div>
              <div className="bg-gray-50 w-full h-15 text-center border-2 border-dashed border-zinc-300 rounded-xl"><h1 className="text-xl  font-semibold">Add New Activity</h1></div>

              <div className=" relative p-5 flex items-center justify-center gap-4 w-full ">
                Time Spent:{" "}
                <label
                  htmlFor="fromTime"
                  className="text-xs absolute top-0 left-13 ml-2 mt-1 text-gray-500"
                >
                  From
                </label>
                <input
                  type="time"
                  name="fromTime"
                  id="fromTime"
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                  className="rounded-lg border-2 border-dashed"
                />{" "}
                <label
                  htmlFor="fromTime"
                  className="text-xs absolute top-0 right-8 ml-2 mt-1 text-gray-500"
                >
                  To
                </label>
                <input
                  type="time"
                  name="toTime"
                  id="toTime"
                  value={toTime}
                  placeholder="To time"
                  onChange={(e) => setToTime(e.target.value)}
                  className="rounded-lg border-2 border-dashed"
                />
              </div>
              <div className="flex flex-col items-start justify-center w-[100%] sm:w-full">
                {/* <Button
                    className="text-indigo-500 cursor-pointer font-semibold leading-[normal] w-full text-center text-sm"
                    shape="round"
                    size="sm"
                  >
                    + Add New Activity
                  </Button> */}
                <Text
                  className="text-base text-gray-900"
                  size="txtInterSemiBold16Gray900"
                >
                  Select Category
                </Text>
                <div className="flex flex-wrap  items-center justify-between mt-[18px] w-full">
                  {buttons.map((button) => (
                    <label
                      key={button.id}
                      className={`flex flex-wrap rounded-[20px] items-center justify-center border-2 overflow-hidden border-double border-white p-4 m-1 w-34 cursor-pointer ${
                        selectedButton === button.label
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

                
                <div className="flex flex-row gap-2.5 items-center justify-between mt-[30px] w-full">
                  <Button
                    className="cursor-pointer flex items-center justify-center min-w-[145px]"
                    leftIcon={
                      <div className="mb-[3px] mr-[9px] h-4 w-4 ">
                        <Img
                          src="images/img_location.svg"
                          alt="location icon"
                        />
                      </div>
                    }
                    shape="round"
                    color="blue_50"
                  >
                    <div className="font-medium leading-[normal] text-[15px] text-left ">
                      <Location onLocationChange={handleLocationChange} />
                    </div>
                  </Button>
                  <Button
                    className="cursor-pointer flex items-center justify-center min-w-[150px]"
                    type="none"
                    leftIcon={
                      <div className="h-4 mb-[3px] mr-2.5 w-4">
                        <Img
                          className="h-4"
                          src="images/img_calendar.svg"
                          alt="calendar"
                        />
                      </div>
                    }
                    shape="round"
                    color="blue_50"
                  >
                    <div className="font-medium leading-[normal] text-[15px] text-left">
                      {currentDate}
                    </div>
                  </Button>
                </div>
                <List className="flex-col  justify-center mt-2 w-full">
                  <div className="flex flex-1 flex-col gap-[9px] mb-2 items-start justify-start w-full">
                    <Text
                      className="text-base text-gray-900"
                      size="txtInterSemiBold16Gray900"
                    >
                      Photos
                    </Text>
                    <div className="bg-gray-50_01 border border-dashed border-indigo-500 flex flex-col items-center justify-end p-2 rounded-[5px] shadow-bs1 w-full">
                      <div className="flex flex-row gap-2.5 items-start justify-center mt-0.5 w-[44%] sm:w-full">
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
                  <div className="flex flex-1 flex-col gap-2.5 items-start justify-start w-full">
                    <Text
                      className="text-base text-gray-900"
                      size="txtInterSemiBold16Gray900"
                    >
                      Videos
                    </Text>
                    <div className="bg-gray-50_01 border border-dashed border-indigo-500 flex flex-col items-center justify-end p-2 rounded-[5px] shadow-bs1 w-full">
                      <div className="flex flex-row gap-2.5 items-start justify-center mt-0.5 w-[44%] sm:w-full">
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
                  className="cursor-pointer font-semibold w-full mt-5 mb-3 text-base text-center"
                  shape="round"
                  color="indigo_A200"
                >
                  SUBMIT
                </Button>
              </div>
            </div>
          {/* </div> */}
          <Button
                className="cursor-pointer font-semibold w-full  text-base text-center"
                shape="round"
                color="indigo_A200"
                onClick={handleLogout} // Add logout functionality
                >
                LOGOUT
              </Button>
                </div>
        </form>

        
      )}
    </>
  );
};

export default Createpost;
