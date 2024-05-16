import React, { useEffect, useState } from "react";

import { Button, Img, Input, Text } from "components";
import { API_URL } from "Constant";
import { useNavigate } from "react-router-dom";
import { useAuth } from "components/AuthProvider/AuthProvider";
import "./style.css"

const DesktopFivePage = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState(null);
  const { authenticated, setAuthenticated } = useAuth();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [locationData, setLocationData] = useState(null);
  const [totalTime, setTotalTime] = useState(null); // Added state for total time
  const [userName, setUserName] = useState(""); // Added state for user name
  const [usersWithMostPostsInYear, setUsersWithMostPostsInYear] = useState([]);


  // Check if both token and user key are present in local storage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userKey = localStorage.getItem("userKey");

    if (!token || !userKey) {
      // Redirect to the login page if either token or user key is missing
      navigate("/login");
    } else {
      // Fetch user data when component mounts
      fetchUserData(token);
      MostPostsInYear()
    }

    // You may also want to check the validity of the token here if needed

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //


  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${API_URL}/activity/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
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


  const handleLogout = () => {
    // Clear authentication status, remove token and user key, and redirect to the login page
    setAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userKey");
    navigate("/login");
  };

  const Name = userName.split(" ")[0];

  const [textIndex, setTextIndex] = useState(0);
  const carouselTexts = [`${totalTime || 0} Hours`, 'My Activity']; // Add your carousel text here

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % carouselTexts.length);
    }, 2000); // Change text every 2 seconds

    return () => clearInterval(interval);
  }, []);


 

  const MostPostsInYear = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await fetch(`${API_URL}/activity/getUsersWithMostPostsInYear`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      if (response.ok) {
        const { topUserNames } = await response.json();
        setUsersWithMostPostsInYear(Array.isArray(topUserNames) ? topUserNames : []);
      } else {
        console.error("Error fetching users with most posts in year:", response.status);
        setError("An error occurred while fetching users with most posts in year.");
      }
    } catch (error) {
      console.error("Error fetching users with most posts in year:", error);
      setError("An error occurred while fetching users with most posts in year.");
    }
  };


  const direct = () => {
    navigate("/activity");
  };

  const apphour = ()=>{
    navigate("/approvehours")
  }
  const magcate = ()=>{
    navigate("/managecategories")
  }
  const mngapp = ()=>{
    navigate("/approvers")
  }
  const mnguser = ()=>{
    navigate("/approvehours")
  }
  const generatereport = ()=>{
    navigate("/generatereport")
  }


  return (

    <div className="w-screen h-screen  bg-white-A700 flex items-start justify-center sm:w-screen sm:h-screen md:w-screen md:h-screen p-5 sm:p-0">
      <div className=" relative w-4/12 h-full sm:w-full sm:h-full md:w-3/4 md:h-full  lg:w-3/4 lg:h-full  flex flex-col items-center  justify-center border-[1px]  rounded-lg sm:rounded-none overflow-hidden">
        <div className=" flex flex-col  items-center justify-center w-full h-full ">

          <div className="bg-gray-50 flex flex-row items-center justify-between p-3 sm:p-5  sm:px-5 w-full ">

            <div className="flex flex-row gap-4 items-center justify-center ml-[1px]">
              {userData && (
                <Img
                  className=" sm:w-[58px] sm:h-[52px] md:w-[58px] md:h-[52px] lg:w-[58px] lg:h-[58px]  w-14 h-12 rounded-full object-cover object-top  "
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
                    {Name}
                  </Text>


                </div>
              </div>
            </div>
            <Button
              className="cursor-pointer font-semibold rounded-3xl w-4/12"
              // shape="round"
              color="indigo_A200"
              onClick={direct}
            >
              {carouselTexts[textIndex]}
            </Button>
          </div>

          <div className="w-full h-full  p-4">

            <h1 className="text-xl font-semibold w-full pl-3">Top Five Stars</h1>
            <div className=" h-full scroller overflow-x-auto p-3">
              <div className="flex h-full space-x-4">

                <div className="rounded-lg shadow-bs  shadow-black-900 w-52 h-full border-[1px] flex-shrink-0 flex flex-col items-center justify-center pt-4 text-xl font-medium">
                  <h1 className="text-[#546ef6]">Month</h1>
                  <div className="w-full h-full flex flex-col gap-3 pt-2">

                    {usersWithMostPostsInYear.map((user, index) => (
                      <div key={index} className=" flex-shrink-0 flex items-center justify-center text-base font-medium">
                        <h1>{user.charAt(0).toUpperCase() + user.slice(1)}</h1>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg shadow-bs shadow-black-900 w-52 h-full border-[1px] flex-shrink-0 flex flex-col items-center justify-center pt-4 text-xl font-medium">
                  <h1 className="text-[#546ef6]">Six Month</h1>
                  <div className="w-full h-full flex flex-col gap-3 pt-2">

                    {usersWithMostPostsInYear.map((user, index) => (
                      <div key={index} className=" flex-shrink-0 flex items-center justify-center text-base font-medium">
                        <h1>{user.charAt(0).toUpperCase() + user.slice(1)}</h1>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg shadow-bs shadow-black-900 w-52 h-full border-[1px] flex-shrink-0 flex flex-col items-center justify-center pt-4 text-xl font-medium">
                  <h1 className="text-[#546ef6]">Year</h1>
                  <div className="w-full h-full flex flex-col gap-3 pt-2">

                    {usersWithMostPostsInYear.map((user, index) => (
                      <div key={index} className=" flex-shrink-0 flex items-center justify-center text-base font-medium">
                        <h1>{user.charAt(0).toUpperCase() + user.slice(1)}</h1>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-[1px] h-full flex-shrink-0"></div>
              </div>
            </div>
          </div>

          <div className=" w-full h-full">
            <div className=" w-full h-1/2 flex flex-wrap  items-center justify-between pl-4 pr-4 pt-1 pb-1">
              <div className="w-[48%] rounded-lg bg-[#e9ecfe] border-[1px] border-[#546ef6] text-[#546ef6] h-1/3 flex flex-shrink-2 items-center justify-center font-semibold cursor-pointer" onClick={apphour}><h1>Approve Hours</h1></div>
              <div className="w-[48%] rounded-lg bg-[#e9ecfe] border-[1px] border-[#546ef6] text-[#546ef6] h-1/3 flex flex-shrink-2 items-center justify-center font-semibold cursor-pointer" onClick={magcate}><h1>Manage Category</h1></div>
              <div className="w-[48%] rounded-lg bg-[#e9ecfe] border-[1px] border-[#546ef6] text-[#546ef6] h-1/3 flex flex-shrink-2 items-center justify-center font-semibold cursor-pointer" onClick={mngapp}><h1>Manage Approvers</h1></div>
              <div className="w-[48%] rounded-lg bg-[#e9ecfe] border-[1px] border-[#546ef6] text-[#546ef6] h-1/3 flex flex-shrink-2 items-center justify-center font-semibold cursor-pointer" onClick={mnguser}><h1>Manage Users</h1></div>
            </div>

            <div className="flex flex-col items-center justify-end w-full h-1/2 " >
                  <button onClick={generatereport} className="w-4/5 p-3 rounded-full bg-[#546ef6] text-white-A700 text-base font-semibold">Generate Report</button>
                  <button className="w-4/5 p-3 mt-2 mb-2 rounded-full bg-[#546ef6] text-white-A700 text-base font-semibold">Submit</button>
            </div>
          </div>
        </div>

      </div>
    </div>

  );
};

export default DesktopFivePage;
