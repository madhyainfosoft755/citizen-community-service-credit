import React, { useEffect, useRef, useState } from "react";
import { Button, Img, Text } from "components";
import { API_URL } from "Constant";
import { useNavigate } from "react-router-dom";
import { useAuth } from "components/AuthProvider/AuthProvider";
import Location from "pages/Location/Location";
import { Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import PopupComponent from "components/popup";
import "./style.css";
import { toast } from "react-toastify";

const Endorse = () => {
  const notify = (e) => toast(e);
  const [isPopUpVisible, setIsPopUpVisible] = useState(false); // State for pop-up visibility
  const [selectedPost, setSelectedPost] = useState(null); // State for selected post
  const [checkedPosts, setCheckedPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [error, setError] = useState(null);
  const { authenticated, setAuthenticated } = useAuth();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [locationData, setLocationData] = useState(null);
  const [totalTime, setTotalTime] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    category: "",
    userName: "",
  });
  const transitionRef = useRef(null);
  const searchBarRef = useRef(null); // Ref for the search bar component
  // const categories = [
  //   { id: 1, label: "Gardening" },
  //   { id: 2, label: "Cleaning" },
  //   { id: 3, label: "Teaching Poor" },
  //   { id: 4, label: "Planting Tree" },
  //   { id: 5, label: "Marathon" },
  //   { id: 6, label: "Social Activities" },
  // ];

  const [categories, setCategories]= useState([])
  const [cityNames, setCityNames] = useState({}); // Default value can be 'Unknown City'
  const [popupData, setPopupData] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userName, setUserName] = useState("")
  const [endorsedPosts, setEndorsedPosts] = useState([]); // State variable to track endorsed posts
  const [refresh, setRefresh] = useState(false)


  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/activity/getCategoriesAdmin`);
      if (!response.ok) {
        toast.error('Failed to fetch categories');
      }
      const data = await response.json();
      // console.log("ye hai categories", data)
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  useEffect(() => {
    // Fetch categories when component mounts
    fetchCategories();
  }, []);


  // Function to open the popup with photos and videos
  const openPopup = (post) => {
    setPopupData(post);
    setIsPopupOpen(true);
  };

  // Function to close the popup
  const closePopup = () => {
    setPopupData(null);
    setIsPopupOpen(false);
  };

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

  //sends token and userkey to local storage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userKey = localStorage.getItem("userKey");

    if (!token || !userKey) {
      navigate("/login");
    } else {
      fetchUserData(token);
      checkTokenExpiry(token);
    }
  }, [navigate]);

  //if user data is avaliable then fetch posts
  // useEffect(() => {
  //   if (userData?.userData?.id) {
  //     fetchUserPosts(userData.userData.id);
  //   }
  // }, [userData]);

  const handleLocationChange = (latitude, longitude) => {
    setLocationData({ latitude, longitude });
  };

  //if location data is avaliable the fetch posts in that area
  useEffect(() => {
    if (locationData) {
      fetchPostsInArea(locationData.latitude, locationData.longitude);
    }
  }, [locationData, userData, refresh]);

  //fetch userdata
  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${API_URL}/activity/profile`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await response.json();
      if (response.ok) {
        setUserName(userData.userData.name)
        setUserData(userData);
        // console.log("this is user data", userData)
      } else {
        console.error("Error fetching user data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const name = userName.split(" ")[0];


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

  //fetch posts avaliable in the latitude and longitude
  const fetchPostsInArea = async (latitude, longitude) => {

    try {
      const newdata = {
        latitude,
        longitude,
        userId: userData?.userData?.id,
        username: userData?.userData?.name
      }
      // console.log("this is the user id", newdata)
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/activity/fetchPostsInArea`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newdata),

      });
      // console.log("kya response aa rha hai", latitude, longitude);

      if (response.ok) {
        const postsData = await response.json();
        setUserPosts(postsData);
        setFilteredPosts(postsData); // Initialize filtered posts with posts in the area
      } else {
        console.error("Error fetching posts in area:", response.status);
        setError("An error occurred while fetching posts in area.");
      }
    } catch (error) {
      console.error("Error fetching posts in area:", error);
      setError("An error occurred while fetching posts in area.");
    }
  };

  // Update filtered posts when user posts change
  useEffect(() => {
    setFilteredPosts(userPosts);
  }, [userPosts]);

  //search bar handler
  const handleSearch = () => {
    const { category, userName } = searchQuery;
    let filtered = userPosts;
    if (category) {
      filtered = filtered.filter(
        (post) =>
          post.category &&
          post.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    if (userName) {
      filtered = filtered.filter(
        (post) =>
          post.category &&
          post.user.name.toLowerCase().includes(userName.toLowerCase())
      );
    }
    setFilteredPosts(filtered);
  };

  // Update filtered posts when searchQuery changes
  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  //logout function
  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userKey");
    navigate("/login");
  };

  //navigate to create page
  const direct = () => {
    navigate("/create");
  };

  //animation for search bar
  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setTimeout(() => {
        setIsOpen(false);
      }, 30000);
    }

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Create an event listener to handle clicks outside of the search bar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setIsOpen(false); // Close the search bar if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchCityNames = async (posts) => {
      const promises = filteredPosts.map(async (post) => {
        if (post.latitude && post.longitude) {
          const cityName = await fetchCityName(post.latitude, post.longitude);
          return { postId: post.id, cityName };
        }
        return { postId: post.id, cityName: "Unknown City" };
      });
      const resolvedCityNames = await Promise.all(promises);
      const cityNamesObject = resolvedCityNames.reduce((acc, item) => {
        acc[item.postId] = item.cityName;
        return acc;
      }, {});
      setCityNames(cityNamesObject);
    };
    fetchCityNames(filteredPosts);
  }, [filteredPosts]);

  const fetchCityName = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GoogleGeocode}`
      );

      if (response.data && response.data.results) {
        const addressComponents = response.data.results[0].address_components;
        const cityObj = addressComponents.find(component =>
          component.types.includes('locality')
        );

        const city = cityObj ? cityObj.long_name : 'Unknown City';
        return city;
      }
      return 'Unknown City';
    } catch (error) {
      console.error("Error fetching location data:", error);
      return "Unknown City";
    }
  };

  const renderCityName = (postId) => {
    return cityNames[postId] || "Loading...";
  };

  const [textIndex, setTextIndex] = useState(0);
  const carouselTexts = [`${totalTime || 0} Hours`, 'Create Activity']; // Add your carousel text here

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % carouselTexts.length);
    }, 2000); // Change text every 2 seconds

    return () => clearInterval(interval);
  }, []);


  const handleCheckboxChange = (postId, isChecked) => {
    if (isChecked) {
      setCheckedPosts((prevChecked) => [...prevChecked, postId]);
    } else {
      setCheckedPosts((prevChecked) => prevChecked.filter((id) => id !== postId));
    }
  };

  const handleEndorseAll = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Loop through all checked posts and endorse them
      for (const postId of checkedPosts) {
        const response = await fetch(`${API_URL}/activity/endorsePost/${postId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userData.userData.id }),
        });
      }
      setRefresh(!refresh)

      // After endorsing all posts, update the UI or perform any necessary actions
      notify("Selected posts are endorsed")
      // Clear the checked posts after endorsing
      setCheckedPosts([]);
    } catch (error) {
      console.error("Error endorsing posts:", error);
      notify(error)
      // Handle error accordingly
    }
  };

  const openProfilePopup = () => {
    if (userData && userData.userData) {
      setSelectedPost({ photos: userData.userData.photo });
      setIsPopUpVisible(true);
    }
  };

  // console.log("all filtered post", filteredPosts);
  return (
    <>
      {authenticated && (
        <div className=" flex items-center justify-center w-screen h-screen sm:w-screen sm:h-screen md:w-screen md:h-screen p-4 sm:p-0 md:pt-2 md:pb-2">
        {isPopUpVisible && (
            <PopupComponent post={selectedPost} onClose={() => setIsPopUpVisible(false)} />
          )}
          <div className="bg-white-A700 flex flex-col items-start justify-start sm:px-0  border-[1px] rounded-lg sm:rounded-none w-4/12 h-full sm:w-full sm:h-full md:w-7/12 md:h-full">
            <div className="flex flex-col gap-3 items-center justify-start w-full h-full   sm:p-0 ">
              <div className="relative bg-gray-50 flex flex-row items-center justify-between p-3  sm:px-5 w-full rounded-md sm:rounded-none ">
          <img src="/images/2.png" className="w-7 h-7 absolute top-1 right-1 rounded-full" alt="" />

                <div className="flex flex-row gap-4 items-center justify-center ml-[5px]" onClick={openProfilePopup}>
                  {userData && (
                    <Img
                      className=" w-14 h-14 sm:w-14 sm:h-14   rounded-full object-cover object-top "
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
                        {/* {userData && userData.userData.name} */}
                        {name}
                      </Text>
                      <Text className="text-center  text-gray-900 uppercase text-sm">
                        ID: {userData && userData.userData.id}
                      </Text>
                    </div>
                  </div>
                </div>
                <Button
                  className="rounded-3xl cursor-pointer font-semibold w-5/12 mr-4"
                  // shape="round"
                  color="indigo_A200"
                  onClick={direct}
                >
                  {carouselTexts[textIndex]}
                </Button>
              </div>

              <div className="w-full h-full  bg-[#f4f6ff]  rounded-md overflow-hidden flex flex-col items-center justify-top gap-5 ">
                <h1 className="text-right text-xs w-fit ml-auto hidden">
                  {" "}
                  <Location onLocationChange={handleLocationChange} />
                </h1>

                <div className="mt-3 mb-5 relative w-5/6 md:w-64">
                  <div className="relative">
                    <button
                      onClick={() => {
                        setIsOpen(!isOpen);
                      }}
                      className="absolute z-20  right-2 top-1 flex items-center justify-center bg-blue-500 text-white rounded-full w-8 h-8 focus:outline-none"
                    >
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                    <Transition
                      show={isOpen}
                      enter="transition ease-out duration-200 transform"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="transition ease-in duration-150 transform"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      {(ref) => {
                        transitionRef.current = ref;
                        return (
                          <div
                            ref={searchBarRef}
                            className="absolute -top-[10px] right-0 w-full sm:w-64 bg-white border border-gray-300 rounded-lg shadow-sm mt-2 z-10"
                          >
                            <select
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                              value={searchQuery.category}
                              onChange={(e) =>
                                setSearchQuery({
                                  ...searchQuery,
                                  category: e.target.value,
                                })
                              }
                            >
                              <option className="sm:text-xs" value="">All Categories</option>
                              {/* Map over categories and render options */}
                              {categories.map((category) => (
                                <option className="sm:text-xs" key={category.id} value={category.name}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                            <input
                              type="text"
                              placeholder="Search by username..."
                              className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                              value={searchQuery.userName}
                              onChange={(e) =>
                                setSearchQuery({
                                  ...searchQuery,
                                  userName: e.target.value,
                                })
                              }
                            />
                          </div>
                        );
                      }}
                    </Transition>
                  </div>
                </div>

                <div className={`scroller relative mt-5 w-full h-full  post-container ${filteredPosts.length === 0 ? "overflow-hidden" : "overflow-auto"}`}>
                  {filteredPosts.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Img
                        className="w-1/2 h-auto object-cover object-center"
                        src="images/nopost.svg"
                        alt="No posts available for endorsement"
                      />
                    </div>
                  ) : (
                    <table className="w-52 border-collapse border-2">
                      <thead className="">
                        <tr className="border">
                          <th className="border p-3">Category</th>
                          <th className="border p-3">Name</th>
                          <th className="border p-3">Time</th>
                          <th className="border p-3">Location</th>
                          <th className="border p-3">Image</th>
                          <th className="border p-3">Endorse</th>
                        </tr>
                      </thead>
                      <tbody className=" ">
                        {filteredPosts.map((post) => (
                          <tr key={post.id} className=" border">
                            <td className="border p-3 text-center" >{post.category}</td>
                            <td  className="border p-3 text-center">{post.user ? post.user.name : 'Unknown'}</td>
                            <td  className="border p-3 text-center">{post.totalTime}</td>
                            <td className="border p-3 text-center">
                              {post.latitude && post.longitude ? (
                                <span>{renderCityName(post.id)}</span>
                              ) : (
                                'Unknown City'
                              )}
                            </td>
                            <td  className="border p-3 text-center">
                              <a
                                href="#"
                                onClick={() => openPopup(post)}
                                className="text-[#546ef6] underline"
                              >
                                View
                              </a>
                            </td>
                            <td  className="w-full h-full items-center justify-center px-8">
                              <input
                                type="checkbox"
                                id={`endorsement_${post.id}`}
                                checked={checkedPosts.includes(post.id)}
                                // disabled={endorsedPosts.includes(post.id)} // Disable the checkbox if post is already endorsed
                                className="border-2 border-[#546ef6] border-solid p-2 rounded-lg"
                                onChange={(e) => handleCheckboxChange(post.id, e.target.checked)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                  )}
                </div>


                {/* Popup/Modal */}
                {isPopupOpen && (
                  <div className="popup-overlay">
                    <div className="popup-content ">
                      <PopupComponent
                        className="w-screen h-screen overflow-scroll flex flex-col items-center justify-center gap-5"
                        post={popupData}
                        onClose={closePopup}
                      />
                    </div>
                  </div>
                )}
              </div>
              {checkedPosts.length > 0 && (
                <button className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleEndorseAll}>
                  Endorse Selected Posts
                </button>
              )}
              {/* <Button
                className="cursor-pointer font-semibold w-5/6  mb-2 text-base text-center"
                shape="round"
                color="indigo_A200"
                onClick={handleLogout}
              >
                LOGOUT
              </Button> */}
            </div>
          </div>
        </div>

      )}
    </>
  );
};

export default Endorse;
