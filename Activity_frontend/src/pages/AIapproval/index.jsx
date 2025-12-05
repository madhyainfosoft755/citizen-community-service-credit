// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { Button, Img, Text } from 'components'
// import { API_URL, APP_PATH } from 'Constant'
// import { toast } from "react-toastify";
// import { format } from 'date-fns';



// const AIapproval = () => {

//   const notify = (e) => toast(e);
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState(null);
//   const [userName, setUserName] = useState(""); // Added state for user name
//   const [filteredPosts, setFilteredPosts] = useState([]); // State to store posts


//   const Name = userName.split(" ")[0];

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

//   // Check if both token and user key are present in local storage
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userKey = localStorage.getItem("userKey");

//     if (!token || !userKey) {
//       // Redirect to the login page if either token or user key is missing
//       navigate("/login");
//     } else {
//       // Fetch user data when component mounts
//       fetchUserData(token);
//       checkTokenExpiry(token);
//       fetchEndorsedPosts(token);
//     }

//     // You may also want to check the validity of the token here if needed

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [navigate]); //


//   const fetchUserData = async (token) => {
//     try {
//       const response = await fetch(`${API_URL}/activity/profile`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         // Check content type before parsing as JSON
//         const contentType = response.headers.get("content-type");
//         if (contentType && contentType.includes("application/json")) {
//           const userData = await response.json();
//           setUserName(userData.userData.name)
//           setUserData(userData); // Update user data in the state
//         } else {
//           console.error("Error fetching user data: Response is not JSON");
//           // Handle non-JSON response accordingly
//         }
//       } else {
//         console.error("Error fetching user data:", response.status);
//         const errorData = await response.text(); // Get the entire response as text
//         console.error("Error details:", errorData);
//         // Handle the error accordingly
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   };


//   const fetchEndorsedPosts = async (token) => {
//     try {
//       const response = await fetch(`${API_URL}/admin/fetchEndorsedPosts`, {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const posts = await response.json();
//         console.log("what are the posts", posts);

//         setFilteredPosts(posts);
//       } else {
//         console.error('Error fetching posts:', response.status);
//       }
//     } catch (error) {
//       console.error('Error fetching posts:', error);
//     }
//   };

//   const sendUnapprovedPosts = async () => {


//     const postsToSend = filteredPosts.slice(0, 100).map(post => ({
//       id: post.id,
//       image: post.photos, 
//       userphoto: post.user.photo
//     }));

//     console.log("kya posts ja rhe hain", postsToSend);

//     try {
//       const response = await fetch(`${API_URL}/admin/processUnapprovedPosts`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(postsToSend),
//       });

//       if (response.ok) {
//         notify("Posts sent successfully!");
//       } else {
//         notify("Failed to send posts");
//         console.error('Error sending posts:', response.status);
//       }
//     } catch (error) {
//       notify("An error occurred");
//       console.error('Error sending posts:', error);
//     }
//   }

//   const goback = () => {
//     window.history.back();
//   }


//   return (
//     <div className="w-screen h-screen  bg-white-A700 flex items-start justify-center sm:w-screen sm:h-screen md:w-screen md:h-screen p-5 sm:p-0">
//       <div className=" relative w-4/12 h-full sm:w-full sm:h-full md:w-3/4 md:h-full  lg:w-3/4 lg:h-full  flex flex-col items-center  justify-center border-[1px]  rounded-lg sm:rounded-none overflow-hidden">
//         <div className=" flex flex-col  items-center justify-start w-full h-full ">
//           <div className="bg-gray-50 flex flex-row items-center justify-between p-3 sm:p-5  sm:px-5 w-full ">

//             <div className="flex flex-row gap-4 items-center justify-center ml-[1px]">
//               <div onClick={goback}>
//                 <Img
//                   className="h-7 cursor-pointer"
//                   src={APP_PATH + "images/img_arrowleft.svg"}
//                   alt="arrowleft"
//                 />
//               </div>
//               {userData && (
//                 <Img
//                   className=" sm:w-[58px] sm:h-[52px] md:w-[58px] md:h-[52px] lg:w-[58px] lg:h-[58px]  w-14 h-12 rounded-full object-cover object-top  "
//                   src={`${API_URL}/image/${userData.userData.photo}`}
//                   alt="image"
//                   onClick={() => { navigate("/users-profile") }}

