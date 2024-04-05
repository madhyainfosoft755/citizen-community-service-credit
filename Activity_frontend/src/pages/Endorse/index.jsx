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
// import OpenCageGeocode from "opencage-api-client";

const Endorse = () => {
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
  const categories = [
    { id: 1, label: "Gardening" },
    { id: 2, label: "Cleaning" },
    { id: 3, label: "Teaching Poor" },
    { id: 4, label: "Planting Tree" },
    { id: 5, label: "Marathon" },
    { id: 6, label: "Social Activities" },
  ];
  const [cityNames, setCityNames] = useState({}); // Default value can be 'Unknown City'
  const [popupData, setPopupData] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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

  //sends token and userkey to local storage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userKey = localStorage.getItem("userKey");

    if (!token || !userKey) {
      navigate("/login");
    } else {
      fetchUserData(token);
    }
  }, [navigate]);

  //if user data is avaliable then fetch posts
  useEffect(() => {
    if (userData?.userData?.id) {
      fetchUserPosts(userData.userData.id);
    }
  }, [userData]);

  const handleLocationChange = (latitude, longitude) => {
    setLocationData({ latitude, longitude });
  };

  //if location data is avaliable the fetch posts in that area
  useEffect(() => {
    if (locationData) {
      fetchPostsInArea(locationData.latitude, locationData.longitude);
    }
  }, [locationData, userData]);

  //fetch userdata
  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${API_URL}/activity/profile`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const userData = await response.json();
        setUserData(userData);
      } else {
        console.error("Error fetching user data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  //fetch userPosts
  const fetchUserPosts = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/activity/postsdata/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const userPostsData = await response.json();
        setUserPosts(userPostsData);
        setFilteredPosts(userPostsData); // Initialize filtered posts with all user posts
      } else {
        console.error("Error fetching user posts:", response.status);
        setError("An error occurred while fetching user posts.");
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
      setError("An error occurred while fetching user posts.");
    }
  };

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

  //fetch posts avaliable in the latitude and longitude
  const fetchPostsInArea = async (latitude, longitude) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/activity/fetchPostsInArea`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude,
          longitude,
          userId: userData?.userData?.id,
        }),
      });

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
      filtered = filtered.filter((post) =>
        post.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    if (userName) {
      filtered = filtered.filter((post) =>
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
    fetchCityNames();
  }, [filteredPosts]);

  const fetchCityName = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=290bf9b7dacb47c9b10bec4ceb53173e`
      );

      const { results } = response.data;
      console.log("this is the citydata", results);
      if (results && results.length) {
        const { city } = results[0].components;
        return city;
      }
      return "Unknown City";
    } catch (error) {
      console.error("Error fetching location data:", error);
      return "Unknown City";
    }
  };

  const renderCityName = (postId) => {
    return cityNames[postId] || "Loading...";
  };

  console.log("all filtered post", filteredPosts);
  return (
    <>
      {authenticated && (
        <div className="bg-white-A700 flex flex-col items-center justify-center sm:px-5 rounded-[5px] shadow-bs2 w-[33%] sm:w-full sm:h-full">
          <div className="flex flex-col gap-3 items-center justify-center w-full">
            <div className="bg-gray-50 flex flex-row items-center justify-between p-7 sm:px-5 w-full  rounded-xl">
              <div className="flex flex-row gap-4 items-center justify-center ml-[5px]">
                {userData && (
                  <Img
                    className=" sm:w-16 sm:h-14   rounded-full object-cover object-top "
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

            <div className="w-full h-[75vh]  bg-[#f4f6ff] p-3 rounded-lg overflow-y-hidden flex flex-col items-center justify-top gap-5 ">
              <h1 className="text-right text-xs w-fit ml-auto hidden">
                {" "}
                <Location onLocationChange={handleLocationChange} />
              </h1>

              <div className="mb-5 relative w-full md:w-64">
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
                            <option value="">All Categories</option>
                            {/* Map over categories and render options */}
                            {categories.map((category) => (
                              <option key={category.id} value={category.label}>
                                {category.label}
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

              <div className="mt-5 w-full overflow-scroll ">
                {filteredPosts.map((post) => (
                  <div
                    className="bg-gradient-to-r from-cyan-300 to-blue-600 mb-3 rounded-xl overflow-hidden flex place-items-start justify-evenly gap-2 flex-wrap p-2"
                    key={post.id}
                  >
                    <div className="flex flex-col items-start justify-center">
                      <p className="inline text-white-A700">Category</p>
                      <p className="text-white-A700">{post.category}</p>
                    </div>

                    <div>
                      <p>Name</p>
                      <p>{post.user ? post.user.name : "Unknown"}</p>
                    </div>

                    <div>
                      <p className="text-white-A700">Time </p>
                      <p className="text-white-A700">{post.totalTime}</p>
                    </div>

                    <div>
                      <p className="text-white-A700">Location </p>
                      <p className="text-white-A700">
                        {" "}
                        {post.latitude && post.longitude ? (
                          <span>{renderCityName(post.id)}</span>
                        ) : (
                          "Unknown City"
                        )}
                      </p>
                    </div>

                    <div>
                      <p>Image & Video</p>
                      <a
                        href="#"
                        onClick={() => openPopup(post)}
                        className="text-yellow-300 underline"
                      >
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              className="cursor-pointer font-semibold w-full  mb-2 text-base text-center"
              shape="round"
              color="indigo_A200"
              onClick={handleLogout}
            >
              LOGOUT
            </Button>

            {/* Popup/Modal */}
            {isPopupOpen && (
              <div className="popup-overlay">
                <div className="popup-content">
                  <PopupComponent post={popupData} onClose={closePopup} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Endorse;
