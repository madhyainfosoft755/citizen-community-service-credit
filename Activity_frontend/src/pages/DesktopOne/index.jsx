




import React, { useEffect, useState } from "react";

import { Button, Img, Input, Line, Text } from "components";
// import MyGoogle from 'components/googlelogin/Googlelogin'
import Googlelogin from 'pages/GoogleLogin/Googlelogin'

import { API_URL } from 'Constant'
import { useNavigate } from "react-router-dom";



const DesktopOnePage = () => {

 const handlebuttonclick=()=>
  {
    navigate("/register");
  }



  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // const { authenticated, setAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loginAttempted, setLoginAttempted] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [currentDate, setCurrentDate] = useState('');



  useEffect(() => {
    // Function to get and format the current date
    const getCurrentDate = () => {
      const dateObj = new Date();
      const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString('default', { month: 'short' })
        } ${dateObj.getFullYear()}`;
      setCurrentDate(formattedDate);
    };

    // Call the function when the component mounts
    getCurrentDate();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };





  const handleSubmit = async (event) => {
    event.preventDefault();
    

    const formsDATA = new FormData();

    const emailValue = event.target[0].value;
const passwordValue = event.target[1].value;
formsDATA.append('email', emailValue);
formsDATA.append('password', passwordValue);
    console.log("fromdataa" ,formsDATA)

    for (var pair of formsDATA.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
 

    try {
      const response = await fetch(
        `${API_URL}/activity/login`,
        {
        
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(formsDATA).toString(),
       }
      );
      


      if (!response.ok) {
        setLoginAttempted(true);
        console.log("Invalid Credentials");
        return;
      }

      const data = await response.json();
      const { token, userKey } = data;



      if (token && userKey) {
        localStorage.setItem("token", token);
        localStorage.setItem("userKey", JSON.stringify(userKey));
        // setLoginSuccess(true);
        // setAuthenticated(true);


        navigate("/create")
      


      } else {
        console.log("Response is missing");
      }
    } catch (error) {
      console.error("Error:", error);


    }
  };
 

  const onLocationChange = () => {

  }


  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="bg-white-A700 flex flex-col font-inter items-center justify-start mx-auto p-11 md:px-10 sm:px-5 w-full">
          <div className="bg-white-A700 flex flex-col justify-start mb-[200px] pb-6 pl-6 md:px-5 rounded-[5px] shadow-bs2 w-[31%] md:w-full">
            <div className="h-[207px] md:ml-[0] ml-[94px] relative w-[76%]">
              <div className="absolute bg-indigo-A200_5f h-[207px] inset-y-[0] my-auto right-[0] "></div>
              <Text
                className="absolute bottom-[8%] left-[0] text-2xl md:text-[22px] text-black-900 sm:text-xl"
                size="txtInterSemiBold24"
              >
                Welcome Back! 
              </Text>
            </div>
            <Text
              className="md:ml-[0] ml-[106px] mt-[5px] text-[15px] text-black-900_a2 mb-[14px] "
              size="txtInterRegular15"
            >
              Login to your account
            </Text>


            <Input
              name="email"
              placeholder="Email"
              className="p-0 placeholder:text-gray-600 text-[15px] text-left w-full"
              wrapClassName="border border-indigo-500_19 border-solid bottom-[0] flex left-[0] rounded-[25px] w-[89%]"
              type="email"
              
              prefix={
                <div className="mt-[3px] mb-0.5 mr-[18px] sm:w-full sm:mx-0 w-[5%]  right-[5%] reletive inset-y-[1%]">
                  <Img
                    className="absolute my-auto"
                    src="images/img_vector_gray_600.svg"
                    alt="Vector"
                  />
                </div>
              }
              color="white_A700"
              // onChange={(event) => handleInputChange(event)}
            ></Input>


            <Input
              name="password"
              placeholder="Password"
              className="p-0 placeholder:text-gray-600 text-[15px] text-left w-full"
              wrapClassName="border border-indigo-500_19 border-solid flex mt-5 rounded-[25px] w-[89%]"
              prefix={
                <div className="mt-px mb-[3px] mr-4 sm:w-full sm:mx-0 w-[6%] ">

                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-key" viewBox="0 0 16 16">
                    <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8m4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5" />
                    <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                  </svg>
                </div>
              }
              color="white_A700"
            //  onChange={(event) => handleInputChange(event)}
            ></Input>
             
                  <Button 
                  style={{marginLeft:"90px"}}
                  type="submit"
                className="cursor-pointer font-semibold w-[200px] mt-[30px] text-base text-center rounded-[22px] "
                shape="round"
                color="indigo_A200"
               
              >
                Login
              </Button>
  
                 

            <div className="flex flex-col items-center justify-start md:ml-[0] ml-[72px] mt-8 w-[58%] md:w-full">
              <div className="flex flex-col items-center justify-start w-full">
                <div className="bg-blue-A400 flex flex-row gap-11 items-center justify-start p-[5px] rounded-[22px] w-full">
                  <div className="bg-white-A700 flex flex-col h-[35px] items-center justify-end p-[7px] rounded-[17px] w-[35px]">
                    <Img
                      className="h-[19px]"
                      src="images/img_facebook.svg"
                      alt="facebook"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-start">
                    <Text
                      className="text-base text-white-A700"
                      size="txtInterSemiBold16"
                    >
                      Facebook
                    </Text>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-start mt-[17px] w-full cursor-pointer ">
                <div className="bg-red-500 flex flex-row gap-[51px] items-center justify-start p-[5px] rounded-[22px] w-full cursor-pointer ">
                  <div className="bg-white-A700 flex flex-col h-[35px] items-center justify-start p-[9px] rounded-[17px] w-[35px] cursor-pointer ">
                    <Img
                      className="h-4 w-4 cursor-pointer "
                      src="images/img_vector.svg"
                      alt="vector"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-start">
                    
                    <Googlelogin/> 

                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-3.5 items-start justify-between mt-[25px] w-full">
                <Line className="bg-black-900_87 h-px my-2 w-2/5" />
                <Text
                  className="text-[15px] text-black-900_87"
                  size="txtInterRegular15Black90087"
                >
                  Or
                </Text>
                <Line className="bg-black-900_87 h-px my-2 w-2/5" />
              </div>
              <div className="flex flex-col items-center justify-start mt-[25px] w-full">
                <Input
                  name="registermessage"
                  placeholder="Register As New User"
                  className="font-semibold leading-[normal] p-0 placeholder:text-white-A700 text-base text-center w-full"
                  wrapClassName="rounded-[22px] w-full"
                  color="indigo_A200"
                  size="sm"
                  onClick={handlebuttonclick} 
                ></Input>
              </div>
            </div>
            <div className="flex sm:flex-col flex-row gap-2.5 items-center justify-start ml-2 md:ml-[0] mr-8 mt-[186px] w-[90%] md:w-full">
              <Button
                className="cursor-pointer flex items-center justify-center min-w-[170px]"
                leftIcon={
                  <div className="mb-[3px] mr-[9px] bg-indigo-A200">
                    <Img src="images/img_linkedin.svg" alt="linkedin" />
                  </div>
                }
                shape="round"
                color="blue_50"
              >
                <div className="font-medium leading-[normal] text-[15px] text-left">

                  Surat, Gujarat
                </div>
              </Button>
              <Button
                className="cursor-pointer flex items-center justify-center min-w-[170px]"
                leftIcon={
                  <div className="h-4 mb-[3px] mr-2.5 w-4 bg-indigo-A200">
                    <Img
                      className="h-4"
                      src="images/img_calendar.svg"
                      alt="calendar"
                    />
                  </div>
                }
                shape="round"
                color="blue_50"
              >
                <div className="font-medium leading-[normal] text-[15px] text-left">
                  23 Aug 2023
                </div>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default DesktopOnePage;
