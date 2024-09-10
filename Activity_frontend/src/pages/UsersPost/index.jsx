import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "Constant";
import { toast } from "react-toastify";
import { Img } from "components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import PopupComponent from "components/popup";
import "./style.css"
import { format } from "date-fns";

const UsersPosts = () => {
    const { userId } = useParams();
    const [userPosts, setUserPosts] = useState([]);
    const [userData, setUserData] = useState(null)
    const navigate = useNavigate();
    const [cityNames, setCityNames] = useState({});
    const [popupData, setPopupData] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);


    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }



                const response = await fetch(`${API_URL}/activity/getPostsByUser/${userId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                // console.log("ye hai data", data)
                if (response.ok) {
                    setUserPosts(data.posts || []);
                    setUserData(data.user || {})
                    fetchCityNames(data.posts || []);
                } else {
                    const errorData = await response.json();
                    toast.error(`Error fetching user posts: ${errorData.message}`);
                }
            } catch (error) {
                toast.error("An error occurred while fetching user posts");
            }
        };

        fetchUserPosts();
    }, [userId, navigate]);

    console.log("ye hai posts", userPosts)

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

    const fetchCityNames = async (posts) => {
        const promises = posts.map(async (post) => {
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

    const renderCityName = (postId) => {
        return cityNames[postId] || "Loading...";
    };

    const openPopup = (post) => {
        setPopupData(post);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const goback = () => {
        navigate("/admin")
    }


    return (
        <div className="w-screen h-screen bg-white-A700 flex items-start justify-center sm:w-screen sm:h-screen md:w-screen md:h-screen p-5 sm:p-0">
            <div className="relative w-4/12 h-full sm:w-full sm:h-full md:w-3/4 md:h-full lg:w-3/4 lg:h-full flex flex-col items-center justify-center border-[1px] rounded-lg sm:rounded-none overflow-hidden">
                <div className="flex flex-col items-center justify-start w-full h-full">
                    <div className="bg-gray-200 flex flex-row items-center justify-start gap-4 p-1  w-full h-1/12">
                        <div onClick={goback} className="w-5 h-5 flex items-center justify-center ml-3">
                            <FontAwesomeIcon icon={faAngleLeft} className="text-[#546ef6] text-xl hover:cursor-pointer" />
                        </div>
                        <div className="w-7/12 flex  gap-10 items-center justify-center">
                            <div className="w-full flex items-center gap-2 justify-between">
                                {userData && (
                                    <img
                                        className=" w-14 h-14 sm:w-14 sm:h-14   rounded-full object-cover object-top "
                                        src={`${API_URL}/image/${userData.photo}`}
                                        alt="userimage"
                                    />
                                )}

                                <h3 className=" w-full  text-md  font-semibold text-blue_gray-900">
                                    Posts by {userData && userData.name}
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="scroller flex flex-col gap-2  sm:gap-3 items-start justify-start p-2 sm:py-5 w-full h-full  overflow-y-auto">
                        {userPosts.length > 0 ? (
                            <table className="w-full ">
                                <thead>
                                    <tr>
                                        <th>Category</th>
                                        <th>Name</th>
                                        <th>Time</th>
                                        <th>Location</th>
                                        <th>Image</th>
                                        <th>Date</th>
                                        <th>Approved</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userPosts.map((post) => (
                                        <tr key={post.id} className="border-b-2">
                                            <td className="py-3 px-4">{post.category}</td>
                                            <td className="py-3 px-8">{userData && userData.name}</td>
                                            <td className="p-3">{post.totalTime}</td>
                                            <td className="py-3 px-10">
                                                {post.latitude && post.longitude ? (
                                                    <span>{renderCityName(post.id)}</span>
                                                ) : (
                                                    "Unknown City"
                                                )}
                                            </td>
                                            <td className="px-5">
                                                <a
                                                    href="#"
                                                    onClick={() => openPopup(post)}
                                                    className="text-[#546ef6] underline"
                                                >
                                                    View
                                                </a>
                                            </td>
                                            <td className="px-2">
                                            {format(new Date(post.Date), 'dd MMMM yyyy')}
                                            </td>

                                                <td className="px-6">{post.approved?"Yes":"No"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) :(
                            <div className="w-full h-full flex items-center justify-center">
                                <Img
                                    className="w-1/2 h-auto object-cover object-center"
                                    src="../images/nopost.svg"
                                    alt="No posts available for endorsement"
                                />
                            </div>
                        ) }
                    </div>

                    
                </div>
            </div>

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
    );
};

export default UsersPosts;
