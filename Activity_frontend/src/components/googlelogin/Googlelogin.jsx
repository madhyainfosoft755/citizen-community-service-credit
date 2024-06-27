// import React, { useState } from 'react';
// import { useGoogleLogin } from '@react-oauth/google';
// // import { FaGoogle } from "react-icons/fa";
// import { LoginApi, getUserInfoFromGoogle } from 'Services'
// import { useNavigate } from "react-router-dom";
// import './google.css'

// function MyGoogle() {
//   const navigate = useNavigate();
//   const [loginAttempted, setLoginAttempted] = useState(false);

//   const handleLogin = async (access_token, userInfo) => {
//     try {
//       const userData = await LoginApi({ access_token, userInfo });
//       localStorage.setItem('token', userData.token);

//       // Navigate to the profile page
//       navigate('/profile');
//     } catch (error) {
//       // Handle login error
//       console.error('Login error:', error);
//     }
//   };

//   const login = useGoogleLogin({
//     onSuccess: async access_token => {
//       try {
//         const userInfo = await getUserInfoFromGoogle(access_token);
//         console.log(userInfo);
//         handleLogin(access_token, userInfo);
//         console.log(access_token);
//       } catch (error) {
//         // Handle user info retrieval error
//         console.error('User info retrieval error:', error);
//       }
//     },
//   });

//   return (
//     <>
//       <a className="btn btn-primary google-plus text-center" onClick={() => login()}>
//         {/* <FaGoogle /> */}
//         <svg className='googleLogo' xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
//           <circle cx="17.5" cy="17.5" r="17.5" fill="white" />
//           <path d="M9.86857 13.498C10.5478 12.1455 11.5897 11.0086 12.8779 10.2143C14.1661 9.41994 15.6498 8.99952 17.1633 9C19.3633 9 21.2114 9.80898 22.6245 11.1265L20.2841 13.4678C19.4376 12.6588 18.3616 12.2465 17.1633 12.2465C15.0367 12.2465 13.2367 13.6833 12.5959 15.6122C12.4327 16.102 12.3396 16.6245 12.3396 17.1633C12.3396 17.702 12.4327 18.2245 12.5959 18.7143C13.2376 20.6441 15.0367 22.08 17.1633 22.08C18.2612 22.08 19.1959 21.7902 19.9273 21.3004C20.3514 21.0212 20.7144 20.659 20.9945 20.2355C21.2745 19.8121 21.4658 19.3362 21.5567 18.8367H17.1633V15.6792H24.8514C24.9478 16.2131 25 16.7698 25 17.3486C25 19.8351 24.1102 21.9282 22.5657 23.3486C21.2155 24.5959 19.3673 25.3265 17.1633 25.3265C16.0911 25.327 15.0294 25.1161 14.0388 24.706C13.0482 24.2959 12.1481 23.6946 11.39 22.9365C10.6319 22.1784 10.0306 21.2783 9.62052 20.2877C9.21043 19.2971 8.99957 18.2354 9 17.1633C9 15.8457 9.3151 14.6 9.86857 13.498Z" fill="#EA4335" />
//         </svg>

//         <span className='mb-2'> Google</span>
//       </a>
//     </>
//   );
// }

// export default MyGoogle;
