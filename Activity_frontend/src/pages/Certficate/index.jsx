import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useEffect, useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { API_URL, APP_PATH } from "Constant";
import { toast } from "react-toastify";
import { convertToHours } from "utils";
const Certficate = ({ totalHours, categoriesList }) => {

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const printDocument = () => {
        const input = document.getElementById("divToPrint");
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF();
            pdf.addImage(imgData, "JPEG", 0, 0);
            // pdf.output('dataurlnewwindow');
            pdf.save("Certificate.pdf");
        });
    };

    const [userData, setUserData] = useState(null);
    const [userName, setUserName] = useState();
    const [totalTime, setTotalTime] = useState();
    const [error, setError] = useState();
    const [formattedDate, setFormattedDate] = useState();
    const navigate = useNavigate();
    const notify = (e) => toast(e);

    useEffect(() => {
        const today = new Date();

        // Get the date components
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(today.getDate()).padStart(2, '0');

        // Format the date as YYYY-MM-DD
        setFormattedDate(`${year}-${month}-${day}`);
    }, [])
    // Create a new Date object



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
                    console.log(userData, "user data");
                    setUserName(userData && userData.userData.name)
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


    useEffect(() => {
        // Check if both token and user key are present in local storage
        const token = localStorage.getItem("token");
        const userKey = localStorage.getItem("userKey");

        if (!token || !userKey) {
            // Redirect to the login page if either token or user key is missing
            navigate("/login");
        } else {
            // Fetch user data when component mounts
            fetchUserData(token);
            checkTokenExpiry(token);

        }

        // You may also want to check the validity of the token here if needed

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    return (
        <div className="App">
            <div>
                <div className="mb5">
                    <button onClick={printDocument}>Print</button>
                </div>
                <div className="opacity-">
                    <div id="divToPrint" className="ml-5 py-3">

                        {/* 
                    <div class="certificate-container text-center bg-white-A700_33">
                        <div class="certificate-header">
                            <h1 class="text-4xl font-bold mb-4">Certificate of Achievement</h1>
                            <p class="text-xl">This is to certify that</p>
                        </div>
                        <div class="certificate-body my-8">
                            <h2 class="text-3xl font-bold underline">[Recipient's Name]</h2>
                            <p class="text-lg my-4">has successfully completed the</p>
                            <h3 class="text-2xl font-semibold">[Course/Training/Program Title]</h3>
                            <p class="text-lg my-4">on</p>
                            <p class="text-lg font-semibold">[Date]</p>
                        </div>
                        <div class="certificate-footer mt-8">
                            <p class="text-lg">Presented by</p>
                            <h4 class="text-xl font-bold mt-2">[Issuer's Name]</h4>
                        </div>
                    </div> */}


                        {/* <div class="certificate-container text-center">
                            <div class="certificate-header">
                                <h1 class="text-4xl font-bold mb-4">Certificate of Participation</h1>
                                <p class="text-xl">This is to certify that</p>
                            </div>
                            <div class="certificate-body my-8">
                                <h2 class="text-3xl font-bold underline">{userData && userData.userData.name}</h2>
                                <p class="text-lg my-4">has actively participated in the following activities:</p>
                                {userData && JSON.parse(userData.userData.category).map((value) => {
                                    return <p class="text-md"><strong>{value}</strong> </p>
                                })}

                                <p class="text-md"><strong>Planting</strong></p>
                                <p class="text-md"><strong>Cleaning</strong> </p>

                                <p class="text-lg my-4">for a total duration of {totalTime && totalTime}.</p>
                                <p class="text-lg my-4">The activities were conducted with enthusiasm and dedication.</p>
                                <p class="text-lg my-4">on</p>
                                <p class="text-lg font-semibold">{formattedDate}</p>
                            </div>
                            <div class="certificate-footer mt-8">
                                <p class="text-lg">Presented by</p>
                                <h4 class="text-xl font-bold mt-2">Community Care 247</h4>
                            </div>
                        </div> */}
                        <div className="max-w-sm mx-auto border border-gray-300 p-4 shadow-lg relative" style={{ fontStyle: 'italic' }}>
                            <div className="text-center mb-4">
                                <h1 className="text-xl font-bold text-blue-400">Certificate of Achievement</h1>
                                <p className="text-sm text-gray-800">This is to certify that</p>
                            </div>
                            <div className="text-center mb-6">
                                <h2 className="text-md text-blue-400">Mr / Mrs {userData && userData.userData.name}</h2>
                                <p className="text-sm text-gray-800">has successfully completed</p>
                            </div>
                            <div className="text-center mb-6">
                                <p className="text-sm text-gray-800">
                                    We certify that the individual has participated in the following activities.
                                </p>
                                <p className="text-sm">{userData && JSON.parse(userData.userData.category).map((value) => {
                                    if (!(value == 'Others'))
                                        return <strong> {value}, </strong>;
                                })}</p>
                                <p className="text-sm text-gray-800 mt-2">for a total of <strong>{totalTime && convertToHours(totalTime)} hours.</strong> </p>
                            </div>
                            <div className="flex justify-center items-center absolute top-0 right-1 mt-1">
                                <div className="text-center">
                                    {/* <p className="text-xs text-gray-600">Date</p> */}
                                    <p style={{ fontSize: "8px" }} className="text-xs text-gray-300">Date printed on :{formattedDate}</p>
                                </div>
                            </div>
                            <div className="flex justify-center absolute top-0 left-1">
                                <img src={APP_PATH + "images/2.png"} className="w-14 h-14 rounded-full" alt="" />


                            </div>
                            <div className="flex justify-center items-center">
                                <div className="text-center">
                                    <img src={APP_PATH + "images/signature.png"} className="w-12 h-12 rounded-full" alt="" />
                                    <p className="text-xs text-gray-800">Signature</p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Certficate