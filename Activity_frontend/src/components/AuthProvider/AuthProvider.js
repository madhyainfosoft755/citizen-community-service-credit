// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
// import { useAuth } from 'components/AuthProvider/Authprovider';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // New state for admin status
  const [isloading, setIsloading] = useState(true);



  console.log("ye hai loading statuus", isloading)
  useEffect(() => {
    // setIsloading(true)

    const token = localStorage.getItem('token');
    const userKey = localStorage.getItem("userKey");
    console.log("token", token)
    console.log("userKey", userKey)

    if (userKey && token) {

      console.log("token", token)
      console.log("userKey", userKey)

      setAuthenticated(true);


      const userRole = localStorage.getItem("role");
      console.log(userRole)

      if (userRole === "admin") {
        setIsAdmin(true);
      }

    }
    setIsloading(false)

  }, []);

  console.log("authenticated ", authenticated)
  console.log("isAdmin", isAdmin)


  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, isAdmin, isloading, setIsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);      
