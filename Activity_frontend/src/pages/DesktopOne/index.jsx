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
import { faEnvelope, faEye, faLock, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { CirclesWithBar } from 'react-loader-spinner'
import { useAuth } from "components/AuthProvider/AuthProvider";



const DesktopOnePage = () => {
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const [locationData, setLocationData] = useState({
    city: "",
    state: "",
  });
  const handlebuttonclick = () => {
    navigate("/register");
  };

  const {setAuthenticated, setIsAdmin} = useAuth();
  
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
  const [eyeIcon, setEyeIcon] = useState(faEye);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setEyeIcon(showPassword ? faEye : faEyeSlash);
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
      setIsLoading(true)
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
      const { token, userKey ,role } = data;
      const redirectTo = data.redirectTo; // Define redirectTo variable

      if (token && userKey) {
        localStorage.setItem("token", token);
        localStorage.setItem("userKey", JSON.stringify(userKey));
        localStorage.setItem("role",role)
        // setLoginSuccess(true);
        setAuthenticated(true);
        if (role === "admin") {
          setIsAdmin(true);
          
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
    finally {
      setIsLoading(false); // Stop loader
    }
  };

  const handleLocationChange = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GoogleGeocode}`
      );


      if (response.data && response.data.results) {
        const addressComponents = response.data.results[0].address_components;
        const cityObj = addressComponents.find(component =>
          component.types.includes('locality')
        );
        const stateObj = addressComponents.find(component =>
          component.types.includes('administrative_area_level_1')
        );

        const city = cityObj ? cityObj.long_name : 'Unknown City';
        const state = stateObj ? stateObj.long_name : 'Unknown State';

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
    // console.log("ye rha google ka response", response);
    try {
      const { access_token } = response;
      console.log("kya humko token mila", access_token)
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
      
      const data = await loginResponse.json();
      console.log("google data response", data);

      if (!loginResponse) {
        setError("Google login failed.");
        notify("Google login failed.")
        return;
      }

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
    finally {
      setShowResendButton(false)
    }
  };

  return (
    <div className="w-screen h-screen sm:w-screen sm:h-screen flex items-center justify-center pt-5 pb-5 sm:p-0 ">
      {/* <ToastContainer /> */}
      <form
        onSubmit={handleSubmit}
        className="relative overflow-hidden w-4/12 h-full sm:w-full sm:h-full md:w-2/4 md:h-full  lg:w-3/4 lg:h-3/4 flex flex-col items-center justify-center sm:border-none border-[1px] rounded-lg p-2"
      >
        {isLoading&& (
          <div className="w-full h-full bg-black-900/30 absolute  inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <CirclesWithBar 
              height="100"
              width="100"
              color="#4fa94d"
              outerCircleColor="#546ef6"
              innerCircleColor="#ffffff"
              barColor="#ffffff"
              ariaLabel="circles-with-bar-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        )}
        <div className="w-64 h-64 bg-[#f5f6fe] absolute -top-10 -right-20 z-0 rounded-full "></div>
        <div className="hidden">
          <Location onLocationChange={handleLocationChange} />
        </div>
        <div
          className="relative w-full h-full flex flex-col justify-center items-center pt-2 sm:pt-10 sm:w-screen sm:h-screen overflow-hidden  bg-cover bg-center "
        // style={{ backgroundImage: 'url("./images/img_helping.jpg")' }}
        >
          <Text className="text-2xl text-black-900 -mt-3 font-extrabold">
            Welcome
          </Text>
          <Text className="mt-1 mb-3 font-semibold text-black-900  ">
            Login to your account
          </Text>

          <div className="bg-white-A700 px-2 border-[1px] rounded-3xl w-3/4 relative flex items-center">
            <div className="absolute left-2">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-500" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="outline-none text-sm border-0 ml-3 w-11/12 "
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
          <div className="bg-white-A700  px-2 border-[1px] rounded-3xl w-3/4 mt-2 relative flex items-center">
            <div className="absolute left-2">
              <FontAwesomeIcon icon={faLock} className="text-gray-500" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="outline-none text-sm border-0 ml-3 w-11/12 "
              required
            />
            <FontAwesomeIcon icon={eyeIcon} onClick={togglePasswordVisibility} className="text-gray-700" />
          </div>

          <Button
            type="submit"
            className="cursor-pointer font-semibold w-1/2 mt-4 text-sm text-center rounded-[22px] bg-[#546ef6] text-white-A700 "
            shape="round"
          // color="indigo_A200"
          >
            Login
          </Button>
          {/* {error && <Text className="text-red-600 mt-2">{error}</Text>} */}

          <h2 className="mt-2 underline text-black-900 text-sm cursor-pointer" onClick={Forget}>
            Forgot Password
          </h2>

          <div className="flex  items-center justify-center mt-5 gap-2 ">
            <div className="bg-blue-A400 [2px]ext-center flex flex-row gap-11 items-center justify-start p-[2px] rounded-[22px] w-full cursor-pointer">
              <div className="bg-white-A700 flex flex-col h-6 items-center justify-center p-2 rounded-[17px] w-6 ">
                <Img
                  className="h-[19px]"
                  src="images/img_facebook.svg"
                  alt="facebook"
                />
              </div>
            </div>
            <div
              onClick={login}
              className="bg-red-500 flex items-center  justify-center p-[2px] rounded-full w-full cursor-pointer "
            >
              <div className="bg-white-A700 flex flex-col h-6 w-6 items-center justify-center p-1 rounded-[16px]  cursor-pointer ">
                <Img
                  className="h-full w-full cursor-pointer "
                  src="images/img_vector.svg"
                  alt="vector"
                />
              </div>
            </div>
            <div className="bg-[#1da1f2] text-center flex items-center justify-center p-[2px] rounded-full w-full cursor-pointer">
              <div className="bg-white-A700 flex flex-col h-6 w-6 items-center justify-center p-[2px] rounded-full ">
                <Img
                  className="h-full w-full"
                  src="images/img_twitter.svg"
                  alt="twitter"
                />
              </div>
            </div>
            <div className="flex  items-center justify-between cursor-pointer">
              <div className="bg-[#cd3e78] text-center flex flex-row gap-11 items-center justify-start p-[2px] rounded-[22px] w-full">
                <div className="bg-white-A700 flex flex-col h-6 items-center justify-end p-[1px] rounded-[17px] w-6">
                  <Img
                    className="h-[40px]"
                    src="images/img_instagram.svg"
                    alt="instagram"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-3.5 items-start justify-between mt-1 sm:mt-[25px] w-full">
            <Line className="bg-black-900 h-px my-2 w-2/5" />
            <Text
              className="text-[15px] text-black-900"
              size="txtInterRegular15Black90087"
            >
              Or
            </Text>
            <Line className="bg-black-900 h-px   my-2 w-2/5" />
          </div>
          <div className="flex flex-col items-center justify-center mt-2 sm:mt-[25px]  w-full">
            <button
              name="registermessage"
              className="font-semibold leading-[normal] bg-[#546ef6] text-white-A700 w-1/2 h-10 rounded-3xl text-center text-sm "
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
              type="button"
            >
              <div className="font-medium leading-[normal] text-sm text-left ">
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
              <div className="font-medium leading-[normal] text-sm text-left">
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
