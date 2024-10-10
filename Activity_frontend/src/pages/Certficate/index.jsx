import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { API_URL, APP_PATH } from "Constant";
import { toast } from "react-toastify";
import { convertToHours, convertToHoursWithoutPoints } from "utils";
import { Button } from "components";
const Certficate = ({ setIsPopupVisible }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const pdfRef = useRef();

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const printDocument = () => {
    const input = "data";
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "JPEG", 0, 0);
      // pdf.output('dataurlnewwindow');
      pdf.save("Certificate.pdf");
    });
  };
  // const generatePDF = async () => {
  //     const element = pdfRef.current;
  //     element.style.display = 'block';
  //     const canvas = await html2canvas(element, {
  //         scale: 1.5, // Increase the scale for better quality
  //         useCORS: true, // Enable cross-origin resource sharing if you have images from other domains
  //         scrollX: 1,
  //         scrollY: 1,
  //         windowWidth: element.scrollWidth, // Set window width to the element's scroll width
  //         windowHeight: element.scrollHeight, // Set window height to the element's scroll height
  //     });

  //     const imgData = canvas.toDataURL('image/png');
  //     const pdf = new jsPDF({
  //         orientation: 'portrait',
  //         unit: 'px',
  //         format: [canvas.width, canvas.height], // Set format to match canvas dimensions
  //     });

  //     const imgProps = pdf.getImageProperties(imgData);
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //     pdf.save('Certificate.pdf');
  //     element.style.display = 'none';

  // };

  const generatePDF = async () => {
    const element = pdfRef.current;
    element.style.display = "block";

    // A4 dimensions in mm
    const a4Width = 297;
    const a4Height = 210;

    const canvas = await html2canvas(element, {
      scale: 2, // Increase scale for better quality
      useCORS: true,
      width: a4Width * 3.78, // Convert mm to pixels (1mm ≈ 3.78px)
      height: a4Height * 3.78,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    pdf.addImage(imgData, "PNG", 0, 0, a4Width, a4Height);
    pdf.save("Certificate.pdf");
    element.style.display = "none";
  };

  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState();
  const [totalTime, setTotalTime] = useState();
  const [categoryList, setCategoryList] = useState();
  const [orgDetails, setOrgDetails] = useState();
  const [error, setError] = useState();
  const [formattedDate, setFormattedDate] = useState();
  const navigate = useNavigate();
  const notify = (e) => toast(e);

  useEffect(() => {
    const today = new Date();

    // Get the date components
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(today.getDate()).padStart(2, "0");

    // Format the date as YYYY-MM-DD
    setFormattedDate(`${year}-${month}-${day}`);
  }, []);
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
          // console.log(userData, "user data");
          setUserName(userData && userData.userData.name);
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
          "Content-Type": "application/json",
        },
      });
      // console.log("ye rha response", response)

      if (!response.ok) {
        // Token might be expired or invalid, so log the user out
        // handleLogout();
        navigate("/login");
        notify("Session time Out");
      }
    } catch (error) {
      notify(error);
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
          const response = await fetch(
            `${API_URL}/activity/TotalTimeSpent/${userData.userData.id}`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const data = await response.json();
          if (response.ok) {
            setTotalTime(data.totalTimeSum);
          }
        }
      } catch (error) {
        console.error("Error fetching user total time", error);
        setError("An error occurred while fetching users Time.");
      }
    };
    totalTimeSpent();
  }, [userData]);

  useEffect(() => {
    const getAllPostedCategories = async (userId) => {
      try {
        if (userData && userData.userData) {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `${API_URL}/activity/getAllPostedCategories/${userData.userData.id}`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const data = await response.json();
          // console.log("data mai kya aa rha hai", data);
          if (response.ok) {
            setCategoryList([...new Set(data.categoriesArray)]);
          }
        }
      } catch (error) {
        console.error("Error fetching user total time", error);
        setError("An error occurred while fetching users Time.");
      }
    };

    const fetchOrgOfUser = async () => {
      try {
        if (userData && userData.userData) {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `${API_URL}/activity/getOrgDetails/${userData.userData.organization}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const data = await response.json();
          if (response.ok) {
            setOrgDetails(data.orgDetails[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching user total time", error);
        setError("An error occurred while fetching users Time.");
      }
    };
    fetchOrgOfUser();
    getAllPostedCategories();
  }, [userData]);

  return (
    <div className="opacity-1 " style={{ background: "#ffffff" }}>
      <div>
        <div className="mb-5 flex justify-center">
          <Button
            className="cursor-pointer font-semibold rounded-md"
            // shape="round"
            color="indigo_A200"
            onClick={generatePDF}
          >
            Download
          </Button>
          &nbsp; &nbsp; &nbsp;
          {/* <button className=" rounded-sm bg-blue-600" onClick={printDocument}>Print</button> */}
          {setIsPopupVisible && (
            <Button
              className="cursor-pointer font-semibold rounded-md "
              // shape="round"
              color="indigo_A200"
              onClick={() => setIsPopupVisible(false)}
            >
              Close
            </Button>
          )}
        </div>
        <div
          className="flex w-full flex-col items-center justify-start "
          style={{ background: "#ffffff" }}
        >
          {/* //CCH Management and Administration */}

          <div className="w-screen h-full flex  justify-center  bg-white ">
            <div
              className="bg-white border border-gray-300 p-6 shadow-lg relative rounded-md"
              style={{
                width: "80%", // Adjust width as needed
                maxWidth: "800px", // Limit maximum width for larger screens
                padding: "5%", // Adjust padding for inner content
                boxSizing: "border-box",
                marginBottom: "2rem",
              }}
            >
              <div className="text-center mb-4 mt-28">
                <h1 className="text-3xl font-bold text-blue-600">
                  Certificate of Achievement
                </h1>
                <p className="text-lg text-gray-800 mt-2">
                  This is to certify that
                </p>
              </div>
              <div className="mb-6">
                <p className="text-lg text-gray-800 mt-2 ">
                  <span className="font-bold">
                    Mr / Ms{" "}
                    <span className="uppercase">
                      {userData && userData.userData.name}{" "}
                    </span>
                  </span>{" "}
                  has successfully spent{" "}
                  <span className="font-bold">
                    {totalTime && convertToHoursWithoutPoints(totalTime)} hours
                  </span>{" "}
                  in the &nbsp;
                  {categoryList &&
                    categoryList.map((value, index) => {
                      return (
                        <span className="font-bold" key={index}>
                          {value}
                          {index < categoryList.length - 1 ? ", " : " "}
                        </span>
                      );
                    })}
                  {categoryList?.length > 1 ? "activities" : "activity"}{" "}
                </p>
              </div>
              <div>
                <p className="text-lg">
                  We sincerely thank him/her for his/her time and contribution
                  to the Community service-related activities and wish him/her
                  all the success and happiness in his/her personal and
                  professional life.
                </p>
              </div>
              <div className="flex justify-center items-center absolute top-1 left-1">
                <img
                  src={`${APP_PATH}images/2.png`}
                  className="w-32 h-32 sm:w-28 sm:h-28 rounded-full"
                  alt="Logo"
                />
              </div>
              {orgDetails && orgDetails.logo && (
                <div className="flex justify-center items-center absolute top-4 right-1">
                  <img
                    src={`${API_URL}/image/${orgDetails && orgDetails.logo}`}
                    className="w-28 h-28 sm:w-28 sm:h-28 rounded-full"
                    alt="Logo"
                  />
                </div>
              )}
              <div className="text-center absolute top-4 right-2">
                <p style={{ fontSize: "12px" }} className="text-gray-300">
                  Date printed on: {formattedDate}
                </p>
              </div>
              <div className="flex justify-end items-center mt-8">
                <div className="text-center flex justify-center items-center flex-col">
                  <p className="text-sm text-blue-600 mt-2 font-semibold">
                    Kind Regards,
                  </p>
                  <img
                    src={`${APP_PATH}images/signature.png`}
                    className="w-24 rounded-full"
                    alt="Signature"
                  />
                  <p className="text-sm text-blue-600 font-semibold">
                    Signature
                  </p>
                  <p className="text-sm text-blue-600 mt-2 font-semibold">
                    CC247 Management{" "}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs mt-10 text-gray-700 italic">
                  This is an electronically generated certificate. The
                  activities are thoroughly reviewed and verified before
                  approval. The signature is not mandatory.
                </p>
              </div>
            </div>
          </div>

          <div
            ref={pdfRef}
            className="w-full  min-h-screen flex justify-center items-center bg-white"
            style={{ background: "#ffffff", display: "" }}
          >
            <div
              className="bg-white border border-gray-300  shadow-lg relative"
              style={{
                width: "297mm",
                height: "210mm",
                padding: "30mm",
                boxSizing: "border-box",
                background: "#ffffff",
              }}
            >
              <div className="flex flex-col justify-center items-center h-full">
                <div className="text-center mb-4 mt-5">
                  <h1 className="text-3xl font-bold text-blue-400">
                    Certificate of Achievement
                  </h1>
                  <p className="text-lg text-gray-800 mt-2">
                    This is to certify that
                  </p>
                </div>
                <div className="mb-6">
                  <p className="text-lg text-gray-800 align-baseline ">
                    <span className="font-bold text-lg">
                      Mr / Ms{" "}
                      <span className="uppercase text-lg">
                        {userData && userData.userData.name}{" "}
                      </span>{" "}
                    </span>{" "}
                    has successfully spent{" "}
                    <span className="font-bold text-lg">
                      {totalTime && convertToHoursWithoutPoints(totalTime)}{" "}
                      hours
                    </span>{" "}
                    in the &nbsp;
                    {categoryList &&
                      categoryList.map((value, index) => {
                        return (
                          <span className="font-bold text-lg" key={index}>
                            {value}
                            {index < categoryList.length - 1 ? ", " : " "}
                          </span>
                        );
                      })}
                    {categoryList?.length > 1 ? "activities" : "activity"}{" "}
                  </p>
                </div>
                <div>
                  <p className="text-lg">
                    We sincerely thank him/her for his/her time and contribution
                    to the Community service-related activities and wish him/her
                    all the success and happiness in his/her personal and
                    professional life.
                  </p>
                </div>

                <div className="flex justify-center items-center absolute top-1 left-1">
                  <img
                    src={`${APP_PATH}images/2.png`}
                    className="w-32 h-32 rounded-full"
                    alt="Logo"
                  />
                </div>
                {/* <div className="flex justify-center items-center absolute top-5 right-1">
                  <img
                    src={`${API_URL}/image/${orgDetails && orgDetails.logo}`}
                    className="w-28 h-28 sm:w-28 sm:h-28 rounded-full"
                    alt="Logo"
                  />
                </div> */}
                <div className="text-center absolute top-5 right-3">
                  <p style={{ fontSize: "12px" }} className="text-gray-300">
                    Date printed on: {formattedDate}
                  </p>
                </div>

                <div className="w-full flex justify-end items-center mt-8">
                  <div className="text-center flex justify-center items-center flex-col">
                    <p className="text-sm text-blue-300 mt-2 font-semibold ">
                      Kind Regards,
                    </p>

                    <img
                      src={`${APP_PATH}images/signature.png`}
                      className="w-24 rounded-full"
                      alt="Signature"
                    />
                    <p className="text-sm text-gray-800 font-semibold">
                      Signature
                    </p>
                    <p className="text-sm text-gray-800 mt-2 font-semibold">
                      CC247 Management{" "}
                    </p>
                    {/* <p className="text-sm text-gray-800 mt-2 font-semibold">and Administration</p> */}
                  </div>
                </div>
              </div>

              <div className="w-full  absolute bottom-5 left-0 flex justify-center items-center">
                <p className="text-xs  text-gray-700 italic">
                  This is an electronically generated certificate. The
                  activities are thoroughly reviewed and verified before
                  approval. The signature is not mandatory.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certficate;
