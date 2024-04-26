import React, { useEffect, useState } from "react";

import { Button, Img, Text } from "components";
import { API_URL } from "Constant";
import { useNavigate } from "react-router-dom";
import { useAuth } from "components/AuthProvider/AuthProvider";
import Slider1 from "components/slider/slider";

const DesktopFourPage = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState(null);
  const { authenticated, setAuthenticated } = useAuth();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [locationData, setLocationData] = useState(null);
  const [totalTime, setTotalTime] = useState(null); // Added state for total time

  // console.log("userData", userData);
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await fetch(
          `${API_URL}/activity/postsdata/${userData.userData.id}`,
          {
            method: "GET", // Assuming you have an endpoint to fetch user posts
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const userPostsData = await response.json();
          setUserPosts(userPostsData);
        } else {
          console.error("Error fetching user posts:", response.status);
          setError("An error occurred while fetching user posts.");
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
        setError("An error occurred while fetching user posts.");
      }
    };

    if (userData?.userData?.id) {
      fetchUserPosts();
    }
  }, [userData, navigate]);

  // Fetch historical data and calculate total time
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const token = localStorage.getItem("token");
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures that this effect runs only once on mount

  const handleLogout = () => {
    // Clear authentication status, remove token and user key, and redirect to the login page
    setAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userKey");
    navigate("/login");
  };

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

  // console.log("here is the data you are looking for", userData);

  const direct = () => {
    navigate("/create");
  };
  const direct1 = () => {
    navigate("/endorse");
  };

  return (
    <>
      {authenticated && (
        <div className="w-screen h-screen bg-white-A700 flex items-center justify-center sm:w-full sm:h-full md:w-screen md:h-screen">
          <div className="bg-white-A700 flex items-center justify-center sm:px-5 rounded-[5px] shadow-bs2 lg:w-[33%] lg:h-full sm:w-full sm:h-full md:w-full md:h-full">
            <div className="flex flex-col gap-3 items-center justify-center w-full">
              <div className="bg-gray-50 flex flex-row items-center justify-between p-7 sm:px-5 w-full  rounded-xl">
                <div className="flex flex-row gap-4 items-center justify-center ml-[5px]">
                  {userData && (
                    <Img
                      className=" h-[55px]  rounded-[50%] w-[71px] object-cover object-center "
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
                  className="cursor-pointer font-semibold "
                  shape="round"
                  color="indigo_A200"
                  onClick={direct}
                >
                  {`${totalTime || "0"} Hours`}
                </Button>
              </div>
              <Text
                className="mt-2 text-base text-gray-900"
                size="txtInterSemiBold16Gray900"
              >
                My Activities
              </Text>
              <div className="flex sm:flex-col flex-col gap-[25px] items-center justify-between w-full h-full">
                <div className=" w-full h-full sm:h-[60vh] rounded-xl relative  sm:w-full border-[1px] border-gray shadow-2xl  shadow-indigo-300 overflow-hidden">
                  <Slider1 className="w-full h-full p-2" items={userPosts} />
                </div>

                <div className="flex flex-row gap-1 items-center justify-center sm:w-full">
                  <Text
                    className="text-sm text-gray-900"
                    size="txtInterSemiBold16Gray900"
                  >
                    Activities Waiting for Endorsement
                  </Text>
                </div>

                <Button
                  className="cursor-pointer font-semibold w-full  mb-2 text-base text-center"
                  shape="round"
                  color="indigo_A200"
                  onClick={direct1}
                >
                  Endorsment
                </Button>

                <Button
                  className="cursor-pointer font-semibold w-full  mb-2 text-base text-center"
                  shape="round"
                  color="indigo_A200"
                  onClick={handleLogout} // Add logout functionality
                >
                  LOGOUT
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DesktopFourPage;
