import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from "Constant";
import { toast } from 'react-toastify';

const LinkedInOAuthHandler = () => {
  const [error, setError] = useState("");
  const [user, setUser] = useState(null); // State to hold user data
  const navigate = useNavigate();
  const notify = (e) => toast(e);

  useEffect(() => {
    const handleLinkedInResponse = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      console.log("what is the url", urlParams)
      const authorizationCode = urlParams.get('code');
      console.log("authorization code", authorizationCode)
      const error = urlParams.get('error');

      if (error) {
        setError("LinkedIn login was cancelled or failed.");
        navigate('/login');  // Redirect to login page
        notify(error);
        return;
      }

      if (!authorizationCode) {
        setError("Authorization code not found.");
        notify(error);
        navigate('/login');  // Redirect to login page
        return;
      }

      try {
        const response = await fetch(`${API_URL}/activity/LinkedInLogin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: authorizationCode }),
        });

        const data = await response.json();
        console.log("kya data aya",data);

        if (!response.ok) {
          setError("LinkedIn login failed.");
          notify("linkedin login failed");
          navigate('/login');  // Redirect to login page
          return;
        }

        const { token, user, redirect  } = data;
        console.log("what is redirect", redirect);
        console.log("what is user", user);

        if (token && user) {
          localStorage.setItem("token", token);
          localStorage.setItem("userKey", JSON.stringify(user));
          setUser(user); // Set the user data to state
          if (redirect) {
            navigate(redirect, {
              state: {
                user,
                fromLoginPage: true,
              }
            });  // Redirect based on backend response
          } else {
            navigate('/profile', {
              state: {
                user,
                fromLoginPage: true,
              }
            });  // Default redirect to profile page
          }
        } else {
          setError("Login response is missing data.");
          notify("Login response is missing data.");
          navigate('/login');  // Redirect to login page
        }
      } catch (error) {
        setError("An error occurred during LinkedIn login.");
        console.error("Error:", error);
        notify(error);
        navigate('/login');  // Redirect to login page
      }
    };

    handleLinkedInResponse();
  }, [navigate]);



  return (
    <div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default LinkedInOAuthHandler;