//                 />
//               )}
//               <div className="flex flex-col items-center justify-center w-3/5">
//                 <div className="flex flex-col items-start justify-center w-full">
//                   <Text
//                     className="text-center text-gray-900 uppercase"
//                     size="txtInterSemiBold16Gray900"
//                   >
//                     {Name}
//                   </Text>


//                 </div>
//               </div>
//             </div>


//           </div>
//           <div className='w-full h-full bg-orange-300 flex flex-col items-center justify-between p-3'>
//             <h1 className='font-semibold text-xl'>List of all the posts that are not approved</h1>

//             <div className={`scroller relative mt-5 w-full h-96 bg-blue-300  post-container ${filteredPosts.length === 0 ? "overflow-hidden" : "overflow-auto"}`}>
//               {filteredPosts.length === 0 ? (
//                 <div className="w-full h-full flex items-center justify-center">
//                   <Img
//                     className="w-1/2 h-auto object-cover object-center"
//                     src={APP_PATH + "images/nopost.svg"}
//                     alt="No posts available for endorsement"
//                   />
//                 </div>
//               ) : (
//                 <table className="w-52 border-collapse border-2">
//                   <thead className="">
//                     <tr className="border">
//                       <th className="border p-3">Sr. No.</th>
//                       <th className="border p-3">Post Id</th>
//                       <th className="border p-3">User profile</th>
//                       <th className="border p-3">Category</th>
//                       <th className="border p-3">Name</th>
//                       <th className="border px-8">Date</th>
//                       <th className="border p-3">Time</th>
//                       <th className="border p-3">Location</th>
//                       <th className="border p-3">Image</th>
//                       <th className="border p-3">Endorse</th>
//                     </tr>
//                   </thead>
//                   <tbody className=" ">
//                     {filteredPosts.map((post) => (
//                       <tr key={post.id} className=" border">
//                         <td className="border p-3 text-center">
//                           {filteredPosts.indexOf(post) + 1}
//                         </td>

//                         <td className="border p-3 text-center" >{post.id}</td>
//                         <td className="border p-3 text-center" ><img className='rounded' src={`${API_URL}/image/${post.user.photo}`} alt="post image" /></td>
//                         <td className="border p-3 text-center" >{post.category}</td>
//                         <td className="border p-3 text-center">{post.user ? post.user.name : 'Unknown'}</td>
//                         <td className="border p-1 text-center ">
//                           {format(post.Date, "dd-MM-yyy")}
//                         </td>
//                         <td className="border p-3 text-center">{post.totalTime}</td>
//                         <td className="border p-3 text-center">
                          
//                         </td>
//                         <td className="border p-3 text-center">
//                           <img className='rounded' src={`${API_URL}/image/${post.photos}`} alt="post image" />
//                         </td>

//                         <td className="w-full h-full items-center justify-center px-8">
//                             {post.endorsementCounter}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>

//               )}

//             </div>
//             <button onClick={sendUnapprovedPosts} className=' p-4 font-semibold bg-green-300 rounded-lg'>Auto Approve</button>
//           </div>
//         </div>
//       </div>
//     </div>

//   )
// }

// export default AIapproval






import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Img, Text } from 'components'
import { API_URL, APP_PATH } from 'Constant'
import { toast } from "react-toastify";
import { format } from 'date-fns';

