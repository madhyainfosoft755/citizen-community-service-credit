import React, { useEffect, useState } from "react";

import { Button, Img, Input, Text } from "components";
import { API_URL, APP_PATH } from "Constant";
import { useNavigate } from "react-router-dom";
import { useAuth } from "components/AuthProvider/AuthProvider";
import "./style.css"
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { convertToHours } from "utils";
import { faDownload, faUser, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import useWindowsize from "./useWindowsize";
import CertficatePopup from "components/certificate_modal";
import EditProfile from "components/editProfile/editProfile";
const ProfileForUser = () => {
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
    const [usersWithMostPostsInQuter, setUsersWithMostPostsInQuter] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // State for selected user
    const [userPosts, setUserPosts] = useState([]); // State for user's posts
    const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility
    const [isEditModal, setIsEditModal] = useState(false); // State for popup visibility
    const [formattedDate, setFormattedDate] = useState();

    const size = useWindowsize();

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(size.width <= 768); // Adjust the width threshold as needed for your design
    }, [size]);

    useEffect(() => {
        const today = new Date();

        // Get the date components
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(today.getDate()).padStart(2, '0');

        // Format the date as YYYY-MM-DD
        setFormattedDate(`${year}-${month}-${day}`);
    }, [])
    // Crea
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
            fetchMostPostsInQuater(token);
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


    // const handleLogout = () => {
    //     // Clear authentication status, remove token and user key, and redirect to the login page
    //     setAuthenticated(false);
    //     localStorage.removeItem("token");
    //     localStorage.removeItem("userKey");
    //     navigate("/login");
    // };

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

    const fetchMostPostsInQuater = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }
            const response = await fetch(`${API_URL}/activity/getUsersWithMostPostsInQuater`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const { topUserNames } = await response.json();
                setUsersWithMostPostsInQuter(Array.isArray(topUserNames) ? topUserNames : []);
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


    return (
        <>
            {isPopupVisible && (
                <CertficatePopup setIsPopupVisible={setIsPopupVisible} />
            )}
            {isEditModal && (
                <EditProfile setIsEditModalOpen={setIsEditModal} />
            )}
            <div className="w-screen h-screen  bg-white-A700 flex items-start justify-center sm:w-screen sm:h-screen md:w-screen md:h-screen p-5 sm:p-0">
                <div className=" relative w-4/12 h-full sm:w-full sm:h-full md:w-3/4 md:h-full  lg:w-3/4 lg:h-full  flex flex-col items-center  justify-center border-[1px]  rounded-lg sm:rounded-none overflow-hidden">
                    <div className=" flex flex-col  items-center justify-center w-full h-full ">

                        <div className="bg-gray-50 flex flex-row items-center justify-between p-2 sm:px-2   w-full ">

                                <div className="flex  gap-2 items-center justify-center " >
                                    {userData && (
                                        <Img
                                            className=" w-14   h-14  rounded-[50%] object-cover object-center "
                                            src={`${API_URL}/image/${userData.userData.photo}`}
                                            alt="userimage"
                                        />
                                    )}
                                    <div className="flex flex-col items-center justify-center w-3/5 ">
                                        <div className="cursor-default flex flex-col items-start justify-center w-full ">
                                            <Text
                                                className="text-center text-gray-900 uppercase"
                                                size="txtInterSemiBold16Gray900"
                                            >
                                                {/* {userData && userData.userData.name} */}
                                                {userName && userName.split(" ")[0]}
                                            </Text>
                                           </div>
                                    </div>
                                </div>
                                <Button onClick={direct} className="text-blue-500 bg-white-A700 px-3 py-2 rounded-full text-xs font-semibold cursor-pointer">{`${totalTime || 0} Hrs | ${totalTime && convertToHours(totalTime)} Pts`}</Button>

                                <img onClick={()=>navigate("/create")} src={APP_PATH + "images/2.png"} className="cursor-pointer w-14 h-14 rounded-full" alt="" />

                        </div>

                        <div className="w-full h-1/2 p-1">
                            {/* <h1 className="text-xl font-semibold w-full pl-3 py-3">Top Five Stars</h1> */}
                            <div className="h-[90%] scroller overflow-x-auto p-3">
                                <div className="flex h-full space-x-2">
                                    {[
                                        { timeframe: 'Activities', users: usersWithMostPostsInMonth, nav: "/activity" },
                                        { timeframe: 'Categories', users: usersWithMostPostsInQuter, nav: "/create" },
                                        { timeframe: 'Endorsed', users: usersWithMostPostsInSixMonths, nav: "/endorse" },
                                        // { timeframe: 'Approved', users: usersWithMostPostsInYear },
                                    ].map(({ timeframe, users, nav }, index) => (
                                        <div
                                            key={index}
                                            className="rounded-lg shadow-bs shadow-black-100 w-40 h-3/4 border-[1px] flex-shrink-0 flex flex-col items-center justify-center pt-4 text-center font-medium px-3"
                                        >
                                            <h3 className="text-[#546ef6] font-bold cursor-pointer text-sm text-center" onClick={() => { navigate(nav) }}>{timeframe}  <FontAwesomeIcon icon={faArrowRight} /></h3>
                                            {/* <div className="w-full h-full flex flex-col gap-1 pt-2 overflow-auto scroller justify-start items-start">

                                        </div> */}
                                        </div>
                                    ))}
                                    {/* <div className="w-[1px] h-full flex-shrink-0"></div> */}
                                </div>
                            </div>
                        </div>


                        <div className=" w-full h-full  pt-3 ">
                            <div className=" w-full h-3/5 flex  flex-col items-center justify-between pl-4 pr-4 pt-1 pb-1">
                                <div className="w-[48%] rounded-lg bg-[#f0f2fb80] border-[1px]  text-[#546ef6] h-1/5 flex  items-center justify-center font-semibold cursor-pointer text-center" onClick={() => { setIsEditModal(false) }}><h1>Edit Profile <FontAwesomeIcon icon={faUser} /></h1></div>
                                <div className="w-[48%] rounded-lg bg-[#f0f2fb80] border-[1px]  text-[#546ef6] h-1/5 flex flex-shrink-2 items-center justify-center font-semibold cursor-pointer text-center" onClick={() => { setIsPopupVisible(true) }}><h1>Certificate  <FontAwesomeIcon icon={faDownload} /></h1></div>
                                <div className="w-[48%] rounded-lg bg-[#f0f2fb80] border-[1px]  text-[#546ef6] h-1/5 flex flex-shrink-2 items-center justify-center font-semibold cursor-pointer text-center" onClick={() => { }}><h1>Genrate Reports <FontAwesomeIcon icon={faFileAlt} /></h1></div>

                            </div>

                            {/* <div className="flex flex-col items-center justify-center gap-1  w-full h-2/5  " >
                             
                                <Button
                                    className="cursor-pointer font-semibold rounded-3xl w-5/12"
                                    // shape="round"
                                    color="indigo_A200"
                                    onClick={handleLogout}
                                >
                                    LOGOUT
                                  
                                </Button>
                            </div> */}
                        </div>
                    </div>




                </div>

            </div>


        </>
    );
};

export default ProfileForUser;
