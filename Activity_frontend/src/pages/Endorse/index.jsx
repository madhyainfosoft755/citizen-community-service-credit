// import React, { useEffect, useRef, useState } from "react";
// import { Button, Img, Text } from "components";
// import { API_URL, APP_PATH } from "Constant";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "components/AuthProvider/AuthProvider";
// import Location from "pages/Location/Location";
// import { Transition } from "@headlessui/react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faMagnifyingGlass, faUser } from "@fortawesome/free-solid-svg-icons";
// import axios from "axios";
// import PopupComponent from "components/popup";
// import "./style.css";
// import { toast } from "react-toastify";
// import { convertToHours } from "utils";
// import { format } from "date-fns";
// const Endorse = () => {
//   const [imageLoaded, setImageLoaded] = useState(true);
//   const notify = (e) => toast(e);
//   const [isPopUpVisible, setIsPopUpVisible] = useState(false); // State for pop-up visibility
//   const [selectedPost, setSelectedPost] = useState(null); // State for selected post
//   const [checkedPosts, setCheckedPosts] = useState([]);
//   const [userPosts, setUserPosts] = useState([]);
//   const [filteredPosts, setFilteredPosts] = useState([]);
//   const [error, setError] = useState(null);
//   const { authenticated, setAuthenticated } = useAuth();
//   const [userData, setUserData] = useState(null);
//   const navigate = useNavigate();
//   const [locationData, setLocationData] = useState(null);
//   const [totalTime, setTotalTime] = useState(null);
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState({
//     category: "",
//     userName: "",
//   });
//   const transitionRef = useRef(null);
//   const searchBarRef = useRef(null); // Ref for the search bar component
//   // const categories = [
//   //   { id: 1, label: "Gardening" },
//   //   { id: 2, label: "Cleaning" },
//   //   { id: 3, label: "Teaching Poor" },
//   //   { id: 4, label: "Planting Tree" },
//   //   { id: 5, label: "Marathon" },
//   //   { id: 6, label: "Social Activities" },
//   // ];

//   const [categories, setCategories] = useState([])
//   const [cityNames, setCityNames] = useState({}); // Default value can be 'Unknown City'
//   const [popupData, setPopupData] = useState(null);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [userName, setUserName] = useState("")
//   const [endorsedPosts, setEndorsedPosts] = useState([]); // State variable to track endorsed posts
//   const [refresh, setRefresh] = useState(false)


//   const fetchCategories = async () => {
//     try {
//       const response = await fetch(`${API_URL}/activity/getCategoriesAdmin`);
//       if (!response.ok) {
//         toast.error('Failed to fetch categories');
//       }
//       const data = await response.json();
//       // console.log("ye hai categories", data)
//       setCategories(data);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   }

//   useEffect(() => {
//     // Fetch categories when component mounts
//     fetchCategories();
//   }, []);


//   // Function to open the popup with photos and videos
//   const openPopup = (post) => {
//     setPopupData(post);
//     setIsPopupOpen(true);
//   };

//   // Function to close the popup
//   const closePopup = () => {
//     setPopupData(null);
//     setIsPopupOpen(false);
//   };

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

//   //sends token and userkey to local storage
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userKey = localStorage.getItem("userKey");

//     if (!token || !userKey) {
//       navigate("/login");
//     } else {
//       fetchUserData(token);
//       checkTokenExpiry(token);
//     }
//   }, [navigate]);

//   //if user data is avaliable then fetch posts
//   // useEffect(() => {
//   //   if (userData?.userData?.id) {
//   //     fetchUserPosts(userData.userData.id);
//   //   }
//   // }, [userData]);

//   const handleLocationChange = (latitude, longitude) => {
//     setLocationData({ latitude, longitude });
//   };

//   //if location data is avaliable the fetch posts in that area
//   useEffect(() => {
//     if (locationData) {
//       fetchPostsInArea(locationData.latitude, locationData.longitude);
//     }
//   }, [locationData, userData, refresh]);

//   //fetch userdata
//   const fetchUserData = async (token) => {
//     try {
//       const response = await fetch(`${API_URL}/activity/profile`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const userData = await response.json();
//       if (response.ok) {
//         setUserName(userData.userData.name)
//         setUserData(userData);
//         // console.log("this is user data", userData)
//       } else {
//         console.error("Error fetching user data:", response.status);
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   };

//   const name = userName.split(" ")[0];


//   useEffect(() => {
//     const totalTimeSpent = async (userId) => {
//       try {
//         if (userData && userData.userData) {
//           const token = localStorage.getItem("token");
//           const response = await fetch(`${API_URL}/activity/TotalTimeSpent/${userData.userData.id}`, {
//             method: "POST",
//             headers: { Authorization: `Bearer ${token}` },
//           });

//           const data = await response.json();
//           if (response.ok) {
//             setTotalTime(data.totalTimeSum)
//           }
//         }
//       }
//       catch (error) {
//         console.error("Error fetching user total time", error);
//         setError("An error occurred while fetching users Time.");
//       }
//     }
//     totalTimeSpent()
//   }, [userData])

//   //fetch posts avaliable in the latitude and longitude
//   const fetchPostsInArea = async (latitude, longitude) => {

//     try {
//       const newdata = {
//         latitude,
//         longitude,
//         userId: userData?.userData?.id,
//         username: userData?.userData?.name
//       }
//       // console.log("this is the user id", newdata)
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_URL}/activity/fetchPostsInArea`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newdata),

//       });
//       // console.log("kya response aa rha hai", latitude, longitude);
     
//       if (response.ok) {
//         const postsData = await response.json();
//         setUserPosts(postsData);
//         setFilteredPosts(postsData); // Initialize filtered posts with posts in the area
//       } else {
//         console.error("Error fetching posts in area:", response.status);
//         setError("An error occurred while fetching posts in area.");
//       }
//     } catch (error) {
//       console.error("Error fetching posts in area:", error);
//       setError("An error occurred while fetching posts in area.");
//     }
//   };

//   // Update filtered posts when user posts change
//   useEffect(() => {
//     setFilteredPosts(userPosts);
//   }, [userPosts]);

//   //search bar handler
//   const handleSearch = () => {
//     const { category, userName } = searchQuery;
//     let filtered = userPosts;
//     if (category) {
//       filtered = filtered.filter(
//         (post) =>
//           post.category &&
//           post.category.toLowerCase().includes(category.toLowerCase())
//       );
//     }
//     if (userName) {
//       filtered = filtered.filter(
//         (post) =>
//           post.category &&
//           post.user.name.toLowerCase().includes(userName.toLowerCase())
//       );
//     }
//     setFilteredPosts(filtered);
//   };

//   // Update filtered posts when searchQuery changes
//   useEffect(() => {
//     handleSearch();
//   }, [searchQuery]);

//   //logout function
//   const handleLogout = () => {
//     setAuthenticated(false);
//     localStorage.removeItem("token");
//     localStorage.removeItem("userKey");
//     navigate("/login");
//   };

//   //navigate to create page
//   const direct = () => {
//     navigate("/create");
//   };

//   //animation for search bar
//   useEffect(() => {
//     let timer;
//     if (isOpen) {
//       timer = setTimeout(() => {
//         setIsOpen(false);
//       }, 30000);
//     }

//     return () => clearTimeout(timer);
//   }, [isOpen]);

//   // Create an event listener to handle clicks outside of the search bar
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         searchBarRef.current &&
//         !searchBarRef.current.contains(event.target)
//       ) {
//         setIsOpen(false); // Close the search bar if clicked outside
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   useEffect(() => {
//     const fetchCityNames = async (posts) => {
//       const promises = filteredPosts.map(async (post) => {
//         if (post.latitude && post.longitude) {
//           const cityName = await fetchCityName(post.latitude, post.longitude);
//           return { postId: post.id, cityName };
//         }
//         return { postId: post.id, cityName: "Unknown City" };
//       });
//       const resolvedCityNames = await Promise.all(promises);
//       const cityNamesObject = resolvedCityNames.reduce((acc, item) => {
//         acc[item.postId] = item.cityName;
//         return acc;
//       }, {});
//       setCityNames(cityNamesObject);
//     };
//     fetchCityNames(filteredPosts);
//   }, [filteredPosts]);

//   const fetchCityName = async (latitude, longitude) => {
//     try {
//       const response = await axios.get(
//         // `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GoogleGeocode}`
//           `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${process.env.REACT_APP_OPENCAGE_KEY}`
//       );

//       if (response.data && response.data.results) {
//         const addressComponents = response.data.results[0].address_components;
//         const cityObj = addressComponents.find(component =>
//           component.types.includes('locality')
//         );

//         const city = cityObj ? cityObj.long_name : 'Unknown City';
//         return city;
//       }
//       return 'Unknown City';
//     } catch (error) {
//       console.error("Error fetching location data:", error);
//       return "Unknown City";
//     }
//   };

//   const renderCityName = (postId) => {
//     return cityNames[postId] || "Loading...";
//   };

//   // const [textIndex, setTextIndex] = useState(0);
//   // const carouselTexts = [`${totalTime || 0} Hours`, 'Create Activity']; // Add your carousel text here

//   // useEffect(() => {
//   //   const interval = setInterval(() => {
//   //     setTextIndex((prevIndex) => (prevIndex + 1) % carouselTexts.length);
//   //   }, 2000); // Change text every 2 seconds

//   //   return () => clearInterval(interval);
//   // }, []);


//   const handleCheckboxChange = (postId, isChecked) => {
//     if (isChecked) {
//       setCheckedPosts((prevChecked) => [...prevChecked, postId]);
//     } else {
//       setCheckedPosts((prevChecked) => prevChecked.filter((id) => id !== postId));
//     }
//   };

//   const handleEndorseAll = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       // Loop through all checked posts and endorse them
//       for (const postId of checkedPosts) {
//         const response = await fetch(`${API_URL}/activity/endorsePost/${postId}`, {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ userId: userData.userData.id }),
//         });
//       }
//       setRefresh(!refresh)

//       // After endorsing all posts, update the UI or perform any necessary actions
//       notify("Selected posts are endorsed")
//       // Clear the checked posts after endorsing
//       setCheckedPosts([]);
//     } catch (error) {
//       console.error("Error endorsing posts:", error);
//       notify(error)
//       // Handle error accordingly
//     }
//   };

//   const openProfilePopup = () => {
//     if (userData && userData.userData) {
//       setSelectedPost({ photos: userData.userData.photo });
//       setIsPopUpVisible(true);
//     }
//   };

//   const createpage = () => {
//     console.log("clicked");
//     navigate("/create");
//   }

  
//   // console.log("all filtered post", filteredPosts);
  
//   return (
//     <>
//       {authenticated && (
//         <div className=" flex items-center justify-center w-screen h-screen sm:w-screen sm:h-screen md:w-screen md:h-screen p-4 sm:p-0 md:pt-2 md:pb-2">
//           {isPopUpVisible && (
//             <PopupComponent post={selectedPost} onClose={() => setIsPopUpVisible(false)} />
//           )}
//           <div className="bg-white-A700 flex flex-col items-start justify-start sm:px-0  border-[1px] rounded-lg sm:rounded-none w-4/12 h-full sm:w-full sm:h-full md:w-7/12 md:h-full">
//             <div className="flex flex-col gap-3 items-center justify-start w-full h-full   sm:p-0 ">
//               <div className="relative bg-gray-50 flex flex-row items-center justify-between p-3  sm:px-2 w-full rounded-md sm:rounded-none ">

//                 <div className="flex gap-3 items-center justify-between " >
//                 {userData && userData.userData && (
//                     userData.userData.photo && imageLoaded ? (
//                       <Img
//                         className="cursor-pointer w-14 h-14 rounded-full object-cover object-top"
//                         src={`${API_URL}/image/${userData.userData.photo}`}
//                         alt="User Photo"
//                         onClick={() => { navigate("/users-profile") }}
//                         onError={() => setImageLoaded(false)}
//                       />
//                     ) : (
//                       <div className="bg-white-A700 w-16 h-14 rounded-full flex items-center justify-center">

//                         <FontAwesomeIcon
//                           icon={faUser}
//                           className="ri-user-fill h-1/2 cursor-pointer text-gray-600"
//                           onClick={() => { navigate("/users-profile") }}
//                         />
//                       </div>
//                     )
//                   )}
//                   <div className="flex flex-col items-center justify-center w-3/5">
//                     <div className="cursor-default flex flex-col items-start justify-center w-full">
//                       <Text
//                         className="text-center text-gray-900 uppercase cursor-pointer"
//                         size="txtInterSemiBold16Gray900"
//                         onClick={() => { navigate("/users-profile") }}
//                       >
//                         {/* {userData && userData.userData.name} */}
//                         {name}
//                       </Text>
//                       <Text className="text-center  text-gray-900 uppercase text-sm">
//                         ID: {userData && userData.userData.id}
//                       </Text>
//                     </div>
//                   </div>
//                 </div>
//                 <Button
//                   type="button"
//                   className="cursor-pointer font-semibold rounded-3xl  text-blue-500 bg-white-A700 text-xs"
//                   onClick={direct}
//                 >
//                   {`${totalTime || 0} Hrs | ${totalTime && convertToHours(totalTime)} Pts`}
//                   {/* <FontAwesomeIcon icon={faLocationDot} className="pr-3 text-blue-600" /> */}
//                 </Button>
//                 <img  onClick={createpage} src={APP_PATH + "images/2.png"} className="cursor-pointer w-14 h-14 rounded-full" alt="" />

//               </div>

//               <div className="w-full h-full  bg-[#f4f6ff]  rounded-md overflow-hidden flex flex-col items-center justify-top gap-5 ">
//                 <h1 className="text-right text-xs w-fit ml-auto hidden">
//                   {" "}
//                   <Location onLocationChange={handleLocationChange} />
//                 </h1>

//                 <div className="mt-3 mb-5 relative w-5/6 md:w-64">
//                   <div className="relative">
//                     <button
//                       onClick={() => {

//                         setIsOpen(!isOpen);
//                       }}
//                       className="absolute z-20  right-2 top-1 flex items-center justify-center bg-blue-500 text-white rounded-full w-8 h-8 focus:outline-none"
//                     >
//                       <FontAwesomeIcon icon={faMagnifyingGlass} />
//                     </button>
//                     <Transition
//                       show={isOpen}
//                       enter="transition ease-out duration-200 transform"
//                       enterFrom="opacity-0 scale-95"
//                       enterTo="opacity-100 scale-100"
//                       leave="transition ease-in duration-150 transform"
//                       leaveFrom="opacity-100 scale-100"
//                       leaveTo="opacity-0 scale-95"
//                     >
//                       {(ref) => {
//                         transitionRef.current = ref;
//                         return (
//                           <div
//                             ref={searchBarRef}
//                             className="absolute -top-[10px] right-0 w-full sm:w-64 bg-white border border-gray-300 rounded-lg shadow-sm mt-2 z-10"
//                           >
//                             <select
//                               className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500 cursor-pointer"
//                               value={searchQuery.category}
//                               onChange={(e) =>
//                                 setSearchQuery({
//                                   ...searchQuery,
//                                   category: e.target.value,
//                                 })
//                               }
//                             >
//                               <option className="sm:text-xs" value="">All Categories</option>
//                               {/* Map over categories and render options */}
//                               {categories?.map((category) => (
//                                 <option className="sm:text-xs" key={category.id} value={category.name}>
//                                   {category?.name}
//                                 </option>
//                               ))}
//                             </select>
//                             <input
//                               type="text"
//                               placeholder="Search by username..."
//                               className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
//                               value={searchQuery.userName}
//                               onChange={(e) =>
//                                 setSearchQuery({
//                                   ...searchQuery,
//                                   userName: e.target.value,
//                                 })
//                               }
//                             />
//                           </div>
//                         );
//                       }}
//                     </Transition>
//                   </div>
//                 </div>

//                 <div className={`scroller relative mt-5 w-full h-full  post-container ${filteredPosts.length === 0 ? "overflow-hidden" : "overflow-auto"}`}>
//                   {filteredPosts.length === 0 ? (
//                     <div className="w-full h-full flex items-center justify-center">
//                       <Img
//                         className="w-1/2 h-auto object-cover object-center"
//                         src={APP_PATH + "images/nopost.svg"}
//                         alt="No posts available for endorsement"
//                       />
//                     </div>
//                   ) : (
//                     <table className="w-52 border-collapse border-2 cursor-default">
//                       <thead className="">
//                         <tr className="border">
//                           <th className="border p-3">S.No.</th>
//                           <th className="border p-3">Category</th>
//                           <th className="border p-3">Name</th>
//                           <th className="border px-8">Date</th>
//                           <th className="border p-3">Time</th>
//                           <th className="border p-3">Location</th>
//                           <th className="border p-3">Image</th>
//                           <th className="border p-3">Endorse</th>
//                         </tr>
//                       </thead>
//                       <tbody className=" ">
//                         {filteredPosts?.map((post , index ) => (
//                           <tr key={post.id} className=" border">
//                           <td className="border p-3 text-center">{index + 1}</td>
//                             <td className="border p-3 text-center" >{post.category}</td>
//                             <td className="border p-3 text-center">{post.user ? post.user.name : 'Unknown'}</td>
//                             <td className="border p-1 text-center ">
//                               {format(post.Date, "dd-MM-yyy")}
//                             </td>
//                             <td className="border p-3 text-center">{post.totalTime}</td>
//                             <td className="border p-3 text-center">
//                               {post.latitude && post.longitude ? (
//                                 <span>{renderCityName(post.id)}</span>
//                               ) : (
//                                 'Unknown City'
//                               )}
//                             </td>
//                             <td className="border p-3 text-center">
//                               <a
//                                 href="#"
//                                 onClick={() => openPopup(post)}
//                                 className="text-[#546ef6] underline"
//                               >
//                                 View
//                               </a>
//                             </td>
                           
//                             <td className="w-full h-full items-center justify-center px-8">
//                               <input
//                                 type="checkbox"
//                                 id={`endorsement_${post.id}`}
//                                 checked={checkedPosts.includes(post.id)}
//                                 // disabled={endorsedPosts.includes(post.id)} // Disable the checkbox if post is already endorsed
//                                 className="border-2 border-[#546ef6] border-solid p-2 rounded-lg"
//                                 onChange={(e) => handleCheckboxChange(post.id, e.target.checked)}
//                               />
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>

//                   )}
//                 </div>


//                 {/* Popup/Modal */}
//                 {isPopupOpen && (
//                   <div className="popup-overlay">
//                     <div className="popup-content ">
//                       <PopupComponent
//                         className="w-screen h-screen overflow-scroll flex flex-col items-center justify-center gap-5"
//                         post={popupData}
//                         onClose={closePopup}
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>
//               {checkedPosts.length > 0 && (
//                 <button className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleEndorseAll}>
//                   Endorse Selected Posts
//                 </button>
//               )}
//               {/* <Button
//                 className="cursor-pointer font-semibold w-5/6  mb-2 text-base text-center"
//                 shape="round"
//                 color="indigo_A200"
//                 onClick={handleLogout}
//               >
//                 LOGOUT
//               </Button> */}
//             </div>
//           </div>
//         </div>

//       )}
//     </>
//   );
// };

// export default Endorse;










// import React, { useEffect, useRef, useState } from "react";
// import { Button, Img, Text } from "components";
// import { API_URL, APP_PATH } from "Constant";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "components/AuthProvider/AuthProvider";
// import Location from "pages/Location/Location";
// import { Transition } from "@headlessui/react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faMagnifyingGlass, faUser } from "@fortawesome/free-solid-svg-icons";
// import axios from "axios";
// import PopupComponent from "components/popup";
// import "./style.css";
// import { toast } from "react-toastify";
// import { convertToHours } from "utils";
// import { format } from "date-fns";

// const Endorse = () => {
//   const notify = (e) => toast(String(e));
//   const { authenticated, setAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   const [imageLoaded, setImageLoaded] = useState(true);
//   const [isPopUpVisible, setIsPopUpVisible] = useState(false);
//   const [popupData, setPopupData] = useState(null);

//   const [checkedPosts, setCheckedPosts] = useState([]);
//   const [userPosts, setUserPosts] = useState([]);
//   const [filteredPosts, setFilteredPosts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [cityNames, setCityNames] = useState({});
//   const [userData, setUserData] = useState(null); // normalized as { userData: {...} }
//   const [totalTime, setTotalTime] = useState(null);
//   const [searchQuery, setSearchQuery] = useState({ category: "", userName: "" });
//   const [isOpen, setIsOpen] = useState(false);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [refresh, setRefresh] = useState(false);

//   const searchBarRef = useRef(null);

//   // fallback coords provided by user
//   const FALLBACK_LAT = 25.2040121350756;
//   const FALLBACK_LON = 75.83546141599031;

//   // helper: robust filename extractor
//   const getPhotoFilename = (photos) => {
//     if (!photos && photos !== 0) return null;
//     if (Array.isArray(photos)) return photos.length ? String(photos[0]).trim() : null;

//     const str = String(photos).trim();
//     if (!str) return null;
//     if (/^\d+$/.test(str)) return null;
//     if (str.startsWith("[")) {
//       try {
//         const parsed = JSON.parse(str);
//         if (Array.isArray(parsed) && parsed.length) return String(parsed[0]).trim();
//       } catch (e) {}
//     }
//     if (str.includes(",")) {
//       const part = str.split(",")[0].replace(/["'\[\]]/g, "").trim();
//       if (part) return part;
//     }
//     if (str.includes("@") || /\s/.test(str)) return null;
//     const cleaned = str.replace(/^[\s"'\[]+|[\s"'\]]+$/g, "");
//     return cleaned || null;
//   };

//   // ------------------ Token / User ------------------
//   const checkTokenExpiry = async (token) => {
//     try {
//       const resp = await fetch(`${API_URL}/activity/profile`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//       });
//       return resp.ok;
//     } catch (err) {
//       console.error("Token check error:", err);
//       return false;
//     }
//   };

//   // Fetch & normalize user profile to shape { userData: {...} }
//   const fetchUserData = async (token) => {
//     try {
//       const response = await fetch(`${API_URL}/activity/profile`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await response.json().catch(() => null);

//       if (!data) {
//         console.warn("fetchUserData: empty response");
//         return;
//       }

//       // normalize common shapes:
//       if (data.userData) {
//         // your provided format: { status: "...", userData: {...} }
//         setUserData({ userData: data.userData });
//       } else if (data.data && data.data.userData) {
//         setUserData({ userData: data.data.userData });
//       } else if (data.user) {
//         setUserData({ userData: data.user });
//       } else {
//         // fallback: assume the root object is the user payload
//         setUserData({ userData: data });
//       }

//       setImageLoaded(true);
//       setTotalTime(null);
//       console.log("fetchUserData normalized:", data);
//     } catch (err) {
//       console.error("Error fetching user data:", err);
//     }
//   };

//   // fetch total time for current user
//   useEffect(() => {
//     const getTotalTime = async () => {
//       try {
//         if (!userData?.userData?.id) return;
//         const token = localStorage.getItem("token");
//         const response = await fetch(`${API_URL}/activity/TotalTimeSpent/${userData.userData.id}`, {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await response.json().catch(() => null);
//         if (response.ok && data) {
//           setTotalTime(data.totalTimeSum || 0);
//         } else {
//           console.warn("TotalTimeSpent returned:", response.status, data);
//         }
//       } catch (err) {
//         console.error("Error fetching total time", err);
//       }
//     };
//     getTotalTime();
//   }, [userData]);

//   // ------------------ Categories ------------------
//   const fetchCategories = async () => {
//     try {
//       const response = await fetch(`${API_URL}/activity/getCategoriesAdmin`);
//       if (!response.ok) {
//         notify("Failed to fetch categories");
//         setCategories([]);
//         return;
//       }
//       const data = await response.json().catch(() => null);
//       let categoriesArray = [];
//       if (Array.isArray(data)) categoriesArray = data;
//       else if (Array.isArray(data.categories)) categoriesArray = data.categories;
//       else if (Array.isArray(data.data)) categoriesArray = data.data;
//       else if (Array.isArray(data.result)) categoriesArray = data.result;
//       else if (data && typeof data === "object") {
//         if (data.category) categoriesArray = Array.isArray(data.category) ? data.category : [data.category];
//       }
//       setCategories(categoriesArray);
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//       setCategories([]);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // ------------------ Posts in area ------------------
//   const fetchPostsInArea = async (latitude, longitude) => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const newdata = {
//         latitude,
//         longitude,
//         userId: userData?.userData?.id,
//         username: userData?.userData?.name,
//       };
//       const response = await fetch(`${API_URL}/activity/fetchPostsInArea`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newdata),
//       });

//       const postsData = await response.json().catch(() => null);
//       console.log("fetchPostsInArea response:", postsData);

//       let postsArray = [];
//       if (Array.isArray(postsData)) postsArray = postsData;
//       else if (Array.isArray(postsData.posts)) postsArray = postsData.posts;
//       else if (Array.isArray(postsData.data)) postsArray = postsData.data;
//       else if (Array.isArray(postsData.result)) postsArray = postsData.result;
//       else if (postsData && typeof postsData === "object") {
//         if (postsData.post) postsArray = Array.isArray(postsData.post) ? postsData.post : [postsData.post];
//         else {
//           const maybe = Object.values(postsData).find((v) => Array.isArray(v));
//           if (maybe) postsArray = maybe;
//         }
//       }
//       if (!Array.isArray(postsArray)) postsArray = [];

//       if (postsArray.length === 0) {
//         console.warn("No posts returned for coords:", latitude, longitude, postsData);
//       }

//       setUserPosts(postsArray);
//       setFilteredPosts(postsArray);
//     } catch (err) {
//       console.error("Error fetching posts in area:", err);
//       notify("Error fetching posts in area");
//       setUserPosts([]);
//       setFilteredPosts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ------------------ Location handler ------------------
//   const handleLocationChange = (latitude, longitude) => {
//     if (latitude != null && longitude != null) fetchPostsInArea(latitude, longitude);
//   };

//   // ------------------ City names (reverse geocode) ------------------
//   useEffect(() => {
//     const fetchCityNames = async (posts) => {
//       const promises = posts.map(async (post) => {
//         if (post.latitude && post.longitude) {
//           const cityName = await fetchCityName(post.latitude, post.longitude);
//           return { postId: post.id, cityName };
//         }
//         return { postId: post.id, cityName: "Unknown City" };
//       });
//       const resolved = await Promise.all(promises);
//       const obj = resolved.reduce((acc, it) => ({ ...acc, [it.postId]: it.cityName }), {});
//       setCityNames(obj);
//     };
//     if (Array.isArray(filteredPosts) && filteredPosts.length) fetchCityNames(filteredPosts);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filteredPosts]);

//   const fetchCityName = async (latitude, longitude) => {
//     try {
//       const key = process.env.REACT_APP_OPENCAGE_KEY;
//       if (!key) return "Unknown City";
//       const response = await axios.get(
//         `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${key}`
//       );
//       const results = response?.data?.results;
//       if (results && results.length > 0) {
//         const comp = results[0].components || {};
//         return comp.city || comp.town || comp.village || comp.county || comp.state || "Unknown City";
//       }
//       return "Unknown City";
//     } catch (err) {
//       console.error("Error fetching location data:", err);
//       return "Unknown City";
//     }
//   };

//   const renderCityName = (postId) => cityNames[postId] || "Loading...";

//   // ------------------ Search / Filter ------------------
//   const handleSearch = () => {
//     const { category, userName } = searchQuery;
//     let filtered = Array.isArray(userPosts) ? [...userPosts] : [];
//     if (category) {
//       filtered = filtered.filter((post) => post.category && post.category.toLowerCase().includes(category.toLowerCase()));
//     }
//     if (userName) {
//       filtered = filtered.filter((post) => post.user && post.user.name && post.user.name.toLowerCase().includes(userName.toLowerCase()));
//     }
//     setFilteredPosts(filtered);
//   };

//   useEffect(() => {
//     handleSearch();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [searchQuery, userPosts]);

//   // ------------------ Auth & initial load ------------------
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userKey = localStorage.getItem("userKey");
//     if (!token || !userKey) {
//       navigate("/login");
//       return;
//     }
//     (async () => {
//       try {
//         const ok = await checkTokenExpiry(token);
//         if (!ok) {
//           console.warn("Token expired or invalid");
//           if (setAuthenticated) setAuthenticated(false);
//           navigate("/login");
//           return;
//         }
//         // Mark authenticated
//         if (setAuthenticated) setAuthenticated(true);

//         // fetch profile (we normalize the response)
//         await fetchUserData(token);
//       } catch (err) {
//         console.error("Auth initial load error:", err);
//         navigate("/login");
//       }
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [navigate]);

//   // once we have userData, try to fetch posts in area (prefers profile coords, then browser geolocation, then user-provided fallback)
//   useEffect(() => {
//     const tryFetch = async () => {
//       const userLat = userData?.userData?.latitude;
//       const userLon = userData?.userData?.longitude;

//       if (userLat != null && userLon != null) {
//         console.log("Using user profile coordinates to fetch posts:", userLat, userLon);
//         fetchPostsInArea(userLat, userLon);
//         return;
//       }

//       if ("geolocation" in navigator) {
//         navigator.geolocation.getCurrentPosition(
//           (pos) => {
//             const { latitude, longitude } = pos.coords;
//             console.log("Geolocation obtained:", latitude, longitude);
//             fetchPostsInArea(latitude, longitude);
//           },
//           (err) => {
//             console.warn("Geolocation error/denied; using fallback coords:", err);
//             // <-- user-provided fallback coords used here
//             fetchPostsInArea(FALLBACK_LAT, FALLBACK_LON);
//           },
//           { timeout: 10000 }
//         );
//       } else {
//         console.warn("No geolocation available, fetching posts with fallback coords");
//         fetchPostsInArea(FALLBACK_LAT, FALLBACK_LON);
//       }
//     };

//     if (userData) tryFetch();
//     // re-run when refresh toggled
//   }, [userData, refresh]);

//   // ------------------ UI helpers ------------------
//   const openPopup = (post) => {
//     setPopupData(post);
//     setIsPopupOpen(true);
//   };

//   const closePopup = () => {
//     setPopupData(null);
//     setIsPopupOpen(false);
//   };

//   const handleCheckboxChange = (postId, isChecked) => {
//     setCheckedPosts((prev) => (isChecked ? [...prev, postId] : prev.filter((id) => id !== postId)));
//   };

//   // ------------------ Bulk endorse ------------------
//   const handleEndorseAll = async () => {
//     if (!checkedPosts.length) {
//       notify("Select posts first");
//       return;
//     }
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }
//       setLoading(true);
//       for (const postId of checkedPosts) {
//         await fetch(`${API_URL}/activity/endorsePost/${postId}`, {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//           body: JSON.stringify({ userId: userData?.userData?.id }),
//         });
//       }
//       setRefresh((r) => !r);
//       notify("Selected posts are endorsed");
//       setCheckedPosts([]);
//     } catch (err) {
//       console.error("Error endorsing posts:", err);
//       notify("Error endorsing posts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openProfilePopup = () => {
//     if (userData?.userData) {
//       setPopupData({ photos: userData.userData.photo });
//       setIsPopUpVisible(true);
//     }
//   };

//   const createpage = () => navigate("/create");
//   const direct = () => navigate("/create");

//   // click outside search bar to close
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (searchBarRef.current && !searchBarRef.current.contains(e.target)) setIsOpen(false);
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // auto close search dropdown
//   useEffect(() => {
//     let timer;
//     if (isOpen) timer = setTimeout(() => setIsOpen(false), 30000);
//     return () => clearTimeout(timer);
//   }, [isOpen]);

//   const postsToRender = Array.isArray(filteredPosts) ? filteredPosts : [];

//   // Optional: if you want to manually trigger a fetch using your provided coords right now,
//   // uncomment the line below (useful for quick testing in dev).
//   // useEffect(() => { handleLocationChange(FALLBACK_LAT, FALLBACK_LON); }, []); 

//   return (
//     <>
//       {authenticated && (
//         <div className="flex items-center justify-center w-screen h-screen p-4 sm:p-0">
//           {isPopUpVisible && <PopupComponent post={popupData} onClose={() => setIsPopUpVisible(false)} />}

//           {/* If your Location component provides coords via onLocationChange, it will call handleLocationChange */}
//           <Location onLocationChange={handleLocationChange} />

//           <div className="bg-white-A700 flex flex-col items-start justify-start w-4/12 h-full sm:w-full md:w-7/12 border-[1px] rounded-lg overflow-hidden">
//             <div className="flex flex-col gap-3 items-center w-full h-full">
//               <div className="relative bg-gray-50 flex flex-row items-center justify-between p-3 w-full">
//                 <div className="flex gap-3 items-center">
//                   {userData?.userData?.photo && imageLoaded ? (
//                     <img
//                       className="cursor-pointer w-14 h-14 rounded-full object-cover object-top"
//                       src={
//                         getPhotoFilename(userData.userData.photo)
//                           ? `${API_URL}/image/${encodeURIComponent(getPhotoFilename(userData.userData.photo))}`
//                           : `${APP_PATH}images/nopost.svg`
//                       }
//                       alt="User Photo"
//                       onClick={() => navigate("/users-profile")}
//                       onError={() => setImageLoaded(false)}
//                     />
//                   ) : (
//                     <div className="bg-white-A700 w-16 h-14 rounded-full flex items-center justify-center">
//                       <FontAwesomeIcon icon={faUser} className="text-gray-600" onClick={() => navigate("/users-profile")} />
//                     </div>
//                   )}
//                   <div className="flex flex-col items-start justify-center">
//                     <Text className="text-gray-900 uppercase" size="txtInterSemiBold16Gray900">
//                       {(userData?.userData?.name || "").split(" ")[0] || ""}
//                     </Text>
//                     <Text className="text-sm text-gray-900 uppercase">ID: {userData?.userData?.id ?? "-"}</Text>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <Button type="button" className="font-semibold rounded-3xl text-blue-500 bg-white-A700 text-xs" onClick={direct}>
//                     {`${totalTime || 0} Hrs | ${totalTime ? convertToHours(totalTime) : 0} Pts`}
//                   </Button>
//                   <img onClick={createpage} src={APP_PATH + "images/2.png"} className="cursor-pointer w-14 h-14 rounded-full" alt="create" />
//                 </div>
//               </div>

//               <div className="w-full h-full bg-[#f4f6ff] rounded-md overflow-hidden flex flex-col items-center gap-5 p-4">
//                 <div className="relative mt-3 w-5/6 md:w-64">
//                   <div className="relative">
//                     <button onClick={() => setIsOpen((s) => !s)} className="absolute right-2 top-1 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
//                       <FontAwesomeIcon icon={faMagnifyingGlass} />
//                     </button>

//                     <Transition show={isOpen} enter="transition ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
//                       {(ref) => (
//                         <div ref={searchBarRef} className="absolute -top-[10px] right-0 w-full sm:w-64 bg-white border border-gray-300 rounded-lg shadow-sm mt-2 z-10 p-3">
//                           <select className="w-full px-4 py-2 rounded-lg border border-gray-300 mb-2" value={searchQuery.category} onChange={(e) => setSearchQuery((s) => ({ ...s, category: e.target.value }))}>
//                             <option value="">All Categories</option>
//                             {categories.map((cat) => (
//                               <option key={cat.id} value={cat.name}>
//                                 {cat.name}
//                               </option>
//                             ))}
//                           </select>

//                           <input type="text" placeholder="Search by username..." className="w-full px-4 py-2 rounded-lg border border-gray-300" value={searchQuery.userName} onChange={(e) => setSearchQuery((s) => ({ ...s, userName: e.target.value }))} />
//                         </div>
//                       )}
//                     </Transition>
//                   </div>
//                 </div>

//                 <div className={`scroller relative mt-5 w-full h-full post-container ${postsToRender.length === 0 ? "overflow-hidden" : "overflow-auto"}`}>
//                   {loading ? (
//                     <div className="w-full h-full flex items-center justify-center">Loading...</div>
//                   ) : postsToRender.length === 0 ? (
//                     <div className="w-full h-full flex items-center justify-center">
//                       <Img className="w-1/2 h-auto object-cover" src={APP_PATH + "images/nopost.svg"} alt="No posts" />
//                     </div>
//                   ) : (
//                     <table className="w-full border-collapse border-2">
//                       <thead>
//                         <tr>
//                           <th className="border p-3">S.No.</th>
//                           <th className="border p-3">Category</th>
//                           <th className="border p-3">Name</th>
//                           <th className="border px-8">Date</th>
//                           <th className="border p-3">Time</th>
//                           <th className="border p-3">Location</th>
//                           <th className="border p-3">Image</th>
//                           <th className="border p-3">Endorse</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {postsToRender.map((post, index) => {
//                           const userNameValue = post.user?.name ?? "Unknown";
//                           const dateDisplay = post.Date ? format(new Date(post.Date), "dd-MM-yyyy") : "-";
//                           const totalTimeVal = post.totalTime ?? "-";
//                           const cityName = post.latitude && post.longitude ? renderCityName(post.id) : "Unknown City";
//                           return (
//                             <tr key={post.id ?? index} className="border">
//                               <td className="border p-3 text-center">{index + 1}</td>
//                               <td className="border p-3 text-center">{post.category}</td>
//                               <td className="border p-3 text-center">{userNameValue}</td>
//                               <td className="border p-1 text-center">{dateDisplay}</td>
//                               <td className="border p-3 text-center">{totalTimeVal}</td>
//                               <td className="border p-3 text-center">{cityName}</td>
//                               <td className="border p-3 text-center">
//                                 <a
//                                   href="#"
//                                   onClick={(e) => {
//                                     e.preventDefault();
//                                     openPopup(post);
//                                   }}
//                                   className="text-[#546ef6] underline"
//                                 >
//                                   View
//                                 </a>
//                               </td>
//                               <td className="border p-3 text-center">
//                                 <input
//                                   type="checkbox"
//                                   id={`endorsement_${post.id}`}
//                                   checked={checkedPosts.includes(post.id)}
//                                   className="border-2 border-[#546ef6] p-2 rounded-lg"
//                                   onChange={(e) => handleCheckboxChange(post.id, e.target.checked)}
//                                 />
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   )}
//                 </div>

//                 {isPopupOpen && popupData && (
//                   <div className="popup-overlay">
//                     <div className="popup-content">
//                       <PopupComponent post={popupData} onClose={closePopup} />
//                     </div>
//                   </div>
//                 )}

//                 {checkedPosts.length > 0 && (
//                   <button className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleEndorseAll}>
//                     Endorse Selected Posts
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Endorse;






// import React, { useEffect, useRef, useState } from "react";
// import { Button, Img, Text } from "components";
// import { API_URL, APP_PATH } from "Constant";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "components/AuthProvider/AuthProvider";
// import Location from "pages/Location/Location";
// import { Transition } from "@headlessui/react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faMagnifyingGlass, faUser } from "@fortawesome/free-solid-svg-icons";
// import axios from "axios";
// import PopupComponent from "components/popup";
// import "./style.css";
// import { toast } from "react-toastify";
// import { convertToHours } from "utils";
// import { format } from "date-fns";

// const Endorse = () => {
//   const notify = (e) => toast(String(e));
//   const { authenticated, setAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   const [imageLoaded, setImageLoaded] = useState(true);
//   const [isPopUpVisible, setIsPopUpVisible] = useState(false);
//   const [popupData, setPopupData] = useState(null);

//   const [checkedPosts, setCheckedPosts] = useState([]);
//   const [userPosts, setUserPosts] = useState([]);
//   const [filteredPosts, setFilteredPosts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [cityNames, setCityNames] = useState({});
//   const [userData, setUserData] = useState(null); // normalized as { userData: {...} }
//   const [totalTime, setTotalTime] = useState(null);
//   const [searchQuery, setSearchQuery] = useState({ category: "", userName: "" });
//   const [isOpen, setIsOpen] = useState(false);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [refresh, setRefresh] = useState(false);

//   const searchBarRef = useRef(null);

//   // Debounce timer ref for location updates
//   const locationDebounceRef = useRef(null);
//   // Track the latest fetch request id to avoid race conditions
//   const latestRequestRef = useRef(0);

//   // fallback coords provided by user
//   const FALLBACK_LAT = 25.2040121350756;
//   const FALLBACK_LON = 75.83546141599031;

//   // helper: robust filename extractor
//   const getPhotoFilename = (photos) => {
//     if (!photos && photos !== 0) return null;
//     if (Array.isArray(photos)) return photos.length ? String(photos[0]).trim() : null;

//     const str = String(photos).trim();
//     if (!str) return null;
//     if (/^\d+$/.test(str)) return null;
//     if (str.startsWith("[")) {
//       try {
//         const parsed = JSON.parse(str);
//         if (Array.isArray(parsed) && parsed.length) return String(parsed[0]).trim();
//       } catch (e) {}
//     }
//     if (str.includes(",")) {
//       const part = str.split(",")[0].replace(/["'\[\]]/g, "").trim();
//       if (part) return part;
//     }
//     if (str.includes("@") || /\s/.test(str)) return null;
//     const cleaned = str.replace(/^[\s"'\[]+|[\s"'\]]+$/g, "");
//     return cleaned || null;
//   };

//   // ------------------ Token / User ------------------
//   const checkTokenExpiry = async (token) => {
//     try {
//       const resp = await fetch(`${API_URL}/activity/profile`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//       });
//       return resp.ok;
//     } catch (err) {
//       console.error("Token check error:", err);
//       return false;
//     }
//   };

//   // Fetch & normalize user profile to shape { userData: {...} }
//   const fetchUserData = async (token) => {
//     try {
//       const response = await fetch(`${API_URL}/activity/profile`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await response.json().catch(() => null);

//       if (!data) {
//         console.warn("fetchUserData: empty response");
//         return;
//       }

//       if (data.userData) {
//         setUserData({ userData: data.userData });
//       } else if (data.data && data.data.userData) {
//         setUserData({ userData: data.data.userData });
//       } else if (data.user) {
//         setUserData({ userData: data.user });
//       } else {
//         setUserData({ userData: data });
//       }

//       setImageLoaded(true);
//       setTotalTime(null);
//       console.log("fetchUserData normalized:", data);
//     } catch (err) {
//       console.error("Error fetching user data:", err);
//     }
//   };

//   // fetch total time for current user
//   useEffect(() => {
//     const getTotalTime = async () => {
//       try {
//         if (!userData?.userData?.id) return;
//         const token = localStorage.getItem("token");
//         const response = await fetch(`${API_URL}/activity/TotalTimeSpent/${userData.userData.id}`, {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await response.json().catch(() => null);
//         if (response.ok && data) {
//           setTotalTime(data.totalTimeSum || 0);
//         } else {
//           console.warn("TotalTimeSpent returned:", response.status, data);
//         }
//       } catch (err) {
//         console.error("Error fetching total time", err);
//       }
//     };
//     getTotalTime();
//   }, [userData]);

//   // ------------------ Categories ------------------
//   const fetchCategories = async () => {
//     try {
//       const response = await fetch(`${API_URL}/activity/getCategoriesAdmin`);
//       if (!response.ok) {
//         notify("Failed to fetch categories");
//         setCategories([]);
//         return;
//       }
//       const data = await response.json().catch(() => null);
//       let categoriesArray = [];
//       if (Array.isArray(data)) categoriesArray = data;
//       else if (Array.isArray(data.categories)) categoriesArray = data.categories;
//       else if (Array.isArray(data.data)) categoriesArray = data.data;
//       else if (Array.isArray(data.result)) categoriesArray = data.result;
//       else if (data && typeof data === "object") {
//         if (data.category) categoriesArray = Array.isArray(data.category) ? data.category : [data.category];
//       }
//       setCategories(categoriesArray);
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//       setCategories([]);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // ------------------ Posts in area (robust) ------------------
// // defensive fetchPostsInArea - replace your existing function with this
// const fetchPostsInArea = async (latitude, longitude) => {
//   // validate coords are numbers
//   if (typeof latitude !== "number" || typeof longitude !== "number" || Number.isNaN(latitude) || Number.isNaN(longitude)) {
//     console.warn("fetchPostsInArea called with invalid coords:", latitude, longitude);
//     return;
//   }

//   const token = localStorage.getItem("token");
//   if (!token) {
//     console.warn("No token in localStorage - aborting fetchPostsInArea");
//     return;
//   }

//   // Ensure userId and username exist; don't send undefined/null
//   const safeUserId = userData?.userData?.id ?? -1; // server may prefer -1 or null; adjust if needed
//   const safeUsername = userData?.userData?.name ?? "unknown";

//   // Create payload with multiple common key variants in case backend expects different names
//   const payload = {
//     // primary names your API code used
//     latitude: Number(latitude),
//     longitude: Number(longitude),

//     // alternate keys (lat / lng) in case backend expects them
//     lat: Number(latitude),
//     lng: Number(longitude),

//     // user info
//     userId: safeUserId,
//     username: safeUsername,
//   };

//   console.log("fetchPostsInArea -> sending payload:", payload);

//   try {
//     setLoading(true);
//     const resp = await fetch(`${API_URL}/activity/fetchPostsInArea`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     let body;
//     try {
//       body = await resp.json();
//     } catch (e) {
//       body = await resp.text().catch(() => null);
//     }

//     console.log("fetchPostsInArea -> response status:", resp.status, "body:", body);

//     if (!resp.ok) {
//       // don't wipe out existing UI data on server errors; log and inform
//       console.warn("fetchPostsInArea failed:", resp.status, body);
//       notify(`Failed to fetch posts (status ${resp.status})`);
//       return;
//     }

//     // normalize response shapes (keep your existing normalization logic)
//     let postsArray = [];
//     if (Array.isArray(body)) postsArray = body;
//     else if (Array.isArray(body.posts)) postsArray = body.posts;
//     else if (Array.isArray(body.data)) postsArray = body.data;
//     else if (Array.isArray(body.result)) postsArray = body.result;
//     else if (body && typeof body === "object") {
//       if (body.post) postsArray = Array.isArray(body.post) ? body.post : [body.post];
//       else {
//         const maybe = Object.values(body).find((v) => Array.isArray(v));
//         if (maybe) postsArray = maybe;
//       }
//     }
//     if (!Array.isArray(postsArray)) postsArray = [];

//     console.log("fetchPostsInArea -> normalized posts count:", postsArray.length);
//     setUserPosts(postsArray);
//     setFilteredPosts(postsArray);
//   } catch (err) {
//     console.error("fetchPostsInArea -> network/exception error:", err);
//     notify("Network error fetching posts");
//     // keep previous posts (do not clear UI)
//   } finally {
//     setLoading(false);
//   }
// };







//   // const fetchPostsInArea = async (latitude, longitude) => {
//   //   // validate primitive numbers
//   //   if (typeof latitude !== "number" || typeof longitude !== "number" || Number.isNaN(latitude) || Number.isNaN(longitude)) {
//   //     console.warn("fetchPostsInArea called with invalid coords:", latitude, longitude);
//   //     return;
//   //   }

//   //   const requestId = ++latestRequestRef.current;
//   //   setLoading(true);

//   //   try {
//   //     const token = localStorage.getItem("token");
//   //     const newdata = {
//   //       latitude,
//   //       longitude,
//   //       userId: userData?.userData?.id,
//   //       username: userData?.userData?.name,
//   //     };

//   //     console.log(`[fetchPostsInArea][req:${requestId}] sending`, newdata);

//   //     const response = await fetch(`${API_URL}/activity/fetchPostsInArea`, {
//   //       method: "POST",
//   //       headers: {
//   //         Authorization: `Bearer ${token}`,
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify(newdata),
//   //     });

//   //     const status = response.status;
//   //     const postsData = await response.json().catch(() => null);

//   //     console.log(`[fetchPostsInArea][req:${requestId}] status: ${status}, body:`, postsData);

//   //     // If this is not the latest request, ignore result (prevents races)
//   //     if (requestId !== latestRequestRef.current) {
//   //       console.warn(`[fetchPostsInArea][req:${requestId}] response ignored due to newer request (${latestRequestRef.current})`);
//   //       return;
//   //     }

//   //     if (!response.ok) {
//   //       // do NOT clear existing posts on error; just warn and bail
//   //       console.warn(`[fetchPostsInArea][req:${requestId}] server returned ${status}`, postsData);
//   //       notify(`Unable to fetch posts (status ${status})`);
//   //       return;
//   //     }

//   //     let postsArray = [];
//   //     if (Array.isArray(postsData)) postsArray = postsData;
//   //     else if (Array.isArray(postsData.posts)) postsArray = postsData.posts;
//   //     else if (Array.isArray(postsData.data)) postsArray = postsData.data;
//   //     else if (Array.isArray(postsData.result)) postsArray = postsData.result;
//   //     else if (postsData && typeof postsData === "object") {
//   //       if (postsData.post) postsArray = Array.isArray(postsData.post) ? postsData.post : [postsData.post];
//   //       else {
//   //         const maybe = Object.values(postsData).find((v) => Array.isArray(v));
//   //         if (maybe) postsArray = maybe;
//   //       }
//   //     }
//   //     if (!Array.isArray(postsArray)) postsArray = [];

//   //     setUserPosts(postsArray);
//   //     setFilteredPosts(postsArray);
//   //   } catch (err) {
//   //     console.error("Error fetching posts in area:", err);
//   //     notify("Error fetching posts in area");
//   //     // keep previous posts (do not clear)
//   //   } finally {
//   //     // only clear loading if this is latest request
//   //     if (requestId === latestRequestRef.current) setLoading(false);
//   //   }
//   // };

//   // ------------------ Location handler (debounced, accepts object or numbers) ------------------
//   const handleLocationChange = (a, b) => {
//     // Accept either: handleLocationChange(lat, lon) OR handleLocationChange({latitude, longitude})
//     let lat, lon;
//     if (typeof a === "object" && a !== null && "latitude" in a && "longitude" in a) {
//       lat = Number(a.latitude);
//       lon = Number(a.longitude);
//     } else {
//       lat = Number(a);
//       lon = Number(b);
//     }

//     // debounce rapid location updates (250ms)
//     if (locationDebounceRef.current) clearTimeout(locationDebounceRef.current);
//     locationDebounceRef.current = setTimeout(() => {
//       // guard
//       if (typeof lat === "number" && typeof lon === "number" && !Number.isNaN(lat) && !Number.isNaN(lon)) {
//         fetchPostsInArea(lat, lon);
//       } else {
//         console.warn("handleLocationChange: invalid coords, using fallback", lat, lon);
//         fetchPostsInArea(FALLBACK_LAT, FALLBACK_LON);
//       }
//     }, 250);
//   };

//   // ------------------ City names (reverse geocode) ------------------
//   useEffect(() => {
//     const fetchCityNames = async (posts) => {
//       const promises = posts.map(async (post) => {
//         if (post.latitude && post.longitude) {
//           const cityName = await fetchCityName(post.latitude, post.longitude);
//           return { postId: post.id, cityName };
//         }
//         return { postId: post.id, cityName: "Unknown City" };
//       });
//       const resolved = await Promise.all(promises);
//       const obj = resolved.reduce((acc, it) => ({ ...acc, [it.postId]: it.cityName }), {});
//       setCityNames(obj);
//     };
//     if (Array.isArray(filteredPosts) && filteredPosts.length) fetchCityNames(filteredPosts);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filteredPosts]);

//   const fetchCityName = async (latitude, longitude) => {
//     try {
//       const key = process.env.REACT_APP_OPENCAGE_KEY;
//       if (!key) return "Unknown City";
//       const response = await axios.get(
//         `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${key}`
//       );
//       const results = response?.data?.results;
//       if (results && results.length > 0) {
//         const comp = results[0].components || {};
//         return comp.city || comp.town || comp.village || comp.county || comp.state || "Unknown City";
//       }
//       return "Unknown City";
//     } catch (err) {
//       console.error("Error fetching location data:", err);
//       return "Unknown City";
//     }
//   };

//   const renderCityName = (postId) => cityNames[postId] || "Loading...";

//   // ------------------ Search / Filter ------------------
//   const handleSearch = () => {
//     const { category, userName } = searchQuery;
//     let filtered = Array.isArray(userPosts) ? [...userPosts] : [];
//     if (category) {
//       filtered = filtered.filter((post) => post.category && post.category.toLowerCase().includes(category.toLowerCase()));
//     }
//     if (userName) {
//       filtered = filtered.filter((post) => post.user && post.user.name && post.user.name.toLowerCase().includes(userName.toLowerCase()));
//     }
//     setFilteredPosts(filtered);
//   };

//   useEffect(() => {
//     handleSearch();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [searchQuery, userPosts]);

//   // ------------------ Auth & initial load ------------------
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userKey = localStorage.getItem("userKey");
//     if (!token || !userKey) {
//       navigate("/login");
//       return;
//     }
//     (async () => {
//       try {
//         const ok = await checkTokenExpiry(token);
//         if (!ok) {
//           console.warn("Token expired or invalid");
//           if (setAuthenticated) setAuthenticated(false);
//           navigate("/login");
//           return;
//         }
//         // Mark authenticated
//         if (setAuthenticated) setAuthenticated(true);

//         // fetch profile (we normalize the response)
//         await fetchUserData(token);
//       } catch (err) {
//         console.error("Auth initial load error:", err);
//         navigate("/login");
//       }
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [navigate]);

//   // once we have userData, try to fetch posts in area (prefers profile coords, then browser geolocation, then user-provided fallback)
//   useEffect(() => {
//     const tryFetch = async () => {
//       const userLat = userData?.userData?.latitude;
//       const userLon = userData?.userData?.longitude;

//       if (userLat != null && userLon != null) {
//         console.log("Using user profile coordinates to fetch posts:", userLat, userLon);
//         handleLocationChange(Number(userLat), Number(userLon));
//         return;
//       }

//       if ("geolocation" in navigator) {
//         navigator.geolocation.getCurrentPosition(
//           (pos) => {
//             const { latitude, longitude } = pos.coords;
//             console.log("Geolocation obtained:", latitude, longitude);
//             handleLocationChange(latitude, longitude);
//           },
//           (err) => {
//             console.warn("Geolocation error/denied; using fallback coords:", err);
//             handleLocationChange(FALLBACK_LAT, FALLBACK_LON);
//           },
//           { timeout: 10000 }
//         );
//       } else {
//         console.warn("No geolocation available, fetching posts with fallback coords");
//         handleLocationChange(FALLBACK_LAT, FALLBACK_LON);
//       }
//     };

//     if (userData) tryFetch();
//   }, [userData, refresh]);

//   // ------------------ UI helpers ------------------
//   const openPopup = (post) => {
//     setPopupData(post);
//     setIsPopupOpen(true);
//   };

//   const closePopup = () => {
//     setPopupData(null);
//     setIsPopupOpen(false);
//   };

//   const handleCheckboxChange = (postId, isChecked) => {
//     setCheckedPosts((prev) => (isChecked ? [...prev, postId] : prev.filter((id) => id !== postId)));
//   };

//   // ------------------ Bulk endorse ------------------
//   const handleEndorseAll = async () => {
//     if (!checkedPosts.length) {
//       notify("Select posts first");
//       return;
//     }
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }
//       setLoading(true);
//       for (const postId of checkedPosts) {
//         await fetch(`${API_URL}/activity/endorsePost/${postId}`, {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//           body: JSON.stringify({ userId: userData?.userData?.id }),
//         });
//       }
//       setRefresh((r) => !r);
//       notify("Selected posts are endorsed");
//       setCheckedPosts([]);
//     } catch (err) {
//       console.error("Error endorsing posts:", err);
//       notify("Error endorsing posts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openProfilePopup = () => {
//     if (userData?.userData) {
//       setPopupData({ photos: userData.userData.photo });
//       setIsPopUpVisible(true);
//     }
//   };

//   const createpage = () => navigate("/create");
//   const direct = () => navigate("/create");

//   // click outside search bar to close
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (searchBarRef.current && !searchBarRef.current.contains(e.target)) setIsOpen(false);
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // auto close search dropdown
//   useEffect(() => {
//     let timer;
//     if (isOpen) timer = setTimeout(() => setIsOpen(false), 30000);
//     return () => clearTimeout(timer);
//   }, [isOpen]);

//   const postsToRender = Array.isArray(filteredPosts) ? filteredPosts : [];

//   return (
//     <>
//       {authenticated && (
//         <div className="flex items-center justify-center w-screen h-screen p-4 sm:p-0">
//           {isPopUpVisible && <PopupComponent post={popupData} onClose={() => setIsPopUpVisible(false)} />}

//           {/* If your Location component provides coords via onLocationChange, it will call handleLocationChange */}
//           <Location onLocationChange={handleLocationChange} />

//           <div className="bg-white-A700 flex flex-col items-start justify-start w-4/12 h-full sm:w-full md:w-7/12 border-[1px] rounded-lg overflow-hidden">
//             <div className="flex flex-col gap-3 items-center w-full h-full">
//               <div className="relative bg-gray-50 flex flex-row items-center justify-between p-3 w-full">
//                 <div className="flex gap-3 items-center">
//                   {userData?.userData?.photo && imageLoaded ? (
//                     <img
//                       className="cursor-pointer w-14 h-14 rounded-full object-cover object-top"
//                       src={
//                         getPhotoFilename(userData.userData.photo)
//                           ? `${API_URL}/image/${encodeURIComponent(getPhotoFilename(userData.userData.photo))}`
//                           : `${APP_PATH}images/nopost.svg`
//                       }
//                       alt="User Photo"
//                       onClick={() => navigate("/users-profile")}
//                       onError={() => setImageLoaded(false)}
//                     />
//                   ) : (
//                     <div className="bg-white-A700 w-16 h-14 rounded-full flex items-center justify-center">
//                       <FontAwesomeIcon icon={faUser} className="text-gray-600" onClick={() => navigate("/users-profile")} />
//                     </div>
//                   )}
//                   <div className="flex flex-col items-start justify-center">
//                     <Text className="text-gray-900 uppercase" size="txtInterSemiBold16Gray900">
//                       {(userData?.userData?.name || "").split(" ")[0] || ""}
//                     </Text>
//                     <Text className="text-sm text-gray-900 uppercase">ID: {userData?.userData?.id ?? "-"}</Text>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <Button type="button" className="font-semibold rounded-3xl text-blue-500 bg-white-A700 text-xs" onClick={direct}>
//                     {`${totalTime || 0} Hrs | ${totalTime ? convertToHours(totalTime) : 0} Pts`}
//                   </Button>
//                   <img onClick={createpage} src={APP_PATH + "images/2.png"} className="cursor-pointer w-14 h-14 rounded-full" alt="create" />
//                 </div>
//               </div>

//               <div className="w-full h-full bg-[#f4f6ff] rounded-md overflow-hidden flex flex-col items-center gap-5 p-4">
//                 <div className="relative mt-3 w-5/6 md:w-64">
//                   <div className="relative">
//                     <button onClick={() => setIsOpen((s) => !s)} className="absolute right-2 top-1 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
//                       <FontAwesomeIcon icon={faMagnifyingGlass} />
//                     </button>

//                     <Transition show={isOpen} enter="transition ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
//                       {(ref) => (
//                         <div ref={searchBarRef} className="absolute -top-[10px] right-0 w-full sm:w-64 bg-white border border-gray-300 rounded-lg shadow-sm mt-2 z-10 p-3">
//                           <select className="w-full px-4 py-2 rounded-lg border border-gray-300 mb-2" value={searchQuery.category} onChange={(e) => setSearchQuery((s) => ({ ...s, category: e.target.value }))}>
//                             <option value="">All Categories</option>
//                             {categories.map((cat) => (
//                               <option key={cat.id} value={cat.name}>
//                                 {cat.name}
//                               </option>
//                             ))}
//                           </select>

//                           <input type="text" placeholder="Search by username..." className="w-full px-4 py-2 rounded-lg border border-gray-300" value={searchQuery.userName} onChange={(e) => setSearchQuery((s) => ({ ...s, userName: e.target.value }))} />
//                         </div>
//                       )}
//                     </Transition>
//                   </div>
//                 </div>

//                 <div className={`scroller relative mt-5 w-full h-full post-container ${postsToRender.length === 0 ? "overflow-hidden" : "overflow-auto"}`}>
//                   {loading ? (
//                     <div className="w-full h-full flex items-center justify-center">Loading...</div>
//                   ) : postsToRender.length === 0 ? (
//                     <div className="w-full h-full flex items-center justify-center">
//                       <Img className="w-1/2 h-auto object-cover" src={APP_PATH + "images/nopost.svg"} alt="No posts" />
//                     </div>
//                   ) : (
//                     <table className="w-full border-collapse border-2">
//                       <thead>
//                         <tr>
//                           <th className="border p-3">S.No.</th>
//                           <th className="border p-3">Category</th>
//                           <th className="border p-3">Name</th>
//                           <th className="border px-8">Date</th>
//                           <th className="border p-3">Time</th>
//                           <th className="border p-3">Location</th>
//                           <th className="border p-3">Image</th>
//                           <th className="border p-3">Endorse</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {postsToRender.map((post, index) => {
//                           const userNameValue = post.user?.name ?? "Unknown";
//                           const dateDisplay = post.Date ? format(new Date(post.Date), "dd-MM-yyyy") : "-";
//                           const totalTimeVal = post.totalTime ?? "-";
//                           const cityName = post.latitude && post.longitude ? renderCityName(post.id) : "Unknown City";
//                           return (
//                             <tr key={post.id ?? index} className="border">
//                               <td className="border p-3 text-center">{index + 1}</td>
//                               <td className="border p-3 text-center">{post.category}</td>
//                               <td className="border p-3 text-center">{userNameValue}</td>
//                               <td className="border p-1 text-center">{dateDisplay}</td>
//                               <td className="border p-3 text-center">{totalTimeVal}</td>
//                               <td className="border p-3 text-center">{cityName}</td>
//                               <td className="border p-3 text-center">
//                                 <a
//                                   href="#"
//                                   onClick={(e) => {
//                                     e.preventDefault();
//                                     openPopup(post);
//                                   }}
//                                   className="text-[#546ef6] underline"
//                                 >
//                                   View
//                                 </a>
//                               </td>
//                               <td className="border p-3 text-center">
//                                 <input
//                                   type="checkbox"
//                                   id={`endorsement_${post.id}`}
//                                   checked={checkedPosts.includes(post.id)}
//                                   className="border-2 border-[#546ef6] p-2 rounded-lg"
//                                   onChange={(e) => handleCheckboxChange(post.id, e.target.checked)}
//                                 />
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   )}
//                 </div>

//                 {isPopupOpen && popupData && (
//                   <div className="popup-overlay">
//                     <div className="popup-content">
//                       <PopupComponent post={popupData} onClose={closePopup} />
//                     </div>
//                   </div>
//                 )}

//                 {checkedPosts.length > 0 && (
//                   <button className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleEndorseAll}>
//                     Endorse Selected Posts
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Endorse;






// Endorse.jsx
import React, { useEffect, useRef, useState } from "react";
import { Button, Img, Text } from "components";
import { API_URL, APP_PATH } from "Constant";
import { useNavigate } from "react-router-dom";
import { useAuth } from "components/AuthProvider/AuthProvider";
import Location from "pages/Location/Location";
import { Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faUser, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import PopupComponent from "components/popup";
import "./style.css";
import { toast } from "react-toastify";
import { convertToHours } from "utils";
import { format } from "date-fns";

const Endorse = () => {
  const notify = (e) => toast(String(e));
  const { authenticated, setAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [imageLoaded, setImageLoaded] = useState(true);
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [popupData, setPopupData] = useState(null);

  const [checkedPosts, setCheckedPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cityNames, setCityNames] = useState({});
  const [userData, setUserData] = useState(null); // normalized as { userData: {...} }
  const [totalTime, setTotalTime] = useState(null);
  const [searchQuery, setSearchQuery] = useState({ category: "", userName: "" });
  const [isOpen, setIsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const searchBarRef = useRef(null);

  // Debounce timer ref for location updates
  const locationDebounceRef = useRef(null);
  // Track the latest fetch request id to avoid race conditions
  const latestRequestRef = useRef(0);

  // fallback coords provided by user
  const FALLBACK_LAT = 25.2040121350756;
  const FALLBACK_LON = 75.83546141599031;

  // helper: robust filename extractor
  const getPhotoFilename = (photos) => {
    if (!photos && photos !== 0) return null;
    if (Array.isArray(photos)) return photos.length ? String(photos[0]).trim() : null;

    const str = String(photos).trim();
    if (!str) return null;
    if (/^\d+$/.test(str)) return null;
    if (str.startsWith("[")) {
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed) && parsed.length) return String(parsed[0]).trim();
      } catch (e) {}
    }
    if (str.includes(",")) {
      const part = str.split(",")[0].replace(/["'\[\]]/g, "").trim();
      if (part) return part;
    }
    if (str.includes("@") || /\s/.test(str)) return null;
    const cleaned = str.replace(/^[\s"'\[]+|[\s"'\]]+$/g, "");
    return cleaned || null;
  };

  // ------------------ Token / User ------------------
  const checkTokenExpiry = async (token) => {
    try {
      const resp = await fetch(`${API_URL}/activity/profile`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      return resp.ok;
    } catch (err) {
      console.error("Token check error:", err);
      return false;
    }
  };

  // Fetch & normalize user profile to shape { userData: {...} }
  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${API_URL}/activity/profile`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json().catch(() => null);

      if (!data) {
        console.warn("fetchUserData: empty response");
        return;
      }

      if (data.userData) {
        setUserData({ userData: data.userData });
      } else if (data.data && data.data.userData) {
        setUserData({ userData: data.data.userData });
      } else if (data.user) {
        setUserData({ userData: data.user });
      } else {
        setUserData({ userData: data });
      }

      setImageLoaded(true);
      setTotalTime(null);
      console.log("fetchUserData normalized:", data);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  // fetch total time for current user
  useEffect(() => {
    const getTotalTime = async () => {
      try {
        if (!userData?.userData?.id) return;
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/activity/TotalTimeSpent/${userData.userData.id}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json().catch(() => null);
        if (response.ok && data) {
          setTotalTime(data.totalTimeSum || 0);
        } else {
          console.warn("TotalTimeSpent returned:", response.status, data);
        }
      } catch (err) {
        console.error("Error fetching total time", err);
      }
    };
    getTotalTime();
  }, [userData]);

  // ------------------ Categories ------------------
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/activity/getCategoriesAdmin`);
      if (!response.ok) {
        notify("Failed to fetch categories");
        setCategories([]);
        return;
      }
      const data = await response.json().catch(() => null);
      let categoriesArray = [];
      if (Array.isArray(data)) categoriesArray = data;
      else if (Array.isArray(data.categories)) categoriesArray = data.categories;
      else if (Array.isArray(data.data)) categoriesArray = data.data;
      else if (Array.isArray(data.result)) categoriesArray = data.result;
      else if (data && typeof data === "object") {
        if (data.category) categoriesArray = Array.isArray(data.category) ? data.category : [data.category];
      }
      setCategories(categoriesArray);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ------------------ Posts in area (robust) ------------------
  const fetchPostsInArea = async (latitude, longitude) => {
    // validate coords are numbers
    if (typeof latitude !== "number" || typeof longitude !== "number" || Number.isNaN(latitude) || Number.isNaN(longitude)) {
      console.warn("fetchPostsInArea called with invalid coords:", latitude, longitude);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token in localStorage - aborting fetchPostsInArea");
      return;
    }

    // Ensure userId and username exist; don't send undefined/null
    const safeUserId = userData?.userData?.id ?? -1; // server may prefer -1 or null; adjust if needed
    const safeUsername = userData?.userData?.name ?? "unknown";

    // Create payload with multiple common key variants in case backend expects different names
    const payload = {
      // primary names your API code used
      latitude: Number(latitude),
      longitude: Number(longitude),

      // alternate keys (lat / lng) in case backend expects them
      lat: Number(latitude),
      lng: Number(longitude),

      // user info
      userId: safeUserId,
      username: safeUsername,
    };

    console.log("fetchPostsInArea -> sending payload:", payload);

    try {
      setLoading(true);
      const resp = await fetch(`${API_URL}/activity/fetchPostsInArea`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let body;
      try {
        body = await resp.json();
      } catch (e) {
        body = await resp.text().catch(() => null);
      }

      console.log("fetchPostsInArea -> response status:", resp.status, "body:", body);

      if (!resp.ok) {
        // don't wipe out existing UI data on server errors; log and inform
        console.warn("fetchPostsInArea failed:", resp.status, body);
        notify(`Failed to fetch posts (status ${resp.status})`);
        return;
      }

      // normalize response shapes (keep your existing normalization logic)
      let postsArray = [];
      if (Array.isArray(body)) postsArray = body;
      else if (Array.isArray(body.posts)) postsArray = body.posts;
      else if (Array.isArray(body.data)) postsArray = body.data;
      else if (Array.isArray(body.result)) postsArray = body.result;
      else if (body && typeof body === "object") {
        if (body.post) postsArray = Array.isArray(body.post) ? body.post : [body.post];
        else {
          const maybe = Object.values(body).find((v) => Array.isArray(v));
          if (maybe) postsArray = maybe;
        }
      }
      if (!Array.isArray(postsArray)) postsArray = [];

      console.log("fetchPostsInArea -> normalized posts count:", postsArray.length);
      setUserPosts(postsArray);
      setFilteredPosts(postsArray);
    } catch (err) {
      console.error("fetchPostsInArea -> network/exception error:", err);
      notify("Network error fetching posts");
      // keep previous posts (do not clear UI)
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Location handler (debounced, accepts object or numbers) ------------------
  const handleLocationChange = (a, b) => {
    // Accept either: handleLocationChange(lat, lon) OR handleLocationChange({latitude, longitude})
    let lat, lon;
    if (typeof a === "object" && a !== null && "latitude" in a && "longitude" in a) {
      lat = Number(a.latitude);
      lon = Number(a.longitude);
    } else {
      lat = Number(a);
      lon = Number(b);
    }

    // debounce rapid location updates (250ms)
    if (locationDebounceRef.current) clearTimeout(locationDebounceRef.current);
    locationDebounceRef.current = setTimeout(() => {
      // guard
      if (typeof lat === "number" && typeof lon === "number" && !Number.isNaN(lat) && !Number.isNaN(lon)) {
        fetchPostsInArea(lat, lon);
      } else {
        console.warn("handleLocationChange: invalid coords, using fallback", lat, lon);
        fetchPostsInArea(FALLBACK_LAT, FALLBACK_LON);
      }
    }, 250);
  };

  // ------------------ City names (reverse geocode) ------------------
  useEffect(() => {
    const fetchCityNames = async (posts) => {
      const promises = posts.map(async (post) => {
        if (post.latitude && post.longitude) {
          const cityName = await fetchCityName(post.latitude, post.longitude);
          return { postId: post.id, cityName };
        }
        return { postId: post.id, cityName: "Unknown City" };
      });
      const resolved = await Promise.all(promises);
      const obj = resolved.reduce((acc, it) => ({ ...acc, [it.postId]: it.cityName }), {});
      setCityNames(obj);
    };
    if (Array.isArray(filteredPosts) && filteredPosts.length) fetchCityNames(filteredPosts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredPosts]);

  const fetchCityName = async (latitude, longitude) => {
    try {
      const key = process.env.REACT_APP_OPENCAGE_KEY;
      if (!key) return "Unknown City";
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${key}`
      );
      const results = response?.data?.results;
      if (results && results.length > 0) {
        const comp = results[0].components || {};
        return comp.city || comp.town || comp.village || comp.county || comp.state || "Unknown City";
      }
      return "Unknown City";
    } catch (err) {
      console.error("Error fetching location data:", err);
      return "Unknown City";
    }
  };

  const renderCityName = (postId) => cityNames[postId] || "Loading...";

  // ------------------ Search / Filter ------------------
  const handleSearch = () => {
    const { category, userName } = searchQuery;
    let filtered = Array.isArray(userPosts) ? [...userPosts] : [];
    if (category) {
      filtered = filtered.filter((post) => post.category && post.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (userName) {
      filtered = filtered.filter((post) => post.user && post.user.name && post.user.name.toLowerCase().includes(userName.toLowerCase()));
    }
    setFilteredPosts(filtered);
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, userPosts]);

  // ------------------ Auth & initial load ------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userKey = localStorage.getItem("userKey");
    if (!token || !userKey) {
      navigate("/login");
      return;
    }
    (async () => {
      try {
        const ok = await checkTokenExpiry(token);
        if (!ok) {
          console.warn("Token expired or invalid");
          if (setAuthenticated) setAuthenticated(false);
          navigate("/login");
          return;
        }
        // Mark authenticated
        if (setAuthenticated) setAuthenticated(true);

        // fetch profile (we normalize the response)
        await fetchUserData(token);
      } catch (err) {
        console.error("Auth initial load error:", err);
        navigate("/login");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // once we have userData, try to fetch posts in area (prefers profile coords, then browser geolocation, then user-provided fallback)
  useEffect(() => {
    const tryFetch = async () => {
      const userLat = userData?.userData?.latitude;
      const userLon = userData?.userData?.longitude;

      if (userLat != null && userLon != null) {
        console.log("Using user profile coordinates to fetch posts:", userLat, userLon);
        handleLocationChange(Number(userLat), Number(userLon));
        return;
      }

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            console.log("Geolocation obtained:", latitude, longitude);
            handleLocationChange(latitude, longitude);
          },
          (err) => {
            console.warn("Geolocation error/denied; using fallback coords:", err);
            handleLocationChange(FALLBACK_LAT, FALLBACK_LON);
          },
          { timeout: 10000 }
        );
      } else {
        console.warn("No geolocation available, fetching posts with fallback coords");
        handleLocationChange(FALLBACK_LAT, FALLBACK_LON);
      }
    };

    if (userData) tryFetch();
  }, [userData, refresh]);

  // ------------------ UI helpers ------------------
  const openPopup = (post) => {
    setPopupData(post);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setPopupData(null);
    setIsPopupOpen(false);
  };

  const handleCheckboxChange = (postId, isChecked) => {
    setCheckedPosts((prev) => (isChecked ? [...prev, postId] : prev.filter((id) => id !== postId)));
  };

  // ------------------ Bulk endorse ------------------
  const handleEndorseAll = async () => {
    if (!checkedPosts.length) {
      notify("Select posts first");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      setLoading(true);
      for (const postId of checkedPosts) {
        await fetch(`${API_URL}/activity/endorsePost/${postId}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userData?.userData?.id }),
        });
      }
      setRefresh((r) => !r);
      notify("Selected posts are endorsed");
      setCheckedPosts([]);
    } catch (err) {
      console.error("Error endorsing posts:", err);
      notify("Error endorsing posts");
    } finally {
      setLoading(false);
    }
  };

  const openProfilePopup = () => {
    if (userData?.userData) {
      setPopupData({ photos: userData.userData.photo });
      setIsPopUpVisible(true);
    }
  };

  const createpage = () => navigate("/create");
  const direct = () => navigate("/create");

  // click outside search bar to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // auto close search dropdown
  useEffect(() => {
    let timer;
    if (isOpen) timer = setTimeout(() => setIsOpen(false), 30000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const postsToRender = Array.isArray(filteredPosts) ? filteredPosts : [];

  return (
    <>
      {authenticated && (
        <div className="flex items-center justify-center w-screen min-h-screen p-4 sm:p-2 bg-gray-50">
          {isPopUpVisible && <PopupComponent post={popupData} onClose={() => setIsPopUpVisible(false)} />}

          {/* Location runs but renders nothing (ensure your Location component returns null) */}
          <Location onLocationChange={handleLocationChange} />

          {/* Main card - Option A: Medium wide, responsive (w-11/12, max-w-screen-lg) */}
          <div className="bg-white-A700 flex flex-col items-start justify-start w-11/12 max-w-screen-lg h-auto sm:w-full border-[1px] rounded-lg overflow-hidden shadow-sm">
            <div className="flex flex-col gap-3 items-center w-full">
              {/* Header: Back button + user block + actions */}
              <div className="relative bg-gray-50 flex flex-row items-center justify-between p-3 w-full">
                <div className="flex gap-3 items-center">
                  {/* Back button */}
                  <button
                    onClick={() => navigate(-1)}
                    className="mr-2 inline-flex items-center gap-2 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 text-sm font-medium"
                    aria-label="Go back"
                    type="button"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                    <span>Back</span>
                  </button>

                  {userData?.userData?.photo && imageLoaded ? (
                    <img
                      className="cursor-pointer w-14 h-14 rounded-full object-cover object-top"
                      src={
                        getPhotoFilename(userData.userData.photo)
                          ? `${API_URL}/image/${encodeURIComponent(getPhotoFilename(userData.userData.photo))}`
                          : `${APP_PATH}images/nopost.svg`
                      }
                      alt="User Photo"
                      onClick={() => navigate("/users-profile")}
                      onError={() => setImageLoaded(false)}
                    />
                  ) : (
                    <div className="bg-white-A700 w-16 h-14 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faUser} className="text-gray-600" onClick={() => navigate("/users-profile")} />
                    </div>
                  )}
                  <div className="flex flex-col items-start justify-center">
                    <Text className="text-gray-900 uppercase" size="txtInterSemiBold16Gray900">
                      {(userData?.userData?.name || "").split(" ")[0] || ""}
                    </Text>
                    <Text className="text-sm text-gray-900 uppercase">ID: {userData?.userData?.id ?? "-"}</Text>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button type="button" className="font-semibold rounded-3xl text-blue-500 bg-white-A700 text-xs" onClick={direct}>
                    {`${totalTime || 0} Hrs | ${totalTime ? convertToHours(totalTime) : 0} Pts`}
                  </Button>
                  <img onClick={createpage} src={APP_PATH + "images/2.png"} className="cursor-pointer w-14 h-14 rounded-full" alt="create" />
                </div>
              </div>

              {/* Body */}
              <div className="w-full h-full bg-[#f4f6ff] rounded-md overflow-hidden flex flex-col items-center gap-5 p-4">
                {/* Search area */}
                <div className="relative mt-3 w-full max-w-xs md:max-w-sm lg:max-w-md">
                  <div className="relative">
                    <button
                      onClick={() => setIsOpen((s) => !s)}
                      className="absolute right-2 top-1 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                      aria-label="Toggle search"
                    >
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>

                    <Transition
                      show={isOpen}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      {(ref) => (
                        <div ref={searchBarRef} className="absolute -top-[10px] right-0 w-full sm:w-64 bg-white border border-gray-300 rounded-lg shadow-sm mt-2 z-10 p-3">
                          <select
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 mb-2"
                            value={searchQuery.category}
                            onChange={(e) => setSearchQuery((s) => ({ ...s, category: e.target.value }))}
                          >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.name}>
                                {cat.name}
                              </option>
                            ))}
                          </select>

                          <input
                            type="text"
                            placeholder="Search by username..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-300"
                            value={searchQuery.userName}
                            onChange={(e) => setSearchQuery((s) => ({ ...s, userName: e.target.value }))}
                          />
                        </div>
                      )}
                    </Transition>
                  </div>
                </div>

                {/* Posts area */}
                <div className={`scroller relative mt-5 w-full h-full post-container ${postsToRender.length === 0 ? "overflow-hidden" : "overflow-auto"}`}>
                  {loading ? (
                    <div className="w-full h-40 flex items-center justify-center">Loading...</div>
                  ) : postsToRender.length === 0 ? (
                    <div className="w-full h-40 flex items-center justify-center">
                      <Img className="w-1/2 h-auto object-cover" src={APP_PATH + "images/nopost.svg"} alt="No posts" />
                    </div>
                  ) : (
                    // responsive table wrapper
                    <div className="w-full overflow-x-auto">
                      <table className="min-w-full border-collapse border-2 bg-white">
                        <thead className="bg-gray-100 sticky top-0">
                          <tr>
                            <th className="border p-3 text-left">S.No.</th>
                            <th className="border p-3 text-left">Category</th>
                            <th className="border p-3 text-left">Name</th>
                            <th className="border px-8 p-3 text-left">Date</th>
                            <th className="border p-3 text-left">Time</th>
                            <th className="border p-3 text-left">Location</th>
                            <th className="border p-3 text-left">Image</th>
                            <th className="border p-3 text-left">Endorse</th>
                          </tr>
                        </thead>
                        <tbody>
                          {postsToRender.map((post, index) => {
                            const userNameValue = post.user?.name ?? "Unknown";
                            const dateDisplay = post.Date ? format(new Date(post.Date), "dd-MM-yyyy") : "-";
                            const totalTimeVal = post.totalTime ?? "-";
                            const cityName = post.latitude && post.longitude ? renderCityName(post.id) : "Unknown City";
                            return (
                              <tr key={post.id ?? index} className="border even:bg-gray-50">
                                <td className="border p-3 text-center w-16">{index + 1}</td>
                                <td className="border p-3 text-center">{post.category}</td>
                                <td className="border p-3 text-center">{userNameValue}</td>
                                <td className="border p-3 text-center">{dateDisplay}</td>
                                <td className="border p-3 text-center">{totalTimeVal}</td>
                                <td className="border p-3 text-center">{cityName}</td>
                                <td className="border p-3 text-center">
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      openPopup(post);
                                    }}
                                    className="text-[#546ef6] underline"
                                  >
                                    View
                                  </a>
                                </td>
                                <td className="border p-3 text-center w-24">
                                  <input
                                    type="checkbox"
                                    id={`endorsement_${post.id}`}
                                    checked={checkedPosts.includes(post.id)}
                                    className="border-2 border-[#546ef6] p-2 rounded-lg"
                                    onChange={(e) => handleCheckboxChange(post.id, e.target.checked)}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* popup overlay */}
                {isPopupOpen && popupData && (
                  <div className="popup-overlay">
                    <div className="popup-content">
                      <PopupComponent post={popupData} onClose={closePopup} />
                    </div>
                  </div>
                )}

                {/* bulk endorse button */}
                {checkedPosts.length > 0 && (
                  <div className="w-full flex justify-end">
                    <button
                      className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={handleEndorseAll}
                      type="button"
                    >
                      Endorse Selected Posts
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Endorse;
