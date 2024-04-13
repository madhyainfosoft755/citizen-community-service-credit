import React, { useEffect, useState } from "react";

import { Button, Img, Input, Text } from "components";
import { API_URL } from "Constant";
import { useNavigate } from "react-router-dom";
import { useAuth } from "components/AuthProvider/AuthProvider";

const DesktopFivePage = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState(null);
  const { authenticated, setAuthenticated } = useAuth();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [locationData, setLocationData] = useState(null);
  const [totalTime, setTotalTime] = useState(null); // Added state for total time

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
    }

    // You may also want to check the validity of the token here if needed

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures that this effect runs only once on mount

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

  //fetch user posts
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

  const handleLogout = () => {
    // Clear authentication status, remove token and user key, and redirect to the login page
    setAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userKey");
    navigate("/login");
  };

  return (
    <>
      {/* <div className="bg-white-A700 flex font-light items-center justify-center sm:w-screen sm:h-screen md:w-screen md:h-screen overflow-x-hidden overflow-y-auto">
        <div className="bg-white-A700 flex  items-center justify-center   rounded-[5px] shadow-bs2  md:w-full md:h-full sm:h-full sm:w-full">
          <div className="flex flex-col items-end justify-start w-full">
            <div className="bg-gray-50 flex flex-row items-center justify-between  sm:px-5 w-full">
              <div className="flex flex-row gap-4 items-center justify-center ml-[5px]">
                <Img
                  className="h-[58px] md:h-auto rounded-[50%] w-[58px]"
                  src="images/img_ellipse3.png"
                  alt="ellipseThree"
                />
                <div className="flex flex-col items-center justify-start w-3/5">
                  <div className="flex flex-col items-start justify-start w-full">
                    <Text
                      className="text-base text-gray-900"
                      size="txtInterSemiBold16Gray900"
                    >
                      Emma Janson
                    </Text>
                    <Text
                      className="mt-1 text-gray-900_b2 text-xs"
                      size="txtInterMedium12"
                    >
                      ID : 123456
                    </Text>
                  </div>
                </div>
              </div>
              <Button
                className="cursor-pointer font-semibold leading-[normal] min-w-[90px] mr-1 my-[11px] text-[13px] text-center"
                shape="round"
                color="indigo_A200"
              >
                12.5 Hours
              </Button>
            </div>
            <div className="flex flex-col items-start justify-start w-[93%] md:w-full">
              <Text
                className="text-base text-gray-900"
                size="txtInterSemiBold16Gray900"
              >
                Top Five Stars
              </Text>
              <div className="flex sm:flex-col flex-row gap-[11px] items-center justify-between mt-[13px] w-full">
                <div className="md:h-[163px] h-[164px] relative w-[76%] sm:w-full">
                  <div className="absolute bg-white-A700_33 h-[90px] left-[0] rounded-tl-[5px] rounded-tr-[5px] top-[0] w-[59%]"></div>
                  <div
                    className="absolute bg-cover bg-no-repeat flex flex-col h-full inset-y-[0] items-center justify-end left-[0] my-auto p-3.5 w-[49%]"
                    style={{ backgroundImage: "url('images/img_group23.svg')" }}
                  >
                    <div className="flex flex-col gap-[9px] items-center justify-start mt-0.5">
                      <Text
                        className="text-[15px] text-indigo-A200"
                        size="txtInterSemiBold15"
                      >
                        Month
                      </Text>
                      <Text
                        className="leading-[160.00%] text-[13px] text-black-900_99 text-center"
                        size="txtInterMedium13Black90099"
                      >
                        <>
                          Levis D.
                          <br />
                          William K.
                          <br />
                          Shortan W.
                          <br />
                          Loise M.
                          <br />
                          Petter P.
                        </>
                      </Text>
                    </div>
                  </div>
                  <div
                    className="absolute bg-cover bg-no-repeat flex flex-col h-full inset-y-[0] items-center justify-end my-auto p-3.5 right-[0] w-[49%]"
                    style={{ backgroundImage: "url('images/img_group23.svg')" }}
                  >
                    <div className="flex flex-col gap-2.5 items-center justify-start">
                      <Text
                        className="text-[15px] text-indigo-A200"
                        size="txtInterSemiBold15"
                      >
                        Six Months
                      </Text>
                      <Text
                        className="leading-[160.00%] text-[13px] text-black-900_99 text-center"
                        size="txtInterMedium13Black90099"
                      >
                        <>
                          Levis D.
                          <br />
                          William K.
                          <br />
                          Shortan W.
                          <br />
                          Loise M.
                          <br />
                          Petter P.
                        </>
                      </Text>
                    </div>
                  </div>
                </div>
                <div
                  className="bg-cover bg-no-repeat flex sm:flex-1 flex-col h-[164px] items-end justify-end pl-3.5 py-3.5 w-[22%] sm:w-full"
                  style={{ backgroundImage: "url('images/img_group23.svg')" }}
                >
                  <div className="flex flex-col gap-[9px] items-end justify-start mt-0.5">
                    <Text
                      className="text-[15px] text-indigo-A200"
                      size="txtInterSemiBold15"
                    >
                      Year
                    </Text>
                    <Text
                      className="leading-[160.00%] text-[13px] text-black-900_99 text-center"
                      size="txtInterMedium13Black90099"
                    >
                      <>
                        Levis D.
                        <br />
                        William K.
                        <br />
                        Shortan W.
                        <br />
                        Loise M.
                        <br />
                        Petter P.
                      </>
                    </Text>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-2.5 items-center justify-start mt-[19px] w-[92%] md:w-full">
                <Button
                  className="border border-indigo-A200 border-solid cursor-pointer font-semibold min-w-[170px] text-center text-sm"
                  shape="round"
                  color="indigo_A200_21"
                >
                  Approve Hours
                </Button>
                <Button
                  className="border border-indigo-A200 border-solid cursor-pointer font-semibold min-w-[170px] text-center text-sm"
                  shape="round"
                  color="indigo_A200_21"
                >
                  Manage Category
                </Button>
              </div>
              <div className="flex flex-row gap-2.5 items-center justify-start mt-2.5 w-[92%] md:w-full">
                <Button
                  className="border border-indigo-A200 border-solid cursor-pointer font-semibold min-w-[170px] text-center text-sm"
                  shape="round"
                  color="indigo_A200_21"
                >
                  Manage Approvers
                </Button>
                <Input
                  name="groupSeventyFour"
                  placeholder="Manage Users"
                  className="font-semibold p-0 placeholder:text-indigo-A200 text-left text-sm w-full"
                  wrapClassName="border border-indigo-A200 border-solid w-[49%]"
                  shape="round"
                  color="indigo_A200_21"
                  size="xs"
                ></Input>
              </div>
              <Button
                className="cursor-pointer font-semibold min-w-[350px] mt-[177px] text-base text-center"
                shape="round"
                color="indigo_A200"
                variant="outline"
              >
                GENERATE REPORT
              </Button>
              <Button
                className="cursor-pointer font-semibold min-w-[350px] mt-[11px] text-base text-center"
                shape="round"
                color="indigo_A200"
              >
                SUBMIT
              </Button>
            </div>
          </div>
        </div>
      </div> */}

      <div className="w-screen h-screen bg-cyan-200">
        <div className="w-full h-full sm:w-full sm:h-full md:w-full md:h-full ">
          <div className="bg-gray-50 flex flex-row items-center justify-between p-7 sm:px-5 w-full  rounded-xl">
            <div className="flex flex-row gap-4 items-center justify-center ml-[5px]">
              {userData && (
                <Img
                  className=" h-[55px]  rounded-[50%] w-[71px] object-cover object-center  "
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
              // onClick={direct}
            >
              {`${totalTime || "0"} Hours`}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesktopFivePage;
