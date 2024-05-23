// ProtectedRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from 'components/AuthProvider/AuthProvider';
import { Navigate, Outlet} from 'react-router-dom';

const ProtectedRoute = ({ element: Component, adminOnly, ...rest }) => {
  const { authenticated, isAdmin, isloading } = useAuth();

  // console.log("kya hai authenticate", authenticated)
  // console.log("kya hai loading", isloading)

  if(isloading == false){
    // console.log("first", isloading)
  if (!authenticated) {
      // console.log("is user authenticated", authenticated)
    return <Navigate to="/login" replace />;
  }
}
  if(isloading == false){
    // console.log("second", isloading)

  if (adminOnly && !isAdmin) {
    // console.log("is user admin", isAdmin)
    return <Navigate to="/" replace />;
  }
  }
  if(isloading == false){
    // console.log("third", isloading)

      if(adminOnly && isAdmin) {
          // console.log("is user authenticated123", authenticated)
          // console.log("is user admin123", isAdmin)
          
          return <Component />;
        }
    }
    return null;
};

export default ProtectedRoute;
