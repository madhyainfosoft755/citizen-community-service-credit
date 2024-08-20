import { Button, Img, Text } from 'components'
import { API_URL, APP_PATH } from 'Constant'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";
import { format } from 'date-fns';

const ImageModel = () => {
    const notify = (e) => toast(e);
    const navigate = useNavigate(); // Use useNavigate hook for programmatic navigation
    const [userName, setUserName] = useState(""); // Added state for user name
    const [userData, setUserData] = useState(null);
    const [filteredPosts, setFilteredPosts] = useState([]); // State to store posts

    const Name = userName.split(" ")[0];


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
            checkTokenExpiry(token);
            fetchUnendorsedPosts(token);
        }

        // You may also want to check the validity of the token here if needed

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]); //


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


    const fetchUnendorsedPosts = async (token) => {
        try {
            const response = await fetch(`${API_URL}/admin/fetchUnendorsedPosts`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const posts = await response.json();
                console.log("what are the posts", posts);

                setFilteredPosts(posts);
            } else {
                console.error('Error fetching posts:', response.status);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };


    const sendUnendorsedPosts = async () => {


        const postsToSend = filteredPosts.slice(0, 100).map(post => ({
            id: post.id,
            category: post.category,
            image: post.photos, // Assuming `post.image` contains the image URL or data
            username: post.user ? post.user.name : 'Unknown',
        }));

        console.log("kya posts ja rhe hain", postsToSend);

        try {
            const response = await fetch(`${API_URL}/admin/processUnendorsedPosts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
    }

    return (
        <div className="w-screen h-screen  bg-white-A700 flex items-start justify-center sm:w-screen sm:h-screen md:w-screen md:h-screen p-5 sm:p-0">
            <div className=" relative w-4/12 h-full sm:w-full sm:h-full md:w-3/4 md:h-full  lg:w-3/4 lg:h-full  flex flex-col items-center  justify-center border-[1px]  rounded-lg sm:rounded-none overflow-hidden">
                <div className=" flex flex-col  items-center justify-start w-full h-full ">
                    <div className="bg-gray-50 flex flex-row items-center justify-between p-3 sm:p-5  sm:px-5 w-full ">

                        <div className="flex flex-row gap-4 items-center justify-center ml-[1px]">
                            {userData && (
                                <Img
                                    className=" sm:w-[58px] sm:h-[52px] md:w-[58px] md:h-[52px] lg:w-[58px] lg:h-[58px]  w-14 h-12 rounded-full object-cover object-top  "
                                    src={`${API_URL}/image/${userData.userData.photo}`}
                                    alt="image"
                                    onClick={() => { navigate("/users-profile") }}

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


                    </div>
                    <div className='w-full h-full bg-orange-300 flex flex-col items-center justify-between p-3'>
                        <h1 className='font-semibold text-xl'>List of all the posts that are not endorsed</h1>

                        <div className={`scroller relative mt-5 w-full h-96 bg-blue-300  post-container ${filteredPosts.length === 0 ? "overflow-hidden" : "overflow-auto"}`}>
                            {filteredPosts.length === 0 ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Img
                                        className="w-1/2 h-auto object-cover object-center"
                                        src={APP_PATH + "images/nopost.svg"}
                                        alt="No posts available for endorsement"
                                    />
                                </div>
                            ) : (
                                <table className="w-52 border-collapse border-2">
                                    <thead className="">
                                        <tr className="border">
                                            <th className="border p-3">Category</th>
                                            <th className="border p-3">Name</th>
                                            <th className="border px-8">Date</th>
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
                                                <td className="border p-3 text-center">{post.user ? post.user.name : 'Unknown'}</td>
                                                <td className="border p-1 text-center ">
                                                    {/* {format(post.Date, "dd-MM-yyy")} */}
                                                </td>
                                                <td className="border p-3 text-center">{post.totalTime}</td>
                                                <td className="border p-3 text-center">
                                                    {/* {post.latitude && post.longitude ? (
                                                        <span>{renderCityName(post.id)}</span>
                                                    ) : (
                                                        'Unknown City'
                                                    )} */}
                                                </td>
                                                <td className="border p-3 text-center">
                                                    <a
                                                        href="#"
                                                        // onClick={() => openPopup(post)}3
                                                        className="text-[#546ef6] underline"
                                                    >
                                                        View
                                                    </a>
                                                </td>

                                                {/* <td className="w-full h-full items-center justify-center px-8">
                                                    <input
                                                        type="checkbox"
                                                        id={`endorsement_${post.id}`}
                                                        checked={checkedPosts.includes(post.id)}
                                                        // disabled={endorsedPosts.includes(post.id)} // Disable the checkbox if post is already endorsed
                                                        className="border-2 border-[#546ef6] border-solid p-2 rounded-lg"
                                                        onChange={(e) => handleCheckboxChange(post.id, e.target.checked)}
                                                    />
                                                </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            )}

                        </div>
                            <button onClick={sendUnendorsedPosts} className=' p-4 font-semibold bg-green-300 rounded-lg'>Auto Endorse</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImageModel