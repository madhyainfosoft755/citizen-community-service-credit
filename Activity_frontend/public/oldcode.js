// Here is start Login olg code 

// import React, { useEffect, useState } from 'react'
// import './Login.css'
// import { LoginApi } from 'Services'
// import GoogleButton from 'react-google-button'
// // import { RiGoogleFill } from "react-icons/ri";

// // import { FaFacebookF } from "react-icons/fa6";

// import { useNavigate } from "react-router-dom";
// import { API_URL } from '../../Constant';
// import { GoogleLogin } from '@react-oauth/google';
// import Googlelogin from 'pages/GoogleLogin/Googlelogin'
// // import Facebook from './Components/Atom/Facebook'
// // import Location from '../Location'
// import { Button, Img, Input, Line, Text } from "components";
// import Facebook from 'pages/Facebook/Facebook'



// function Login() {





//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   // const { authenticated, setAuthenticated } = useAuth();
//   const navigate = useNavigate();
//   const [loginAttempted, setLoginAttempted] = useState(false);
//   const [loginSuccess, setLoginSuccess] = useState(false);
//   const [currentDate, setCurrentDate] = useState('');



//   useEffect(() => {
//     // Function to get and format the current date
//     const getCurrentDate = () => {
//       const dateObj = new Date();
//       const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString('default', { month: 'short' })
//         } ${dateObj.getFullYear()}`;
//       setCurrentDate(formattedDate);
//     };

//     // Call the function when the component mounts
//     getCurrentDate();
//   }, []);

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };





//   const handleSubmit = async (event) => {
//     event.preventDefault();


//     try {
//       const response = await fetch(
//         `${API_URL}/activity/login`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formData),


//         }


//       );
//       console.log(response, "response")


//       if (!response.ok) {
//         setLoginAttempted(true);
//         console.log("Invalid Credentials");
//         return;
//       }

//       const data = await response.json();
//       const { token, userKey } = data;



//       if (token && userKey) {
//         localStorage.setItem("token", token);
//         localStorage.setItem("userKey", JSON.stringify(userKey));
//         // setLoginSuccess(true);
//         // setAuthenticated(true);


//         navigate("/create");
//         // navigate("/Post");


//       } else {
//         console.log("Response is missing");
//       }
//     } catch (error) {
//       console.error("Error:", error);


//     }
//   };
//   const onLocationChange = () => {

//   }


//   return (
//     <>

//       <div class="login_form_wrapper" style={{background:"transparent",display:"grid" ,justifyContent:"center"}}>
//         <svg className='login-svg' xmlns="http://www.w3.org/2000/svg" width="172" height="207" viewBox="0 0 172 207" fill="none">
//           <circle opacity="0.06" cx="119" cy="88" r="119" fill="#546EF6" />
//         </svg>
//         <div class="container" >
//           <div class="row justify-content-center"><h2>Welcome Back!</h2>
//             <h5>Login to your account</h5>
//             <div class="col-md-8 col-lg-5 d-flex justify-content-center" >

//               {/* <!-- login_wrapper --> */}
//               <div class="login_wrapper">
//                 <div class="row">


//                 </div>

//                 <div class="formsix-pos">
//                   <div class="form-group i-email">
//                     <input type="email" class="form-control" required="" id="email2" placeholder="Email Address *" name='email' value={formData.email}
//                       onChange={handleInputChange} />
//                   </div>
//                 </div>
//                 <div class="formsix-e">
//                   <div class="form-group i-password">
//                     <input type="password" class="form-control" required="" id="password2" placeholder="Password *" name='password' value={formData.password}
//                       onChange={handleInputChange} />
//                   </div>
//                 </div>
//                 <div class="login_remember_box">
//                   <label class="control control--checkbox">Remember me
//                     <input type="checkbox" />
//                     <span class="control__indicator"></span>
//                   </label>
//                 </div>
//                 <div class="login_btn_wrapper" >
//                   <a href="#" class="btn btn-primary login_btn" onClick={handleSubmit}  > Login </a>
//                 </div>

//                 <h2>or</h2>

//                 <div class="col-12" >
//                   {/* <a href="#" class="btn btn-primary facebook text-center"> <svg className='googleLogo' xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
//                     <circle cx="17.5" cy="17.5" r="17.5" fill="white" />
//                   <path d="M18.6667 18.9524H21.0476L22 15.1429H18.6667V13.2381C18.6667 12.2571 18.6667 11.3333 20.5714 11.3333H22V8.13333C21.6895 8.09238 20.5171 8 19.279 8C16.6933 8 14.8571 9.57809 14.8571 12.4762V15.1429H12V18.9524H14.8571V27.0476H18.6667V18.9524Z" fill="#1877F2" /> */}

//                   {/* </svg>  */}
//                   <span className=''>Facebook</span>  

//                 </div>
//                 <div className="flex flex-col items-center justify-start mt-[17px] w-full">
//               <div className="bg-red-500 flex flex-row gap-[51px] items-center justify-start p-[5px] rounded-[22px] w-full">
//                 <div className="bg-white-A700 flex flex-col h-[35px] items-center justify-start p-[9px] rounded-[17px] w-[35px]">
//                   <Img
//                     className="h-4 w-4"
//                     src="images/img_vector.svg"
//                     alt="vector"
//                   />
//                 </div>
//                 <div className="flex flex-col items-center justify-start">
//                   <Text
//                     className="text-base text-white-A700"
//                     size="txtInterSemiBold16"
//                   >
//                         <Googlelogin/>
//                         {/* <Facebook/> */}

//                   </Text>
//                 </div>
//               </div>
//             </div>
//                 <div class="login_message">
//                   <h4>_________ OR_________ </h4>
//                   <div class="col-12">
//                     <a href="/register" class="btn btn-primary facebook text-center">  <span>Register As New User</span>  </a>

//                   </div>
//                   <div className="row">

// {/* 
//                     <div className="col-6" >
//                       <div className='Category'><Location onLocationChange={onLocationChange} /> </div>


//                     </div> */}

//                     <div className="col-6">
//                       <div className="Category">{currentDate}</div>
//                     </div>
//                   </div>
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default Login


// login code end here 
