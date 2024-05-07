import React, { useEffect, useState } from "react";
import { Button, Img, Input, Line, Text } from "components";
// import MyGoogle from 'components/googlelogin/Googlelogin'
// import Googlelogin from "pages/GoogleLogin/Googlelogin";
import { API_URL } from "Constant";
import { useNavigate } from "react-router-dom";
import Location from "pages/Location/Location";
import axios from "axios";
// import { GoogleLogin } from "react-google-login";
import { useGoogleLogin } from "@react-oauth/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEye, faLock } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';



const DesktopOnePage = () => {
  const [locationData, setLocationData] = useState({
    city: "",
    state: "",
  });
  const handlebuttonclick = () => {
    navigate("/register");
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loginAttempted, setLoginAttempted] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const notify = (e) => toast(e);
  const [isEmailVerified, setIsEmailVerified] = useState(true); // Initially assuming email is verified
  const [showResendButton, setShowResendButton] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  

  useEffect(() => {
    // Function to get and format the current date
    const getCurrentDate = () => {
      const dateObj = new Date();
      const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString(
        "default",
        { month: "short" }
      )} ${dateObj.getFullYear()}`;
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

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.email) {
      errors.email = "Email is required";
      isValid = false;
    }

    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };
  const [emailvalue, setEmailvalue] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formsDATA = new FormData();
    const emailValue = event.target[0].value;
    setEmailvalue(emailValue)
    const passwordValue = event.target[1].value;
    formsDATA.append("email", emailValue);
    // console.log(emailValue, passwordValue);

    // Clear any previous error message
    setError("");

    // Check if email or password is empty
    if (!emailValue && !passwordValue) {
      setError("Please fill in both email and password fields.");
      notify(error)
      return;
    }

    formsDATA.append("password", passwordValue);
    // console.log("from-data", formsDATA);

    // for (var pair of formsDATA.entries()) {
    //   // console.log(pair[0] + ", " + pair[1]);
    // }

    try {
      const response = await fetch(`${API_URL}/activity/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formsDATA).toString(),
      });

      const data = await response.json();

      console.log("kya response aa rha hai", data);

      if (!response.ok) {
        setLoginAttempted(true);
        if (data.error === 'Email is not verified. Please verify your email.') {
          setIsEmailVerified(false);
          setShowResendButton(true)
      }
        setError("Email Not Verified");
        console.log(error);
        setValidationErrors({ email: "Invalid credentials", password: "" });
        // notify(validationErrors)
        notify(data.error)
        return;
      }

      // console.log("first page se ye data aa rha hai", data);
      const { token, userKey } = data;
      const redirectTo = data.redirectTo; // Define redirectTo variable

      if (token && userKey) {
        localStorage.setItem("token", token);
        localStorage.setItem("userKey", JSON.stringify(userKey));
        // setLoginSuccess(true);
        // setAuthenticated(true);
        if (redirectTo === "/admin") {
          navigate(redirectTo);
        } else {
          navigate("/create");
        }
        notify("Login Successful")
      } else {
        console.log("Response is missing");
        notify("response is missing")
      }
    } catch (error) {
      setError("An error occurred while logging in. Please try again.");
      console.error("Error:", error);
      notify(error)
    }
  };

  const handleLocationChange = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );

      if (response.data && response.data.address) {
        const { city, state } = response.data.address;
        setLocationData({ city, state });
      } else {
        console.error("Error fetching location data");
        notify("Error fetching location data")
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      responseGoogle(tokenResponse);
    },
  });

  //code to get the details from an access token
  // async function getUserProfile(accessToken) {
  //   try {
  //     const response = await axios.get(
  //       "https://www.googleapis.com/userinfo/v2/me",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );

  //     // Extract user profile from response data
  //     const userProfile = response.data;
  //     console.log("this is users profile data", userProfile);
  //     return userProfile;
  //   } catch (error) {
  //     console.error(
  //       "Failed to fetch user profile:",
  //       error.response ? error.response.data : error.message
  //     );
  //     throw error;
  //   }
  // }

  const responseGoogle = async (response) => {
    console.log("ye rha google ka response", response);
    try {
      const { access_token } = response;
      // console.log("kya humko token mila", access_token)
      // await getUserProfile(access_token)

      if (!access_token) {
        console.log("bhaiya token nhi mil rha hai ");
      }
      const formData = new FormData();
      // console.log("aur ye hai formdata", formData)
      formData.append("token", access_token);

      const loginResponse = await fetch(`${API_URL}/activity/GoogleLogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData).toString(),
      });

      if (!loginResponse.ok) {
        setError("Google login failed.");
        notify("Google login failed.")
        return;
      }

      const data = await loginResponse.json();
      console.log("google data response", data);
      const { token, user } = data;

      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("userKey", JSON.stringify(user));
        navigate("/create");
        notify("Login Successful")
      } else {
        console.log("Response is missing");
      }
    } catch (error) {
      setError("An error occurred while logging in with Google.");
      console.error("Error:", error);
    }
  };

  const Forget = () => {
    navigate("/forget");
  };


  const handleResendVerification = async () => {
    try {
        // Send a request to your backend to resend verification email
        const response = await fetch(`${API_URL}/activity/resendVerification`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: emailvalue }),
          });
          const data = await response.json();
          notify(data.message); // Show a notification based on the response
    } catch (error) {
        console.error("Error resending verification:", error);
        notify("An error occurred while resending verification.");
    }
    finally{
      setShowResendButton(false)
    }
};

  return (
    <div className="w-screen h-screen flex items-center justify-center pt-5 pb-5 ">
      {/* <ToastContainer /> */}
      <form
        onSubmit={handleSubmit}
        className="w-1/4 h-full sm:w-screen sm:h-screen md:w-2/4 md:h-screen  lg:w-3/4 lg:h-3/4 flex flex-col items-center justify-center  shadow-bs2 shadow-black-900"
      >
        <div className="hidden">
          <Location onLocationChange={handleLocationChange} />
        </div>
        <div
          className="w-full h-full flex flex-col justify-center items-center pt-2 sm:pt-10 sm:w-screen sm:h-screen overflow-hidden  bg-cover bg-center "
          style={{ backgroundImage: 'url("./images/img_helping.jpg")' }}
        >
          <Text className="text-2xl text-white-A700 font-extrabold">
            Welcome
          </Text>
          <Text className="mt-5 mb-5 font-semibold text-white-A700 ">
            Login to your account
          </Text>

          <div className="bg-white-A700 p-2 rounded-3xl w-3/4 relative flex items-center">
            <div className="absolute left-2">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="outline-none border-0 ml-2 w-full "
              required
            />
            
          </div>
          {showResendButton && (  
        <button
            type="button"
            className="bg-blue-500 text-white px-3 py-1 rounded-md mt-2 ml-2"
            onClick={handleResendVerification}
        >
            Send Verification Mail Again
        </button>
    )}
          <div className="bg-white-A700 p-2 rounded-3xl w-3/4 mt-8 relative flex items-center">
            <div className="absolute left-2">
              <FontAwesomeIcon icon={faLock} />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="outline-none border-0 ml-3 w-full"
              required
            />
            <FontAwesomeIcon icon={faEye}  />
          </div>

          {/* <Input
            name="email"
            placeholder="Email"
            className="p-0 placeholder:text-gray-600 ml-2 w-full "
            wrapClassName="border border-indigo-500_19 border-solid bottom-[0] flex left-[0] rounded-[25px] w-[80%]"
            type="email"
            prefix={
              <div className="sm:w-5 sm:h-5 sm:mx-0 sm:mt-2   ">
                <Img
                  className="absolute my-auto"
                  src="images/img_vector_gray_600.svg"
                  alt="Vector"
                />
              </div>
            }
            color="white_A700"
          /> */}
          {/* 
          <Input
            name="password"
            placeholder="Password"
            type="password"
            className="p-0 placeholder:text-gray-600 ml-2 w-full "
            wrapClassName="border border-indigo-500_19 border-solid flex mt-5 rounded-[25px] w-[80%]"
            prefix={
              <div className="sm:w-5 sm:h-5 sm:mx-0 sm:mt-2   ">
                <svg
                  xmlns="https://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-key"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8m4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5" />
                  <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                </svg>
              </div>
            }
            color="white_A700"
          ></Input> */}

          <Button
            type="submit"
            className="cursor-pointer font-semibold w-[200px] mt-[30px] text-base text-center rounded-[22px] "
            shape="round"
            color="indigo_A200"
          >
            Login
          </Button>
          {/* {error && <Text className="text-red-600 mt-2">{error}</Text>} */}

          <h2 className="mt-5 underline text-white-A700" onClick={Forget}>
            Forgot Password
          </h2>

          <div className="flex  items-center justify-center mt-5 gap-2">
            <div className="flex  items-center justify-between ">
              <div className="bg-blue-A400 text-center flex flex-row gap-11 items-center justify-start p-[5px] rounded-[22px] w-full">
                <div className="bg-white-A700 flex flex-col h-[35px] items-center justify-end p-[7px] rounded-[17px] w-[35px]">
                  <Img
                    className="h-[19px]"
                    src="images/img_facebook.svg"
                    alt="facebook"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-start   cursor-pointer  ">
              <div
                onClick={login}
                className="bg-red-500 flex items-center  justify-start p-[5px] rounded-[22px] w-full cursor-pointer "
              >
                <div className="bg-white-A700 flex flex-col h-[35px] items-center justify-start p-[9px] rounded-[17px] w-[35px] cursor-pointer ">
                  <Img
                    className="h-4 w-4 cursor-pointer "
                    src="images/img_vector.svg"
                    alt="vector"
                  />
                </div>
              </div>
            </div>
            <div className="flex  items-center justify-between ">
              <div className="bg-[#1da1f2] text-center flex flex-row gap-11 items-center justify-start p-[5px] rounded-[22px] w-full">
                <div className="bg-white-A700 flex flex-col h-[35px] items-center justify-end p-[7px] rounded-[17px] w-[35px]">
                  <Img
                    className="h-[40px]"
                    src="images/img_twitter.svg"
                    alt="twitter"
                  />
                </div>
              </div>
            </div>
            <div className="flex  items-center justify-between ">
              <div className="bg-[#cd3e78] text-center flex flex-row gap-11 items-center justify-start p-[5px] rounded-[22px] w-full">
                <div className="bg-white-A700 flex flex-col h-[35px] items-center justify-end p-[7px] rounded-[17px] w-[35px]">
                  <Img
                    className="h-[40px]"
                    src="images/img_instagram.svg"
                    alt="instagram"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-3.5 items-start justify-between mt-5 sm:mt-[25px] w-full">
            <Line className="bg-white-A700 h-px my-2 w-2/5" />
            <Text
              className="text-[15px] text-white-A700"
              size="txtInterRegular15Black90087"
            >
              Or
            </Text>
            <Line className="bg-white-A700 h-px  my-2 w-2/5" />
          </div>
          <div className="flex flex-col items-center justify-center mt-4 sm:mt-[25px]  w-full">
            <button
              name="registermessage"
              className="font-semibold leading-[normal] bg-white-A700/40 text-white-A700 w-5/6 h-10 rounded-lg  text-center border-[1px] border-black-900_99 "
              onClick={handlebuttonclick}
            >
              Register As New User
            </button>
          </div>
          <div className="flex justify-between items-center gap-5 mt-4 sm:mt-10">
            <Button
              className="cursor-pointer flex items-center justify-center min-w-[145px]"
              leftIcon={
                <div className="mb-[3px] mr-[9px] h-4 w-4 ">
                  <Img src="images/img_location.svg" alt="location icon" />
                </div>
              }
              shape="round"
              color="blue_50"
            >
              <div className="font-medium leading-[normal] text-[15px] text-left ">
                {locationData.city}, {locationData.state}
              </div>
            </Button>

            <Button
              type="button"
              className="cursor-pointer flex items-center justify-center min-w-[170px]"
              leftIcon={
                <div className="h-4 mb-[3px] mr-2.5 w-4 ">
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
                {currentDate}
              </div>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DesktopOnePage;
