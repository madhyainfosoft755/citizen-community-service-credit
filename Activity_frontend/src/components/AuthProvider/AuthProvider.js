// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
// import { useAuth } from 'components/AuthProvider/Authprovider';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {

    const token = localStorage.getItem('token');
    const userKey = localStorage.getItem("userKey");
    // const userkey = JSON.parse(localStorage.getItem("userkey"));
    // console.log(userKey,"autho context provider")
    // console.log(token,"autho context provider")
    if (userKey)
      setAuthenticated(true);
    if (token)
      setAuthenticated(true); 

  }, []);



  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);      