const AIapproval = () => {
  const notify = (e) => toast(String(e));
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]); // always an array

  const Name = userName.split(" ")[0] || "";

  // ---- Helper: defensive photo filename extractor ----
  const getPhotoFilename = (photos) => {
    if (!photos && photos !== 0) return null;

    // already array -> return first element
    if (Array.isArray(photos)) {
      return photos.length ? String(photos[0]).trim() : null;
    }

    const str = String(photos).trim();

    // numeric-only values likely not filenames
    if (/^\d+$/.test(str)) return null;

    // if JSON-array string e.g. '["file.jpg"]'
    if (str.startsWith("[")) {
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed) && parsed.length) return String(parsed[0]).trim();
      } catch (e) {
        // fall-through to cleanup
      }
    }

    // comma-separated -> take first
    if (str.includes(",")) {
      const part = str.split(",")[0].replace(/["'\[\]]/g, "").trim();
      if (part) return part;
    }

    // if contains '@' or spaces (looks like email or 'name photo') treat invalid
    if (str.includes("@") || /\s/.test(str)) return null;

    // basic cleanup of surrounding quotes/brackets
    const cleaned = str.replace(/^[\s"'\[]+|[\s"'\]]+$/g, "");
    return cleaned || null;
  };

  // ---- Token / session check ----
  const checkTokenExpiry = async (token) => {
    try {
      const response = await fetch(`${API_URL}/activity/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        navigate("/login");
        notify("Session time Out");
      }
    } catch (error) {
      notify(error?.message || error);
      console.error("Error checking token expiry:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userKey = localStorage.getItem("userKey");

    if (!token || !userKey) {
      navigate("/login");
    } else {
      fetchUserData(token);
      checkTokenExpiry(token);
      fetchEndorsedPosts(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // ---- Fetch current user ----
  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${API_URL}/activity/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const ud = await response.json();
          setUserName(ud?.userData?.name || "");
          setUserData(ud);
        } else {
          console.error("Error fetching user data: Response is not JSON");
        }
      } else {
        console.error("Error fetching user data:", response.status);
        const errorData = await response.text();
        console.error("Error details:", errorData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // ---- Fetch posts (endorsed/unapproved) and normalise the response shape ----
  const fetchEndorsedPosts = async (token) => {
    try {
      const response = await fetch(`${API_URL}/admin/fetchEndorsedPosts`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("raw fetchEndorsedPosts response:", data);

        let postsArray = [];
        if (Array.isArray(data)) postsArray = data;
        else if (Array.isArray(data.posts)) postsArray = data.posts;
        else if (Array.isArray(data.data)) postsArray = data.data;
        else {
          const maybeValues = Object.values(data || {});
          if (maybeValues.every(v => typeof v === 'object')) postsArray = maybeValues;
        }
        if (!Array.isArray(postsArray)) postsArray = [];
        setFilteredPosts(postsArray);
      } else {
        console.error('Error fetching posts:', response.status);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // ---- Send selected posts to processing endpoint (safe mapping) ----
  const sendUnapprovedPosts = async () => {
    const safePosts = Array.isArray(filteredPosts) ? filteredPosts : [];

    const postsToSend = safePosts.slice(0, 100).map(post => ({
      id: post.id,
      image: getPhotoFilename(post.photos),
      userphoto: getPhotoFilename(post.user?.photo),
    }));

    console.log("kya posts ja rhe hain", postsToSend);

    try {
      const response = await fetch(`${API_URL}/admin/processUnapprovedPosts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postsToSend),
      });

      if (response.ok) {
        notify("Posts sent successfully!");
      } else {
        notify("Failed to send posts");
        console.error('Error sending posts:', response.status);
      }
    } catch (error) {
      notify("An error occurred");
      console.error('Error sending posts:', error);
    }
  };

  const goback = () => window.history.back();

  // ---- render ----
  return (
    <div className="w-screen h-screen bg-white-A700 flex items-start justify-center p-5 sm:p-0">
      <div className="relative w-4/12 h-full sm:w-full md:w-3/4 lg:w-3/4 flex flex-col items-center justify-center border-[1px] rounded-lg overflow-hidden">
        <div className="flex flex-col items-center justify-start w-full h-full">
          <div className="bg-gray-50 flex flex-row items-center justify-between p-3 w-full">
            <div className="flex flex-row gap-4 items-center ml-1">
              <div onClick={goback}>
                <Img className="h-7 cursor-pointer" src={APP_PATH + "images/img_arrowleft.svg"} alt="arrowleft" />
              </div>
              {userData && (
                // use plain <img> for robust onError handling
                <img
                  className="w-14 h-12 rounded-full object-cover cursor-pointer"
                  src={
                    (getPhotoFilename(userData?.userData?.photo)
                      ? `${API_URL}/image/${encodeURIComponent(getPhotoFilename(userData.userData.photo))}`
                      : `${APP_PATH}images/nopost.svg`)
                  }
                  alt="user"
                  onClick={() => navigate("/users-profile")}
                  onError={(e) => { e.target.onerror = null; e.target.src = `${APP_PATH}images/nopost.svg`; }}
                />
              )}
              <div className="flex flex-col items-center justify-center w-3/5">
                <Text className="text-center text-gray-900 uppercase" size="txtInterSemiBold16Gray900">{Name}</Text>
              </div>
            </div>
          </div>

          <div className="w-full h-full bg-orange-300 flex flex-col items-center justify-between p-3">
            <h1 className="font-semibold text-xl">List of all the posts that are not approved</h1>

            <div className={`scroller relative mt-5 w-full h-96 bg-blue-300 post-container ${filteredPosts.length === 0 ? "overflow-hidden" : "overflow-auto"}`}>
              {filteredPosts.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Img className="w-1/2 h-auto object-cover" src={APP_PATH + "images/nopost.svg"} alt="No posts available" />
                </div>
              ) : (
                <table className="w-full border-collapse border-2">
                  <thead>
                    <tr className="border">
                      <th className="border p-3">Sr. No.</th>
                      <th className="border p-3">Post Id</th>
                      <th className="border p-3">User profile</th>
                      <th className="border p-3">Category</th>
                      <th className="border p-3">Name</th>
                      <th className="border px-8">Date</th>
                      <th className="border p-3">Time</th>
                      <th className="border p-3">Location</th>
                      <th className="border p-3">Image</th>
                      <th className="border p-3">Endorse</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.map((post, index) => {
                      // Defensive date parse
                      let formattedDate = "N/A";
                      try {
                        if (post?.Date) {
                          const d = new Date(post.Date);
                          if (!isNaN(d)) formattedDate = format(d, "dd-MM-yyyy");
                        }
                      } catch (err) {
                        console.warn("Date parse error for post", post?.id, err);
                      }

                      // get cleaned filenames and build URLs (or null)
                      const userFilename = getPhotoFilename(post.user?.photo);
                      const userPhoto = userFilename ? `${API_URL}/image/${encodeURIComponent(userFilename)}` : null;

                      const postFilename = getPhotoFilename(post.photos);
                      const postImage = postFilename ? `${API_URL}/image/${encodeURIComponent(postFilename)}` : null;

                      return (
                        <tr key={post.id ?? index} className="border">
                          <td className="border p-3 text-center">{index + 1}</td>
                          <td className="border p-3 text-center">{post.id}</td>
                          <td className="border p-3 text-center">
                            {userPhoto ? (
                              <img
                                className="rounded w-12 h-12 object-cover mx-auto"
                                src={userPhoto}
                                alt="user profile"
                                onError={(e) => { e.target.onerror = null; e.target.src = `${APP_PATH}images/nopost.svg`; }}
                              />
                            ) : "No photo"}
                          </td>
                          <td className="border p-3 text-center">{post.category}</td>
                          <td className="border p-3 text-center">{post.user?.name || 'Unknown'}</td>
                          <td className="border p-1 text-center">{formattedDate}</td>
                          <td className="border p-3 text-center">{post.totalTime || 'N/A'}</td>
                          <td className="border p-3 text-center">{post.location || 'N/A'}</td>
                          <td className="border p-3 text-center">
                            {postImage ? (
                              <img
                                className="rounded max-w-[120px] max-h-[90px] mx-auto"
                                src={postImage}
                                alt="post image"
                                onError={(e) => { e.target.onerror = null; e.target.src = `${APP_PATH}images/nopost.svg`; }}
                              />
                            ) : "No image"}
                          </td>
                          <td className="w-full h-full items-center justify-center px-8 text-center">
                            {post.endorsementCounter ?? 0}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <button onClick={sendUnapprovedPosts} className="p-4 font-semibold bg-green-300 rounded-lg">Auto Approve</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIapproval;







// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { Button, Img, Text } from 'components'
// import { API_URL, APP_PATH } from 'Constant'
// import { toast } from "react-toastify";
// import { format } from 'date-fns';

// const AIapproval = () => {
//   const notify = (e) => toast(e);
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState(null);
//   const [userName, setUserName] = useState("");
//   const [filteredPosts, setFilteredPosts] = useState([]); // always an array

//   const Name = userName.split(" ")[0] || "";

//   const checkTokenExpiry = async (token) => {
//     try {
//       const response = await fetch(`${API_URL}/activity/profile`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         navigate("/login")
//         notify("Session time Out")
//       }
//     } catch (error) {
//       notify(error.message || error)
//       console.error("Error checking token expiry:", error);
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userKey = localStorage.getItem("userKey");

//     if (!token || !userKey) {
//       navigate("/login");
//     } else {
//       fetchUserData(token);
//       checkTokenExpiry(token);
//       fetchEndorsedPosts(token);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [navigate]);

//   const fetchUserData = async (token) => {
//     try {
//       const response = await fetch(`${API_URL}/activity/profile`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const contentType = response.headers.get("content-type");
//         if (contentType && contentType.includes("application/json")) {
//           const userData = await response.json();
//           // Defensive access - ensure nested userData.userData exists
//           setUserName(userData?.userData?.name || "");
//           setUserData(userData);
//         } else {
//           console.error("Error fetching user data: Response is not JSON");
//         }
//       } else {
//         console.error("Error fetching user data:", response.status);
//         const errorData = await response.text();
//         console.error("Error details:", errorData);
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   };

//   const fetchEndorsedPosts = async (token) => {
//     try {
//       const response = await fetch(`${API_URL}/admin/fetchEndorsedPosts`, {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log("raw fetchEndorsedPosts response:", data);

//         // Normalise to an array in all cases
//         let postsArray = [];
//         if (Array.isArray(data)) {
//           postsArray = data;
//         } else if (Array.isArray(data.posts)) {
//           postsArray = data.posts;
//         } else if (Array.isArray(data.data)) {
//           // Sometimes APIs use `data` key
//           postsArray = data.data;
//         } else {
//           // fallback: if object has numeric keys, try Object.values
//           const maybeValues = Object.values(data || {});
//           if (maybeValues.every(v => typeof v === 'object')) {
//             postsArray = maybeValues;
//           }
//         }

//         // final safety: ensure it's an array
//         if (!Array.isArray(postsArray)) postsArray = [];

//         setFilteredPosts(postsArray);
//       } else {
//         console.error('Error fetching posts:', response.status);
//       }
//     } catch (error) {
//       console.error('Error fetching posts:', error);
//     }
//   };

//   const sendUnapprovedPosts = async () => {
//     // Ensure filteredPosts is an array
//     const safePosts = Array.isArray(filteredPosts) ? filteredPosts : [];

//     const postsToSend = safePosts.slice(0, 100).map(post => ({
//       id: post.id,
//       // if photos is an array, pick first
//       image: Array.isArray(post.photos) ? post.photos[0] : post.photos,
//       userphoto: post.user?.photo
//     }));

//     console.log("kya posts ja rhe hain", postsToSend);

//     try {
//       const response = await fetch(`${API_URL}/admin/processUnapprovedPosts`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(postsToSend),
//       });

//       if (response.ok) {
//         notify("Posts sent successfully!");
//       } else {
//         notify("Failed to send posts");
//         console.error('Error sending posts:', response.status);
//       }
//     } catch (error) {
//       notify("An error occurred");
//       console.error('Error sending posts:', error);
//     }
//   }

//   const goback = () => {
//     window.history.back();
//   }

//   return (
//     <div className="w-screen h-screen  bg-white-A700 flex items-start justify-center sm:w-screen sm:h-screen md:w-screen md:h-screen p-5 sm:p-0">
//       <div className=" relative w-4/12 h-full sm:w-full sm:h-full md:w-3/4 md:h-full  lg:w-3/4 lg:h-full  flex flex-col items-center  justify-center border-[1px]  rounded-lg sm:rounded-none overflow-hidden">
//         <div className=" flex flex-col  items-center justify-start w-full h-full ">
//           <div className="bg-gray-50 flex flex-row items-center justify-between p-3 sm:p-5  sm:px-5 w-full ">
//             <div className="flex flex-row gap-4 items-center justify-center ml-[1px]">
//               <div onClick={goback}>
//                 <Img
//                   className="h-7 cursor-pointer"
//                   src={APP_PATH + "images/img_arrowleft.svg"}
//                   alt="arrowleft"
//                 />
//               </div>
//               {userData && (
//                 <Img
//                   className=" sm:w-[58px] sm:h-[52px] md:w-[58px] md:h-[52px] lg:w-[58px] lg:h-[58px]  w-14 h-12 rounded-full object-cover object-top  "
//                   src={`${API_URL}/image/${userData.userData?.photo}`}
//                   alt="image"
//                   onClick={() => { navigate("/users-profile") }}
//                 />
//               )}
//               <div className="flex flex-col items-center justify-center w-3/5">
//                 <div className="flex flex-col items-start justify-center w-full">
//                   <Text
//                     className="text-center text-gray-900 uppercase"
//                     size="txtInterSemiBold16Gray900"
//                   >
//                     {Name}
//                   </Text>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className='w-full h-full bg-orange-300 flex flex-col items-center justify-between p-3'>
//             <h1 className='font-semibold text-xl'>List of all the posts that are not approved</h1>

//             <div className={`scroller relative mt-5 w-full h-96 bg-blue-300  post-container ${filteredPosts.length === 0 ? "overflow-hidden" : "overflow-auto"}`}>
//               {filteredPosts.length === 0 ? (
//                 <div className="w-full h-full flex items-center justify-center">
//                   <Img
//                     className="w-1/2 h-auto object-cover object-center"
//                     src={APP_PATH + "images/nopost.svg"}
//                     alt="No posts available for endorsement"
//                   />
//                 </div>
//               ) : (
//                 <table className="w-52 border-collapse border-2">
//                   <thead className="">
//                     <tr className="border">
//                       <th className="border p-3">Sr. No.</th>
//                       <th className="border p-3">Post Id</th>
//                       <th className="border p-3">User profile</th>
//                       <th className="border p-3">Category</th>
//                       <th className="border p-3">Name</th>
//                       <th className="border px-8">Date</th>
//                       <th className="border p-3">Time</th>
//                       <th className="border p-3">Location</th>
//                       <th className="border p-3">Image</th>
//                       <th className="border p-3">Endorse</th>
//                     </tr>
//                   </thead>
//                   <tbody className=" ">
//                     {filteredPosts.map((post, index) => {
//                       // Defensive parsing of date
//                       let formattedDate = "N/A";
//                       try {
//                         if (post?.Date) {
//                           const d = new Date(post.Date);
//                           if (!isNaN(d)) {
//                             formattedDate = format(d, "dd-MM-yyyy");
//                           }
//                         }
//                       } catch (err) {
//                         console.warn("Date parse error for post", post?.id, err);
//                       }

//                       const userPhoto = post.user?.photo ? `${API_URL}/image/${post.user.photo}` : null;
//                       const postImage = Array.isArray(post.photos) ? `${API_URL}/image/${post.photos[0]}` : (post.photos ? `${API_URL}/image/${post.photos}` : null);

//                       return (
//                         <tr key={post.id || index} className=" border">
//                           <td className="border p-3 text-center">
//                             {index + 1}
//                           </td>

//                           <td className="border p-3 text-center" >{post.id}</td>
//                           <td className="border p-3 text-center" >
//                             {userPhoto ? <img className='rounded' src={userPhoto} alt="user profile" /> : "No photo"}
//                           </td>
//                           <td className="border p-3 text-center" >{post.category}</td>
//                           <td className="border p-3 text-center">{post.user?.name || 'Unknown'}</td>
//                           <td className="border p-1 text-center ">
//                             {formattedDate}
//                           </td>
//                           <td className="border p-3 text-center">{post.totalTime || 'N/A'}</td>
//                           <td className="border p-3 text-center">
//                             {post.location || 'N/A'}
//                           </td>
//                           <td className="border p-3 text-center">
//                             {postImage ? <img className='rounded' src={postImage} alt="post image" /> : "No image"}
//                           </td>

//                           <td className="w-full h-full items-center justify-center px-8">
//                               {post.endorsementCounter ?? 0}
//                           </td>
//                         </tr>
//                       )
//                     })}
//                   </tbody>
//                 </table>
//               )}
//             </div>

//             <button onClick={sendUnapprovedPosts} className=' p-4 font-semibold bg-green-300 rounded-lg'>Auto Approve</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AIapproval
