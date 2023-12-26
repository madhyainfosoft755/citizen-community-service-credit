import React,{useEffect,useState} from "react";

import { Button, Img, Text } from "components";
import {API_URL} from 'Constant'
import { useNavigate } from "react-router-dom";
import { useAuth } from "components/AuthProvider/AuthProvider";

const DesktopFourPage = () => {

  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState(null);
  const { authenticated, setAuthenticated } = useAuth();
  const navigate = useNavigate();

  
  useEffect(() => {
    // Check if both token and user key are present in local storage
    const token = localStorage.getItem("token");
    const userKey = localStorage.getItem("userKey");

    if (!token || !userKey) {
      // Redirect to the login page if either token or user key is missing
      navigate("/login");
    }

    // You may also want to check the validity of the token here if needed

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures that this effect runs only once on mount

  const handleLogout = () => {
    // Clear authentication status, remove token and user key, and redirect to the login page
    setAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userKey");
    navigate("/login");
  }; 


  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = "123"; // Replace with the actual user ID or get it dynamically

        const response = await fetch(`${API_URL}/activity/posts/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUserPosts(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data.");
      }
    };

    fetchData();
  }, []);
  return (
    <>

{authenticated && (
      
      <div className="bg-white-A700 flex flex-col font-inter items-center justify-start mx-auto p-[75px] md:px-10 sm:px-5 w-full">
          <Button 
      className="cursor-pointer font-semibold leading-[normal] min-w-[90px]  my-[11px] text-[13px] text-center"
      shape="round"
      color="indigo_A200"
      onClick={handleLogout} // Add logout functionality
    >
      LOGOUT
    </Button>
        <div className="bg-white-A700 flex flex-col items-center justify-start mb-[138px] pb-[25px] md:px-5 rounded-[5px] shadow-bs2 w-[33%] md:w-full">
          <div className="flex flex-col items-center justify-start w-full">
        
            <div className="bg-gray-50 flex flex-row items-center justify-between p-7 sm:px-5 w-full">
              <div className="flex flex-row gap-4 items-center justify-center ml-[5px]">
                <Img
                  className="h-[58px] md:h-auto rounded-[50%] w-[58px]"
                  src="images/img_ellipse3.png"
                  alt="ellipseThree"
                />
                <div className="flex flex-col items-center justify-start w-3/5">
                  <div className="flex flex-col items-start justify-start w-full">
                    <Text
                      className="text-base text-gray-900"
                      size="txtInterSemiBold16Gray900"
                    >
                      Emma Janson
                    </Text>
                    <Text
                      className="mt-1 text-gray-900_b2 text-xs"
                      size="txtInterMedium12"
                    >
                      ID : 123456
                    </Text>
                  </div>
                </div>
              </div>
              <Button
                className="cursor-pointer font-semibold leading-[normal] min-w-[90px] mr-1 my-[11px] text-[13px] text-center"
                shape="round"
                color="indigo_A200"
              >
                12.5 Hours
              </Button>
            
            </div>
            <Text
              className="mt-[22px] text-base text-gray-900"
              size="txtInterSemiBold16Gray900"
            >
              My Activities
            </Text>
            <div className="flex sm:flex-col flex-row gap-[25px] items-center justify-between mt-[13px] w-full">
              <div className="md:h-[306px] h-[307px] relative w-[82%] sm:w-full">
                <div className="absolute bg-white-A700_33 h-[90px] left-[10%] rounded-tl-[5px] rounded-tr-[5px] top-[0] w-[51%]"></div>
                <div className="absolute bg-white-A700 flex flex-col gap-[17px] h-max inset-y-[0] items-center justify-start my-auto pb-[15px] right-[0] rounded-[5px] shadow-bs4 w-[78%]">
                  <div className="flex flex-col items-center justify-start w-full">
                    <Img
                      className="h-36 md:h-auto object-cover w-full"
                      src="images/img_88cb2ef5c744839.png"
                      alt="88cb2ef5c744839"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-start w-[87%] md:w-full">
                    <div className="flex flex-col gap-3 items-start justify-start w-full">
                      <div className="flex flex-row items-center justify-between w-full">
                        <div className="flex flex-col items-start justify-start">
                          <Text
                            className="text-gray-800_7e text-xs"
                            size="txtInterMedium12Gray8007e"
                          > 
                            Activity{" "}
                          </Text>
                          <Text
                            className="mt-0.5 text-gray-800 text-sm"
                            size="txtInterSemiBold14"
                          >
                            Gardening
                          </Text>
                        </div>
                        <div className="flex flex-col items-start justify-start">
                          <Text
                            className="text-gray-800_7e text-xs"
                            size="txtInterMedium12Gray8007e"
                          >
                            Location
                          </Text>
                          <Text
                            className="mt-[3px] text-gray-800 text-sm"
                            size="txtInterSemiBold14"
                          >
                            Surat, Gujarat
                          </Text>
                        </div>
                      </div>
                      <div className="flex flex-row gap-24 items-center justify-start w-[83%] md:w-full">
                        <div className="flex flex-col items-start justify-start w-[35px]">
                          <Text
                            className="text-gray-800_7e text-xs"
                            size="txtInterMedium12Gray8007e"
                          >
                            Hours
                          </Text>
                          <Text
                            className="mt-0.5 text-gray-800 text-sm"
                            size="txtInterSemiBold14"
                          >
                            2
                          </Text>
                        </div>
                        <div className="flex flex-col items-start justify-start">
                          <Text
                            className="text-gray-800_7e text-xs"
                            size="txtInterMedium12Gray8007e"
                          >
                            Endorsed
                          </Text>
                          <Text
                            className="mt-0.5 text-gray-800 text-sm"
                            size="txtInterSemiBold14"
                          >
                            No
                          </Text>
                        </div>
                      </div>
                      <div className="flex flex-row gap-[75px] items-center justify-start w-[77%] md:w-full">
                        <div className="flex flex-col items-start justify-start">
                          <Text
                            className="text-gray-800_7e text-xs"
                            size="txtInterMedium12Gray8007e"
                          >
                            Approved
                          </Text>
                          <Text
                            className="text-gray-800 text-sm"
                            size="txtInterSemiBold14"
                          >
                            No
                          </Text>
                        </div>
                        <div className="flex flex-col items-start justify-start">
                          <Text
                            className="text-gray-800_7e text-xs"
                            size="txtInterMedium12Gray8007e"
                          >
                            Images
                          </Text>
                          <Text
                            className="mt-1 text-indigo-A200 text-xs underline"
                            size="txtInterSemiBold12"
                          >
                            View
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-[0] left-[0] my-auto overflow-x-auto w-[16%]">
                  <div className="h-[306px] relative w-full">
                    <div className="bg-white-A700 h-[306px] my-auto rounded-[5px] shadow-bs4 w-full"></div>
                    <div className="absolute flex flex-col items-center justify-start left-[0] top-[0] w-full">
                      <Img
                        className="h-36 md:h-auto object-cover w-full"
                        src="images/img_88cb2ef5c744839.png"
                        alt="88cb2ef5c744839_One"
                      />
                    </div>
                    <div className="absolute bottom-[36%] flex flex-col items-center justify-start left-[0] w-[70%]">
                      <div className="flex flex-col items-center justify-start w-full">
                        <Text
                          className="text-gray-800 text-sm"
                          size="txtInterSemiBold14"
                        >
                          Surat, Gujarat
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto w-[13%]">
                <div className="h-[306px] relative w-full">
                  <div className="bg-white-A700 h-[306px] ml-auto my-auto rounded-[5px] shadow-bs4 w-full"></div>
                  <div className="absolute flex flex-col items-center justify-start right-[0] top-[0] w-full">
                    <Img
                      className="h-36 md:h-auto object-cover w-full"
                      src="images/img_88cb2ef5c744839.png"
                      alt="88cb2ef5c744839_Two"
                    />
                  </div>
                  <div className="absolute bottom-[5%] flex flex-col items-center justify-start right-[0] w-[64%]">
                    <div className="flex flex-col items-center justify-start w-[33px] md:w-full">
                      <Text
                        className="text-gray-800_7e text-xs"
                        size="txtInterMedium12Gray8007e"
                      >
                        Activity{" "}
                      </Text>
                      <Text
                        className="mt-0.5 text-gray-800 text-sm"
                        size="txtInterSemiBold14"
                      >
                        Gardening
                      </Text>
                    </div>
                    <div className="flex flex-col items-start justify-start mt-[11px] w-[33px] md:w-full">
                      <Text
                        className="text-gray-800_7e text-xs"
                        size="txtInterMedium12Gray8007e"
                      >
                        Hours
                      </Text>
                      <Text
                        className="mt-0.5 text-gray-800 text-sm"
                        size="txtInterSemiBold14"
                      >
                        2
                      </Text>
                    </div>
                    <div className="flex flex-col h-[33px] items-start justify-start mt-3.5 w-[33px]">
                      <Text
                        className="text-gray-800_7e text-xs"
                        size="txtInterMedium12Gray8007e"
                      >
                        Approved
                      </Text>
                      <Text
                        className="text-gray-800 text-sm"
                        size="txtInterSemiBold14"
                      >
                        No
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-[31px] items-center justify-between mt-[22px] w-[85%] md:w-full">
              <Text
                className="text-base text-gray-900"
                size="txtInterSemiBold16Gray900"
              >
                Activities Waiting for Endorsement
              </Text>
              <Text
                className="text-[11px] text-indigo-A200"
                size="txtInterSemiBold11"
              >
                Select All
              </Text>
            </div>
            <div className="bg-white-A700 flex flex-col items-center justify-start mt-[15px] p-1.5 rounded-[5px] shadow-bs4 w-[85%] md:w-full">
              <div className="flex flex-col gap-3.5 items-start justify-start mb-[9px] mt-[5px] w-[97%] md:w-full">
                <div className="flex flex-row gap-[62px] items-center justify-start w-[94%] md:w-full">
                  <div className="flex flex-col items-start justify-start">
                    <Text
                      className="text-gray-800_7e text-xs"
                      size="txtInterMedium12Gray8007e"
                    >
                      CService ID
                    </Text>
                    <Text
                      className="mt-[3px] text-gray-800 text-sm"
                      size="txtInterSemiBold14"
                    >
                      Gardening
                    </Text>
                  </div>
                  <div className="flex flex-col items-start justify-start">
                    <Text
                      className="text-gray-800_7e text-xs"
                      size="txtInterMedium12Gray8007e"
                    >
                      Name
                    </Text>
                    <Text
                      className="mt-[3px] text-gray-800 text-sm"
                      size="txtInterSemiBold14"
                    >
                      Roger Milla
                    </Text>
                  </div>
                  <div className="flex flex-col items-start justify-start w-[35px]">
                    <Text
                      className="text-gray-800_7e text-xs"
                      size="txtInterMedium12Gray8007e"
                    >
                      Hours
                    </Text>
                    <Text
                      className="mt-0.5 text-gray-800 text-sm"
                      size="txtInterSemiBold14"
                    >
                      2
                    </Text>
                  </div>
                </div>
                <div className="flex flex-row items-start justify-between w-full">
                  <div className="flex flex-col items-start justify-start">
                    <Text
                      className="text-gray-800_7e text-xs"
                      size="txtInterMedium12Gray8007e"
                    >
                      Images
                    </Text>
                    <Text
                      className="mt-[3px] text-indigo-A200 text-xs underline"
                      size="txtInterSemiBold12"
                    >
                      View
                    </Text>
                  </div>
                  <div className="flex flex-col items-start justify-start">
                    <Text
                      className="text-gray-800_7e text-xs"
                      size="txtInterMedium12Gray8007e"
                    >
                      Location
                    </Text>
                    <Text
                      className="mt-0.5 text-gray-800 text-sm"
                      size="txtInterSemiBold14"
                    >
                      Delhi
                    </Text>
                  </div>
                  <div className="flex flex-col items-start justify-start w-[17%]">
                    <div className="flex flex-col items-center justify-start w-full">
                      <Text
                        className="text-gray-800_7e text-xs"
                        size="txtInterMedium12Gray8007e"
                      >
                        Endorsed
                      </Text>
                    </div>
                    <div className="bg-indigo-A200_33 border border-indigo-A200 border-solid h-[15px] mt-[3px] rounded-[3px] w-[15px]"></div>
                  </div>
                </div>
              </div>
            </div>
            <Button
              className="cursor-pointer font-semibold min-w-[350px] mt-[21px] text-base text-center"
              shape="round"
              color="indigo_A200"
            >
              SUBMIT
            </Button>
          </div>
        
        </div>
      </div>
    
    )}
    </>
   
  );
};

export default DesktopFourPage;
