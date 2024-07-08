import React, { useEffect, useState } from "react";

import { Button, Img, Input, Text } from "components";
import { API_URL } from "Constant";
import { useNavigate } from "react-router-dom";
import { useAuth } from "components/AuthProvider/AuthProvider";
import "./style.css"
import { toast } from "react-toastify";


const DesktopFivePage = () => {
  const notify = (e) => toast(e);
  const [error, setError] = useState(null);
  const { authenticated, setAuthenticated } = useAuth();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [totalTime, setTotalTime] = useState(null); // Added state for total time
  const [userName, setUserName] = useState(""); // Added state for user name
  const [usersWithMostPostsInYear, setUsersWithMostPostsInYear] = useState([]);
  const [usersWithMostPostsInSixMonths, setUsersWithMostPostsInSixMonths] = useState([]);
  const [usersWithMostPostsInMonth, setUsersWithMostPostsInMonth] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user
  const [userPosts, setUserPosts] = useState([]); // State for user's posts
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility

  // console.log(`ye hain ${selectedUser} ke posts`, userPosts)

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
      MostPostsInYear(token)
      fetchMostPostsInSixMonths(token);
      fetchMostPostsInMonth(token);
      checkTokenExpiry(token);
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

  const fetchMostPostsInSixMonths = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await fetch(`${API_URL}/activity/getUsersWithMostPostsInSixMonths`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const { topUserNames } = await response.json();
        setUsersWithMostPostsInSixMonths(Array.isArray(topUserNames) ? topUserNames : []);
      } else {
        console.error("Error fetching users with most posts in six months:", response.status);
        setError("An error occurred while fetching users with most posts in six months.");
      }
    } catch (error) {
      console.error("Error fetching users with most posts in six months:", error);
      setError("An error occurred while fetching users with most posts in six months.");
    }
  };

  const fetchMostPostsInMonth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await fetch(`${API_URL}/activity/getUsersWithMostPostsInMonth`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const { topUserNames } = await response.json();
        setUsersWithMostPostsInMonth(Array.isArray(topUserNames) ? topUserNames : []);
      } else {
        console.error("Error fetching users with most posts in month:", response.status);
        setError("An error occurred while fetching users with most posts in month.");
      }
    } catch (error) {
      console.error("Error fetching users with most posts in month:", error);
      setError("An error occurred while fetching users with most posts in month.");
    }
  };


  // console.log("ye hai current year ke posts", usersWithMostPostsInYear)


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchUserPosts = async (userId) => {
    console.log("ye hai user id", userId)
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/activity/getPostsByUser/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const posts = await response.json();
      if (response.ok) {
        const formattedPosts = posts.map(post => ({
          ...post,
          Date: formatDate(post.Date),
        }));
        setUserPosts(formattedPosts);
        setIsPopupVisible(true);
      } else {
        notify(posts.error)
        // console.error("Error fetching user's posts:", response.status);
        setError("An error occurred while fetching user's posts.");
      }
    } catch (error) {
      console.error("Error fetching user's posts:", error);
      setError("An error occurred while fetching user's posts.");
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/userspost/${userId}`)

    // fetchUserPosts(userId);
    // const selectedUser = usersWithMostPostsInYear.find(user => user.id === userId);
    // console.log("ye hai selected user ka naam", selectedUser)
    // setSelectedUser(selectedUser.name);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setUserPosts([]);
  };

  const direct = () => {
    navigate("/activity");
  };

  const apphour = () => {
    navigate("/approvehours")
  }
  const magcate = () => {
    navigate("/managecategories")
  }
  const mngapp = () => {
    navigate("/approvers")
  }
  const mnguser = () => {
    navigate("/manageusers")
  }
  const mngorg = () => {
    navigate("/manageorganization")
  }
  const generatereport = () => {
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
              className="cursor-pointer font-semibold rounded-3xl w-5/12"
              // shape="round"
              color="indigo_A200"
              onClick={handleLogout}
            >
              LOGOUT
              {/* {carouselTexts[textIndex]} */}
            </Button>
          </div>

          <div className="w-full h-1/2 p-1">
            <h1 className="text-xl font-semibold w-full pl-3">Top Five Stars</h1>
            <div className="h-[90%] scroller overflow-x-auto p-3">
              <div className="flex h-full space-x-2">
                {[
                  { timeframe: 'Month', users: usersWithMostPostsInMonth },
                  { timeframe: 'Six Months', users: usersWithMostPostsInSixMonths },
                  { timeframe: 'Year', users: usersWithMostPostsInYear },
                ].map(({ timeframe, users }, index) => (
                  <div
                    key={index}
                    className="rounded-lg shadow-bs shadow-black-900 w-40 h-full border-[1px] flex-shrink-0 flex flex-col items-center justify-center pt-4 text-xl font-medium"
                  >
                    <h1 className="text-[#546ef6] font-bold">{timeframe}</h1>
                    <div className="w-full h-full flex flex-col gap-1 pt-2 overflow-auto scroller">
                      {users.length > 0 ? (
                        users.map((user, userIndex) => (
                          <div key={userIndex} className="flex-shrink-0 flex items-center justify-center text-sm font-medium">
                            <h1
                              className="hover:underline hover:text-blue-300 hover:cursor-pointer"
                              onClick={() => handleUserClick(user.id)}
                            >
                              {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
                            </h1>
                          </div>
                        ))
                      ) : (
                        <div className="flex-shrink-0 flex items-center justify-center text-sm font-medium">
                          <h1>No data available</h1>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="w-[1px] h-full flex-shrink-0"></div>
              </div>
            </div>
          </div>


          <div className=" w-full h-full  pt-3 ">
            <div className=" w-full h-3/5 flex flex-wrap items-center justify-between pl-4 pr-4 pt-1 pb-1">
              <div className="w-[48%] rounded-lg bg-[#e9ecfe] border-[1px] border-[#546ef6] text-[#546ef6] h-1/5 flex  items-center justify-center font-semibold cursor-pointer text-center" onClick={apphour}><h1>Approve Hours</h1></div>
              <div className="w-[48%] rounded-lg bg-[#e9ecfe] border-[1px] border-[#546ef6] text-[#546ef6] h-1/5 flex flex-shrink-2 items-center justify-center font-semibold cursor-pointer text-center" onClick={magcate}><h1>Manage Category</h1></div>
              <div className="w-[48%] rounded-lg bg-[#e9ecfe] border-[1px] border-[#546ef6] text-[#546ef6] h-1/5 flex flex-shrink-2 items-center justify-center font-semibold cursor-pointer text-center" onClick={mngapp}><h1>Manage Approvers</h1></div>
              <div className="w-[48%] rounded-lg bg-[#e9ecfe] border-[1px] border-[#546ef6] text-[#546ef6] h-1/5 flex flex-shrink-2 items-center justify-center font-semibold cursor-pointer text-center" onClick={mnguser}><h1>Manage Users</h1></div>
              <div className="w-full rounded-lg bg-[#e9ecfe] border-[1px] border-[#546ef6] text-[#546ef6] h-1/5 flex flex-shrink-2 items-center justify-center font-semibold cursor-pointer text-center" onClick={mngorg}><h1>Manage Organisation</h1></div>

            </div>

            <div className="flex flex-col items-center justify-center gap-1  w-full h-2/5  " >
              <button onClick={generatereport} className="w-4/5 p-2 rounded-full bg-[#546ef6] text-white-A700 text-base font-semibold">Generate Report</button>
              <button className="w-4/5 p-2  rounded-full bg-[#546ef6] text-white-A700 text-base font-semibold">Submit</button>
            </div>
          </div>
        </div>



        {isPopupVisible && (
          <div className="absolute w-full h-full inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full h-full bg-black-900/80 rounded-lg p-6 shadow-lg flex flex-col items-center justify-center">
              <div className="bg-white-A700 p-3 rounded-md font-sans flex flex-col shadow-blue-500 shadow-bs2 items-center justify-start overflow-auto">
                {/* <h2 className="text-2xl font-bold mb-4">Posts by {selectedUser}</h2> */}
                <h2 className="text-2xl font-bold mb-4">{selectedUser} made {userPosts.length} posts</h2>
                {userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <div key={post.id} className="mb-2 border-4 border-gray-200  p-2 w-full border-double  rounded-md">
                      <h3 className="font-semibold">Category: {post.category}</h3>
                      <h3 className="font-semibold">Date: {post.Date}</h3>
                      <h3 className="font-semibold">Time: {post.totalTime}</h3>
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Img
                      className="w-[80%] h-auto object-cover object-center"
                      src="/apps/images/nopost.svg"
                      alt="No posts available for endorsement"
                    />
                  </div>
                )}
              </div>
              <button
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
                onClick={closePopup}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

    </div>

  );
};

export default DesktopFivePage;
