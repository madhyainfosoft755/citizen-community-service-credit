import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "Constant";
import { useAuth } from "components/AuthProvider/AuthProvider";

const withTokenVerification = (WrappedComponent) => {
  return (props) => {
    const [isLoading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [authenticated,setAuthenticated]=(useAuth)

    const handleLogout=()=>{

    }

  
    useEffect(() => {
        const verifyToken = async () => {
          try {
            const userKey = localStorage.getItem("userKey");
            const token = localStorage.getItem("token");
           
    
            const response = await fetch(
              `${API_URL}/activity/varifybytiken`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ userKey: userKey, token: token }),
              }
            );
            const result = await response.json();
            if (response.ok) {
              setAuthenticated(true);
              const result = await response.json();
            }
            console.log(result, "responce");
    
            if (result.error) {
              handleLogout();
            }
          } catch (error) {
            console.error("Error verifying token:", error);
          }
        };
    
        console.log("useeffect");
        verifyToken();
      }, []);

    

    return isLoading ? <div>Loading...</div> : <WrappedComponent {...props} />;
  };
};

export default withTokenVerification;
