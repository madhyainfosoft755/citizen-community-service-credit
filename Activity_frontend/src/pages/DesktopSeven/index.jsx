// import React, { useEffect, useState } from "react";

// import { Img, List, Text } from "components";
// import { useNavigate } from "react-router-dom";
// import { API_URL, APP_PATH } from "Constant";
// import "./style.css";
// import { toast } from "react-toastify";

// const DesktopSevenPage = () => {
//   const navigate = useNavigate();
//   const notify = (e) => toast(e);
//   const [posts, setPosts] = useState([]);


//   const checkTokenExpiry = async (token) => {
//     try {
//       const response = await fetch(`${API_URL}/activity/profile`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       // console.log("ye rha response", response)

//       if (!response.ok) {
//         // Token might be expired or invalid, so log the user out
//         // handleLogout();
//         navigate("/login")
//         notify("Session time Out")
//       }
//     } catch (error) {
//       notify(error)
//       console.error("Error checking token expiry:", error);
//     }
//   };

//   const postForApproval = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_URL}/activity/pendingApproval`, {
//         method: "GET",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await response.json();
//       // console.log("ye hai response",data)
//       if (response.ok) {
//         setPosts(data)
//       }
//       else {
//         // console.log("hello")
//         setPosts([])
//         notify(data.message)
//       }

//     }
//     catch (error) {
//       console.error("Error fetching requests for approval", error);
//       // setError("An error occurred while fetching users Time.");
//     }
//   }


//   const approveHoursRequest = async (postId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_URL}/activity/approveHours/${postId}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.ok) {
//         // Refresh the posts after approval
//         postForApproval();
//         notify("Hours request approved successfully");
//       } else {
//         notify("Failed to approve hours request");
//       }
//     } catch (error) {
//       notify("Error approving hours request");
//       console.error("Error approving hours request:", error);
//     }
//   };


//   useEffect(() => {
//     // Check if both token and user key are present in local storage
//     const token = localStorage.getItem("token");
//     const userKey = localStorage.getItem("userKey");

//     // console.log("ye hai token ",token)

//     if (!token || !userKey) {
//       // Redirect to the login page if either token or user key is missing
//       navigate("/login");
//     } else {
//       // Fetch user data when component mounts
//       postForApproval(token)
//       checkTokenExpiry(token);

//     }

//     // You may also want to check the validity of the token here if needed

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // Empty dependency array ensures that this effect runs only once on mount


//   const handlePostClick = (post) => {
//     navigate(`/reviewactivity/${post.UserId}/${post.id}`);
//     console.log("ye hai postr", post.UserId, post.id)
//   };


//   const goback = () => {
//     navigate("/admin");
//   };

//   // console.log("ye rhe posts", posts)

//   const formatTime = (time) => {
//     const [hours, minutes] = time.split(":");
//     const formattedHours = parseInt(hours, 10) < 10 ? hours.replace(/^0+/, '') : hours;
//     const formattedMinutes = parseInt(minutes, 10) !== 0 ? `:${minutes}` : '';
//     return `${formattedHours}${formattedMinutes}`;
//   };

//   console.log("ye rhe posts", posts)
//   return (
//     <div className=" flex items-center justify-center p-4 sm:p-0  w-screen h-screen sm:w-screen sm:h-screen">
//       <div className=" relative w-4/12 h-full sm:w-full sm:h-full md:w-3/4 md:h-full  lg:w-3/4 lg:h-full  flex flex-col items-center  justify-start border-[1px] gap-4  rounded-lg sm:rounded-none overflow-hidden">
//         <div className="bg-white-A700 flex  items-center justify-start relative p-6 shadow-bs3 w-full">
//           <div onClick={goback}>
//             <Img
//               className="h-4 cursor-pointer"
//               src={APP_PATH + "images/img_arrowleft.svg"}
//               alt="arrowleft"
//             />
//           </div>
//           <Text
//             className=" text-base text-gray-900 absolute left-[35%]"
//             size="txtInterSemiBold17"
//           >
//             Approve Hours
//           </Text>

//         </div>
//         <div className="post-showe w-full p-4 overflow-auto scroller">
//           {posts.length > 0 ? (
//             posts.map((post) => (
//               <div onClick={() => handlePostClick(post)} key={post.id} className="post-item cursor-pointer p-4 mb-4  bg-white rounded shadow flex items-center justify-between bg-[#f1f3ff]">
//                 <div>
//                   <Text size="txtInterSemiBold17">{post.user.name}</Text>
//                   <Text className="text-xs mt-1">Requested for {formatTime(post.totalTime)} Hours approval </Text>
//                 </div>
//                 <button className="text-[#546ef6] font-semibold border-2 rounded-md border-gray-300 p-2" onClick={(e) => {
//                   e.stopPropagation();
//                   handlePostClick(post);
//                 }}>Review</button>

