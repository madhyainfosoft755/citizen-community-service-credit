import React, { useEffect, useState } from "react";

import { Img, List, Text } from "components";
import { useNavigate } from "react-router-dom";
import { API_URL, APP_PATH } from "Constant";
import "./style.css";
import { toast } from "react-toastify";

const DesktopSevenPage = () => {
  const navigate = useNavigate();
  const notify = (e) => toast(e);
  const [posts, setPosts] = useState([]);


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

  const postForApproval = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/activity/pendingApproval`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      // console.log("ye hai response",data)
      if (response.ok) {
        setPosts(data)
      }
      else {
        // console.log("hello")
        setPosts([])
        notify(data.message)
      }

    }
    catch (error) {
      console.error("Error fetching requests for approval", error);
      // setError("An error occurred while fetching users Time.");
    }
  }


  const approveHoursRequest = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/activity/approveHours/${postId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Refresh the posts after approval
        postForApproval();
        notify("Hours request approved successfully");
      } else {
        notify("Failed to approve hours request");
      }
    } catch (error) {
      notify("Error approving hours request");
      console.error("Error approving hours request:", error);
    }
  };


  useEffect(() => {
    // Check if both token and user key are present in local storage
    const token = localStorage.getItem("token");
    const userKey = localStorage.getItem("userKey");

    // console.log("ye hai token ",token)

    if (!token || !userKey) {
      // Redirect to the login page if either token or user key is missing
      navigate("/login");
    } else {
      // Fetch user data when component mounts
      postForApproval(token)
      checkTokenExpiry(token);

    }

    // You may also want to check the validity of the token here if needed

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures that this effect runs only once on mount


  const handlePostClick = (post) => {
    navigate(`/reviewactivity/${post.UserId}/${post.id}`);
    console.log("ye hai postr", post.UserId, post.id)
  };


  const goback = () => {
    navigate("/admin");
  };

  // console.log("ye rhe posts", posts)

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const formattedHours = parseInt(hours, 10) < 10 ? hours.replace(/^0+/, '') : hours;
    const formattedMinutes = parseInt(minutes, 10) !== 0 ? `:${minutes}` : '';
    return `${formattedHours}${formattedMinutes}`;
  };

  console.log("ye rhe posts", posts)
  return (
    <div className=" flex items-center justify-center p-4 sm:p-0  w-screen h-screen sm:w-screen sm:h-screen">
      <div className=" relative w-4/12 h-full sm:w-full sm:h-full md:w-3/4 md:h-full  lg:w-3/4 lg:h-full  flex flex-col items-center  justify-start border-[1px] gap-4  rounded-lg sm:rounded-none overflow-hidden">
        <div className="bg-white-A700 flex  items-center justify-start relative p-6 shadow-bs3 w-full">
          <div onClick={goback}>
            <Img
              className="h-4 cursor-pointer"
              src={APP_PATH + "images/img_arrowleft.svg"}
              alt="arrowleft"
            />
          </div>
          <Text
            className=" text-base text-gray-900 absolute left-[35%]"
            size="txtInterSemiBold17"
          >
            Approve Hours
          </Text>

        </div>
        <div className="post-showe w-full p-4 overflow-auto scroller">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div onClick={() => handlePostClick(post)} key={post.id} className="post-item cursor-pointer p-4 mb-4  bg-white rounded shadow flex items-center justify-between bg-[#f1f3ff]">
                <div>
                  <Text size="txtInterSemiBold17">{post.user.name}</Text>
                  <Text className="text-xs mt-1">Requested for {formatTime(post.totalTime)} Hours approval </Text>
                </div>
                <button className="text-[#546ef6] font-semibold border-2 rounded-md border-gray-300 p-2" onClick={(e) => {
                  e.stopPropagation();
                  handlePostClick(post);
                }}>Review</button>

              </div>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Img
                className="w-[80%] h-auto object-cover object-center"
                src="images/nopost.svg"
                alt="No posts available for endorsement"
              />
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default DesktopSevenPage;
