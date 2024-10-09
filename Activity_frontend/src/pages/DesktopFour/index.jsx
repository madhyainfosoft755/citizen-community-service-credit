import React, { useEffect, useState } from "react";

import { Button, Img, Text } from "components";
import { API_URL, APP_PATH } from "Constant";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "components/AuthProvider/AuthProvider";
import Slider1 from "components/slider/slider";
import PopupComponent from "components/popup";
import { toast } from "react-toastify";
import QuoteModal from "components/quote-modal";
import { convertToHours } from "utils";
import LinkModal from "components/link-modal/link-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const DesktopFourPage = () => {
  const [imageLoaded, setImageLoaded] = useState(true);
  const notify = (e) => toast(e);
  const [isPopUpVisible, setIsPopUpVisible] = useState(false); // State for pop-up visibility
  const [selectedPost, setSelectedPost] = useState(null); // State for selected post
  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState(null);
  const { authenticated, setAuthenticated } = useAuth();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [locationData, setLocationData] = useState(null);
  const [totalTime, setTotalTime] = useState(null); // Added state for total time
  const [userName, setUserName] = useState("")
  const { state } = useLocation();
  const [showQuote, setShowQuoteModal] = useState(false);
  // console.log("state create activity", state);

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

        const userPostsData = await response.json();
        if (response.ok) {
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

    if (!token || !userKey) {
      // Redirect to the login page if either token or user key is missing
      navigate("/login");
    } else {
      // Fetch user data when component mounts
      fetchUserData(token);
      checkTokenExpiry(token);

    }

    // You may also want to check the validity of the token here if needed

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures that this effect runs only once on mount

  // const handleLogout = () => {
  //   // Clear authentication status, remove token and user key, and redirect to the login page
  //   setAuthenticated(false);
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("userKey");
  //   navigate("/login");
  // };

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

  const name = userName.split(" ")[0];


  // console.log("here is the data you are looking for", userData);

  const direct = () => {
    navigate("/create");
  };
  const direct1 = () => {
    navigate("/endorse");
  };

  // const [textIndex, setTextIndex] = useState(0);
  // const carouselTexts = [`${totalTime || 0} Hours`, 'Create Activity']; // Add your carousel text here

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTextIndex((prevIndex) => (prevIndex + 1) % carouselTexts.length);
  //   }, 2000); // Change text every 2 seconds

  //   return () => clearInterval(interval);
  // }, []);


  const openProfilePopup = () => {
    if (userData && userData.userData) {
      setSelectedPost({ photos: userData.userData.photo });
      setIsPopUpVisible(true);
    }
  };

  const createpage = () => {
    console.log("clicked");
    navigate("/create");
  }

  useEffect(() => {
    // This effect will run whenever the location changes

    if (userData && userData.userData && userData.userData.organization !== 'NA') {
      if (state && state.timeSpent) {
        setShowQuoteModal(true);
      }
    }
  }, [userData, navigate]);

  return (
    <>
      {authenticated && (
        <div className="w-screen h-screen  bg-white-A700 flex items-start justify-center sm:w-screen sm:h-screen md:w-screen md:h-screen p-5 sm:p-0 md:p-0">
          {isPopUpVisible && (
            <PopupComponent post={selectedPost} onClose={() => setIsPopUpVisible(false)} />
          )}

          {showQuote && (
            <LinkModal onClose={() => setShowQuoteModal(false)} timeSpent={state && state.timeSpent} postId={state && state.data.created_post.id} />
          )}
          <div className="relative  w-4/12 h-full  flex items-start justify-center  sm:shadow-none  border-[1px]  rounded-lg sm:rounded-none  lg:h-full sm:w-full sm:h-full md:w-full md:h-full overflow-hidden scroller">
            <div className="flex flex-col  items-center justify-start w-full h-full md:w-full sm:w-full">
              <div className="bg-gray-50 flex flex-row items-center justify-between p-3 sm:px-2 w-full ">
                <div className="flex flex-row gap-3 items-center justify-center ml-[5px]" >
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
                  <div className="flex flex-col items-center justify-center w-3/5 ">
                    <div className=" cursor-default flex flex-col items-start justify-center w-full ">
                      <Text
                        className="text-center text-gray-900 uppercase"
                        size="txtInterSemiBold16Gray900"
                      >
                        {/* {userData && userData.userData.name} */}
                        {name}
                      </Text>
                      {/* <Text className="text-center  text-gray-900 uppercase text-sm">
                        ID: {userData && userData.userData.id}
                      </Text> */}
                    </div>
                  </div>
                </div>
                <Button
                  className="cursor-pointer font-semibold rounded-3xl   text-blue-500 bg-white-A700 text-xs"

                  // shape="round"
                  onClick={direct}
                >
                  {`${totalTime || 0} Hrs | ${totalTime && convertToHours(totalTime)} Pts`}
                </Button>
                <img onClick={createpage} src={APP_PATH + "images/2.png"} className="cursor-pointer w-14 h-14 rounded-full" alt="" />

              </div>
              <div className="w-full h-full flex items-center justify-start flex-col overflow-hidden">

                <Text
                  className=" text-base font-semibold text-gray-900"
                >
                  My Activities
                </Text>

                <div className="flex  sm:flex-col flex-col gap-1 items-center justify-between w-5/6 h-full sm:w-11/12  sm:h-full  p-2 overflow-hidden">
                  <div className=" w-full h-5/6 sm:w-full sm:h-5/6 rounded-xl border-[1px] border-gray overflow-hidden scroller">
                  {/* {console.log("userPosts:", JSON.stringify(userPosts, null, 2))} */}
                    <Slider1 items={userPosts} isPopUpVisible={isPopUpVisible}
                      setIsPopUpVisible={setIsPopUpVisible}
                      setSelectedPost={setSelectedPost}
                      selectedPost={selectedPost}
                    />

                  </div>
                  <div>
                    {/* <FontAwesomeIcon
                      icon={faCircleCheck}
                      className={'mx-1 text-red-500 -ml-1'}
                    /> */}
                  </div>
                  <div className="flex  gap-1 items-center justify-center w-5/6 h-1/6  sm:w-full mb-1">
                    <Button
                      className="rounded-full cursor-pointer font-semibold w-4/6 whitespace-nowrap  text-xs text-center"
                      // shape="round"
                      color="indigo_A200"
                      onClick={direct1}
                    >
                      ENDORSE ACTIVITY
                    </Button>

                    {/* <Button
                      className="cursor-pointer rounded-full font-semibold w-4/6 text-xs text-center"
                      color="indigo_A200"
                      onClick={handleLogout} // Add logout functionality
                    >
                      LOGOUT
                    </Button> */}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DesktopFourPage;
