// import React, { useEffect, useState } from 'react';
// import FacebookLogin from 'react-facebook-login';
// // import { dashboard } from '../../../Facbookbackend/controllers/LoginController';
// import Loader from  './Loader'; 
// // import { useHistory, useNavigate } from 'react-router-dom';
// import ProfileDash from './ProfileDash'





// function GoogleLogin({ onLogin }) {
//   const [authenticated, setAuthenticated] = useState(false); 
//   const [loading, setLoading] = useState(true);
//   // const navigate =useNavigate()

  

//   useEffect(()=>{
//     setTimeout(()=>{
//       setLoading(false);

//     },2000);

//   },[])

//   const responseFacebook = async (response) => {
//     try {
//       const res = await fetch("http://localhost:4116/activity/responseFacebook", {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           accessToken: response.accessToken,
//           name: response.name,
//           id: response.id,
//         }),
//       });

//       if (!res.ok) {
//         throw new Error('Error saving Facebook data');
//       }

      
//       localStorage.setItem('facebookUserData', JSON.stringify({
//         Token: response.accessToken,
//         name: response.name,
//         id: response.id,
//       }));
//       setAuthenticated(true);
//       // navigate('/ProfileDash');
      
//     } catch (error) {
//       console.error('Error saving Facebook data:', error);
//     }
//   };

  

//   const handleLogout = () => {
//     // Clear stored data and set authentication status to false
//     localStorage.removeItem('facebookUserData');
//     setAuthenticated(false);
//     setLoading(true);
//     setLoading(false); 
    
//   };

//   const handleLoginClick = () => {
//     // Trigger the Facebook login process when this button is clicked
//     // This will invoke the FacebookLogin component's login dialog
//   };

//   return (
//     <div style={{ justifyContent: "center" }}>
//     {loading ? (
//       <Loader />
//     ) : authenticated ? (
//       <>
//         <button onClick={handleLogout}>Logout</button>
//         {/* {<ProfileDash/>} */}
//       </>
//     ) : (
//       <>
      
//       <FacebookLogin
//         appId="806324901497573"
//         autoLoad={true}
//         fields="name,email,picture"
//         callback={responseFacebook}
//         onClick={handleLoginClick}
//       />
//       </>
//     )}
//   </div>
//   );
// }

// export default GoogleLogin;



// // set HTTPS=true&&npm start