//               </div>
//             ))
//           ) : (
//             <div className="w-full h-full flex items-center justify-center">
//               <Img
//                 className="w-[80%] h-auto object-cover object-center"
//                 src="images/nopost.svg"
//                 alt="No posts available for endorsement"
//               />
//             </div>
//           )}
//         </div>
//       </div>

//     </div>
//   );
// };

// export default DesktopSevenPage;



// import React, { useEffect, useState } from "react";
// import { Img, Text } from "components";
// import { useNavigate } from "react-router-dom";
// import { API_URL, APP_PATH } from "Constant";
// import "./style.css";
// import { toast } from "react-toastify";

// const DesktopSevenPage = () => {
//   const navigate = useNavigate();
//   const notify = (e) => toast(String(e));
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const checkTokenExpiry = async (token) => {
//     try {
//       const response = await fetch(`${API_URL}/activity/profile`, {
//         method: "POST", // <-- confirm backend expects POST; if not, change to GET
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       if (!response.ok) {
//         console.warn("Token check returned non-OK:", response.status);
//         // optional: navigate("/login"); notify("Session time out");
//         return false;
//       }
//       return true;
//     } catch (error) {
//       console.error("Error checking token expiry:", error);
//       notify("Error checking session");
//       return false;
//     }
//   };

//   const postForApproval = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.warn("No token in localStorage");
//         navigate("/login");
//         return;
//       }

//       const response = await fetch(`${API_URL}/activity/pendingApproval`, {
//         method: "GET",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const text = await response.text();
//       let data;
//       try {
//         data = JSON.parse(text);
//       } catch (e) {
//         // not JSON — log raw text
//         console.warn("Non-JSON response from pendingApproval:", text);
//         data = null;
//       }

//       console.log("pendingApproval status:", response.status, "body:", data ?? text);

//       if (!response.ok) {
//         const message = data?.message || `Request failed: ${response.status}`;
//         notify(message);
//         setPosts([]);
//       } else {
//         // Try common locations for arrays
//         let arr = [];
//         if (Array.isArray(data)) arr = data;
//         else if (Array.isArray(data?.data)) arr = data.data;
//         else if (Array.isArray(data?.posts)) arr = data.posts;
//         else if (Array.isArray(data?.rows)) arr = data.rows;
//         else if (data && typeof data === "object") {
//           // maybe server sent { success: true, payload: [...] }
//           const maybe = Object.values(data).find((v) => Array.isArray(v));
//           if (maybe) arr = maybe;
//         }

//         if (!Array.isArray(arr)) {
//           console.warn("Couldn't find array in response; using empty array. Full response:", data);
//           arr = [];
//         }

//         setPosts(arr);
//       }
//     } catch (error) {
//       console.error("Error fetching requests for approval", error);
//       notify("Error fetching requests for approval");
//       setPosts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userKey = localStorage.getItem("userKey");

//     if (!token || !userKey) {
//       navigate("/login");
//       return;
//     }

//     // run both (no param needed)
//     postForApproval();
//     // optional: if you want to redirect on invalid token, uncomment:
//     // checkTokenExpiry(token).then(ok => { if (!ok) { navigate("/login"); notify("Session time out"); }});
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const handlePostClick = (post) => {
//     const userId = post.UserId ?? post.userId ?? post.User?.id ?? post.user?.id;
//     const id = post.id ?? post._id;
//     if (!userId || !id) {
//       console.warn("Missing UserId or id for post", post);
//       return;
//     }
//     navigate(`/reviewactivity/${userId}/${id}`);
//     console.log("Navigating to review:", userId, id);
//   };

//   const goback = () => navigate("/admin");

//   const formatTime = (time) => {
//     if (!time && time !== 0) return "0";
//     // allow numeric minutes (e.g. "2.5" hours) or "HH:MM"
//     if (typeof time === "number") return String(time);
//     if (typeof time === "string" && time.includes(":")) {
//       const [hours = "0", minutes = "0"] = time.split(":");
//       const hh = parseInt(hours, 10);
//       const mm = parseInt(minutes, 10);
//       return mm ? `${hh}:${minutes}` : `${hh}`;
//     }
//     return String(time);
//   };

//   return (
//     <div className="flex items-center justify-center p-4 sm:p-0 w-screen h-screen">
//       <div className="relative w-4/12 h-full sm:w-full md:w-3/4 lg:w-3/4 flex flex-col items-center justify-start border-[1px] gap-4 rounded-lg sm:rounded-none overflow-hidden">
//         <div className="bg-white-A700 flex items-center justify-start relative p-6 shadow-bs3 w-full">
//           <div onClick={goback}>
//             <Img className="h-4 cursor-pointer" src={APP_PATH + "images/img_arrowleft.svg"} alt="arrowleft" />
//           </div>
//           <Text className="text-base text-gray-900 absolute left-[35%]" size="txtInterSemiBold17">
//             Approve Hours
//           </Text>
//         </div>

//         <div className="post-showe w-full p-4 overflow-auto scroller">
//           {loading ? (
//             <div className="w-full h-full flex items-center justify-center">Loading...</div>
//           ) : posts.length > 0 ? (
//             posts.map((post) => {
//               const displayName = post.user?.name ?? post.User?.name ?? post.name ?? "Unknown";
//               const postedTime = post.totalTime ?? post.total_time ?? post.totalHours ?? "0";
//               const postId = post.id ?? post._id;
//               return (
//                 <div
//                   onClick={() => handlePostClick(post)}
//                   key={postId}
//                   className="post-item cursor-pointer p-4 mb-4 bg-white rounded shadow flex items-center justify-between bg-[#f1f3ff]"
//                 >
//                   <div>
//                     <Text size="txtInterSemiBold17">{displayName}</Text>
//                     <Text className="text-xs mt-1">Requested for {formatTime(String(postedTime))} Hours approval</Text>
//                   </div>
//                   <button
//                     className="text-[#546ef6] font-semibold border-2 rounded-md border-gray-300 p-2"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handlePostClick(post);
//                     }}
//                   >
//                     Review
//                   </button>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="w-full h-full flex items-center justify-center">
//               <Img className="w-[80%] h-auto object-cover object-center" src="images/nopost.svg" alt="No posts available for endorsement" />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DesktopSevenPage;




import React, { useEffect, useState } from "react";
import { Img, Text } from "components";
import { useNavigate } from "react-router-dom";
import { API_URL, APP_PATH } from "Constant";
import "./style.css";
import { toast } from "react-toastify";

const DesktopSevenPage = () => {
  const navigate = useNavigate();
  const notify = (e) => toast(String(e));
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // check token validity (returns boolean)
  const checkTokenExpiry = async (token) => {
    try {
      const response = await fetch(`${API_URL}/activity/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        console.warn("Token check returned non-OK:", response.status);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Error checking token expiry:", err);
      notify("Error checking session");
      return false;
    }
  };

  // fetch pending approvals (defensive)
const postForApproval = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      notify("Session expired — please login");
      navigate("/login");
      return;
    }

    const response = await fetch(`${API_URL}/activity/pendingApproval`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

    const data = await response.json();

    console.log("pendingApproval API:", data);

    if (!response.ok || !data.success) {
      notify(data.message || "Error fetching approval list");
      setPosts([]);
      return;
    }

    const arr = Array.isArray(data.posts) ? data.posts : [];
    setPosts(arr);

  } catch (error) {
    console.error("Error fetching pending approval posts:", error);
    notify("Error fetching pending approval posts");
    setPosts([]);
  } finally {
    setLoading(false);
  }
};







  // const postForApproval = async () => {
  //   setLoading(true);
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       notify("Session missing — please login");
  //       navigate("/login");
  //       return;
  //     }

  //     const response = await fetch(`${API_URL}/activity/pendingApproval`, {
  //       method: "GET",
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     const text = await response.text();
  //     let data;
  //     try {
  //       data = JSON.parse(text);
  //     } catch (e) {
  //       // not JSON; keep raw text for logging
  //       data = null;
  //     }

  //     console.log("pendingApproval response:", response.status, data ?? text);

  //     if (!response.ok) {
  //       const message = (data && data.message) || `Failed to fetch: ${response.status}`;
  //       notify(message);
  //       setPosts([]);
  //       return;
  //     }

  //     // Normalise various response shapes into an array
  //     let arr = [];
  //     if (Array.isArray(data)) arr = data;
  //     else if (Array.isArray(data?.data)) arr = data.data;
  //     else if (Array.isArray(data?.posts)) arr = data.posts;
  //     else if (Array.isArray(data?.rows)) arr = data.rows;
  //     else if (data && typeof data === "object") {
  //       // try find any array value
  //       const maybeArray = Object.values(data).find((v) => Array.isArray(v));
  //       if (maybeArray) arr = maybeArray;
  //     }

  //     if (!Array.isArray(arr)) {
  //       // If server returned JSON but not an array, try to coerce single object into array
  //       if (data && typeof data === "object" && Object.keys(data).length) {
  //         // if object looks like a single post (has id), wrap it
  //         if (data.id || data.postId || data._id) arr = [data];
  //       }
  //     }

  //     if (!Array.isArray(arr)) {
  //       console.warn("Could not extract posts array from response; treating as empty. Full response:", data ?? text);
  //       arr = [];
  //     }

  //     setPosts(arr);
  //   } catch (error) {
  //     console.error("Error fetching requests for approval", error);
  //     notify("Error fetching requests for approval");
  //     setPosts([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userKey = localStorage.getItem("userKey");

    if (!token || !userKey) {
      navigate("/login");
      return;
    }

    // call fetch + optionally check token
    postForApproval();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePostClick = (post) => {
    // accept various shapes for user id
    const userId =
      post.UserId ??
      post.userId ??
      post.User?.id ??
      post.user?.id ??
      (post.user && post.user.id) ??
      null;
    const id = post.id ?? post._id ?? null;

    if (!userId || !id) {
      console.warn("Missing UserId or id for post", post);
      notify("Cannot open post — missing identifiers");
      return;
    }

    navigate(`/reviewactivity/${userId}/${id}`);
    console.log("Navigating to review:", userId, id);
  };

  const goback = () => navigate("/admin");

  const formatTime = (time) => {
    if (time === null || time === undefined || time === "") return "0";
    // If numeric
    if (typeof time === "number") return String(time);
    // If string HH:MM
    if (typeof time === "string") {
      const trimmed = time.trim();
      if (trimmed.includes(":")) {
        const [h = "0", m = "0"] = trimmed.split(":");
        const hh = parseInt(h, 10);
        const mm = parseInt(m, 10);
        return mm ? `${hh}:${m.padStart(2, "0")}` : `${hh}`;
      }
      // if it's a decimal number in string form, return as-is
      if (!Number.isNaN(Number(trimmed))) return trimmed;
      // fallback
      return trimmed;
    }
    // fallback
    return String(time);
  };

  return (
    <div className="flex items-center justify-center p-4 sm:p-0 w-screen h-screen">
      <div className="relative w-4/12 h-full sm:w-full md:w-3/4 lg:w-3/4 flex flex-col items-center justify-start border-[1px] gap-4 rounded-lg sm:rounded-none overflow-hidden">
        <div className="bg-white-A700 flex items-center justify-start relative p-6 shadow-bs3 w-full">
          <div onClick={goback}>
            <Img className="h-4 cursor-pointer" src={APP_PATH + "images/img_arrowleft.svg"} alt="arrowleft" />
          </div>
          <Text className="text-base text-gray-900 absolute left-[35%]" size="txtInterSemiBold17">
            Approve Hours
          </Text>
        </div>

        <div className="post-showe w-full p-4 overflow-auto scroller">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">Loading...</div>
          ) : posts.length > 0 ? (
            posts.map((post) => {
              const displayName = post.user?.name ?? post.User?.name ?? post.name ?? "Unknown";
              const postedTime = post.totalTime ?? post.total_time ?? post.totalHours ?? "0";
              const postId = post.id ?? post._id ?? JSON.stringify(post).slice(0, 8);

              return (
                <div
                  onClick={() => handlePostClick(post)}
                  key={postId}
                  className="post-item cursor-pointer p-4 mb-4 bg-white rounded shadow flex items-center justify-between bg-[#f1f3ff]"
                >
                  <div>
                    <Text size="txtInterSemiBold17">{displayName}</Text>
                    <Text className="text-xs mt-1">Requested for {formatTime(String(postedTime))} Hours approval</Text>
                  </div>
                  <button
                    className="text-[#546ef6] font-semibold border-2 rounded-md border-gray-300 p-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePostClick(post);
                    }}
                  >
                    Review
                  </button>
                </div>
              );
            })
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Img className="w-[80%] h-auto object-cover object-center" src={APP_PATH + "images/nopost.svg"} alt="No posts available for endorsement" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopSevenPage;
