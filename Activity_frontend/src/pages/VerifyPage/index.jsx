import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "Constant";
const Verify = () => {
  const { token } = useParams(); // Get the token parameter from the URL
  const navigate = useNavigate(); // Use useNavigate hook for programmatic navigation
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("is page pr aa gye ho aap");
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const uniqueTokenUrl = `
        ${API_URL}/activity/verify/${token}`;
        await axios.get(uniqueTokenUrl);
        // Verification successful, redirect to login page
        navigate("/login"); // Use navigate to redirect
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setError(error.response.data.message);
        } else {
          setError("An error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  if (useEffect == true) {
    console.log("chal gya use effect");
  } else {
    console.log("nhi chala use effect");
  }
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <p>Email verified. Redirecting to login page...</p>
      )}
    </div>
  );
};

export default Verify;
