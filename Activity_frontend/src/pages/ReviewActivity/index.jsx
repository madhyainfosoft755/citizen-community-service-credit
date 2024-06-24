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

const ReviewPosts = () => {
    const notify = (e) => toast(e);
    const { userId, postId } = useParams();
    const [userPosts, setUserPosts] = useState([]);
    const [userData, setUserData] = useState(null)
    const navigate = useNavigate();
    const [cityNames, setCityNames] = useState({});
    const [popupData, setPopupData] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [hasFocus, setHasFocus] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isRejectDisabled, setIsRejectDisabled] = useState(true);
    const [remainingChars, setRemainingChars] = useState(300);
    const [location, setLocation] = useState({ city: "Loading...", state: "Loading..." });


    const fetchPost = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            const response = await fetch(`${API_URL}/activity/reviewpostforuser/${userId}/${postId}`, {
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
                if (data.posts && data.posts.length > 0) {
                    const post = data.posts[0];
                    // console.log("kya aya post mai", post)
                    fetchLocation(post.latitude, post.longitude);
                }
            } else {
                const errorData = await response.json();
                toast.error(`Error fetching user posts: ${errorData.message}`);
            }
        } catch (error) {
            toast.error(error);
        }
    };


    useEffect(() => {

        fetchPost();
    }, [userId, postId]);



    const fetchLocation = async (latitude, longitude) => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GoogleGeocode}`
            );

            // console.log("kya aya location data", response)
            if (response.data && response.data.results.length > 0) {
                const { address_components } = response.data.results[0];
                const cityComponent = address_components.find(component =>
                    component.types.includes("administrative_area_level_3")
                );
                const stateComponent = address_components.find(component =>
                    component.types.includes("administrative_area_level_1")
                );

                const city = cityComponent ? cityComponent.long_name : "Unknown City";
                const state = stateComponent ? stateComponent.long_name : "Unknown State";

                // console.log("what is the city name", city)
                // console.log("what is the state name", state)

                setLocation({ city, state });
            } else {
                setLocation({ city: "Unknown City", state: "Unknown State" });
            }
        } catch (error) {
            setLocation({ city: "Error", state: "Error" });
            toast.error("Error fetching location data");
        }
    };



    const openPopup = (post) => {
        setPopupData(post);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const goback = () => {
        navigate("/approvehours")
    }


    const handleInputChange = (e) => {
        const inputText = e.target.value;
        if (inputText.length <= 300) {
            setInputValue(inputText);
            setRemainingChars(300 - inputText.length);
            const words = inputText.trim().split(/\s+/);
            setIsRejectDisabled(words.length < 8);

        }
    };

    const openProfilePopup = () => {
        if (userData) {
            setPopupData({ photos: userData.photo });
            setIsPopupOpen(true);
        }
    };

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
                fetchPost();
                notify("Hours request approved successfully");
                navigate("/approvehours")
            } else {
                notify("Failed to approve hours request");
            }
        } catch (error) {
            notify("Error approving hours request");
            console.error("Error approving hours request:", error);
        }
    };


    const rejectHoursRequest = async (postId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/activity/rejectHours/${postId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rejectionReason: inputValue }),
            });

            if (response.ok) {
                fetchPost();
                notify("Hours request rejected successfully");
                navigate("/approvehours")
            } else {
                notify("Failed to reject hours request");
            }
        } catch (error) {
            notify("Error rejecting hours request");
            console.error("Error rejecting hours request:", error);
        }
    };
    return (
        <div className="w-screen h-screen bg-white-A700 flex items-start justify-center sm:w-screen sm:h-screen md:w-screen md:h-screen p-5 sm:p-0">
            <div className="relative w-4/12 h-full sm:w-full sm:h-full md:w-3/4 md:h-full lg:w-3/4 lg:h-full flex flex-col items-center justify-center border-[1px] rounded-lg sm:rounded-none overflow-hidden">
                <div className="flex flex-col items-center justify-start w-full h-full">
                    <div className="bg-gray-200 flex flex-row items-center justify-start gap-4 p-1  w-full h-1/12">
                        <div onClick={goback} className="w-5 h-5 flex items-center justify-center ml-3">
                            <FontAwesomeIcon icon={faAngleLeft} className="text-[#546ef6] text-xl hover:cursor-pointer" />
                        </div>
                        <div className="w-7/12 flex  gap-10 items-center justify-center">
                            <div className="w-full flex items-center gap-2 justify-between"
                                onClick={openProfilePopup} >
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

                    <div className=" w-full h-full flex flex-col gap-5 items-center justify-start p-3 overflow-auto scroller">
                        <div className="w-full h-5/6  rounded-lg  overflow-hidden border-2">
                            <div className="w-full h-1/2 rounded-tr-lg rounded-tl-lg overflow-hidden">
                                {userPosts.length > 0 ? (
                                    <img
                                        className="w-full h-full object-cover object-center"
                                        src={`${API_URL}/image/${userPosts[0].photos}`}
                                        alt="userimage"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white">
                                        <Img
                                            className="w-1/2 h-auto object-cover object-center"
                                            src="/images/nopost.svg"
                                            alt="No posts available for endorsement"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="w-full h-1/2  flex gap-2">
                                <div className="w-full h-full  flex items-center justify-center ">
                                    {userPosts.length > 0 ?
                                        <div className="grid grid-cols-3 gap-4 p-2" >
                                            <div className="flex flex-col  items-center justify-center gap-1">
                                                <h1 className="underline">User ID</h1>
                                                <h1>{userPosts[0].UserId}</h1>
                                            </div>
                                            <div className="flex flex-col items-center justify-center gap-1">
                                                <h1 className="underline">Category</h1>
                                                <h1>{userPosts[0].category}</h1>
                                            </div>
                                            <div className="flex flex-col items-center justify-center gap-1">
                                                <h1 className="underline">Time</h1>
                                                <h1>{userPosts[0].totalTime}</h1>
                                            </div>
                                            <div className="flex flex-col items-center justify-center gap-1">
                                                <h1 className="underline">Date</h1>
                                                <h1>{userPosts[0].Date}</h1>
                                            </div>
                                            <div className="flex flex-col items-center text-center justify-center gap-1">
                                                <h1 className="underline">Location</h1>
                                                <h1>{location ? `${location.city}, ${location.state}` : "Loading..."}</h1>
                                            </div>
                                            <div className="flex flex-col items-center justify-center gap-1">
                                                <h1 className="underline">Image</h1>
                                                <button
                                                    className="text-blue-600 underline"
                                                    onClick={() => openPopup(userPosts[0])}
                                                >
                                                    View
                                                </button>
                                            </div>


                                        </div>
                                        :
                                        <div className="w-full h-full flex items-center justify-center">
                                            <img
                                                className="w-1/2 h-auto object-cover object-center"
                                                src="/images/nopost.svg"
                                                alt="No posts available for endorsement"
                                            />
                                        </div>
                                    }

                                </div>
                            </div>
                        </div>
                        <div className="w-full h-1/12 relative border-[1px] rounded-lg">
                            <label htmlFor="desc" className={`absolute rounded text-xs left-2 bg-white-A700 transition-all duration-200 ease-in-out ${hasFocus ? '-top-2 left-0' : 'top-[25%] left-[40%]'}`}>Add Comment</label>
                            <input type="text" name="desc" className="w-full h-full border-none rounded-lg" onFocus={() => setHasFocus(true)}
                                onBlur={(e) => setHasFocus(e.target.value !== '')}
                                onChange={handleInputChange}
                                value={inputValue}
                            />
                            <span className="text-xs text-gray-500 absolute bottom-1 right-1">
                                {remainingChars}/300
                            </span>
                        </div>

                        <div className=" w-full h-1/12 flex gap-2 items-center justify-center">
                            <button onClick={() => rejectHoursRequest(userPosts[0].id)} className={`w-1/2 py-3 rounded-md  font-semibold ${isRejectDisabled ? "bg-gray-500 text-black-900_87 cursor-default" : "hover:bg-red-500 hover:text-white-A700 sm:focus-within:bg-red-400 bg-[#e5e7eb] cursor-pointer"}`} disabled={isRejectDisabled}> Reject</button>
                            <button onClick={() => approveHoursRequest(userPosts[0].id)} className="w-1/2 py-3 rounded-md bg-[#e5e7eb] font-semibold hover:bg-lime-400   hover:text-white-A700"> Approve</button>
                        </div>

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

export default ReviewPosts;
