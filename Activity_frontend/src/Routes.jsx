import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "pages/Home";
import NotFound from "pages/NotFound";
import PageNavigation from "pages/PageNavigation/PageNavigate";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "components/AuthProvider/AuthProvider";
import { API_URL } from "Constant";
import Layout from "layout/layout";

const DesktopTwo = React.lazy(() => import("pages/DesktopTwo"));
const DesktopSeven = React.lazy(() => import("pages/DesktopSeven"));
const DesktopFive = React.lazy(() => import("pages/DesktopFive"));
const DesktopSix = React.lazy(() => import("pages/DesktopSix"));
const DesktopFour = React.lazy(() => import("pages/DesktopFour"));
const DesktopThree = React.lazy(() => import("pages/DesktopThree"));
const DesktopOne = React.lazy(() => import("pages/DesktopOne"));
const DesktopNine = React.lazy(() => import("pages/DesktopNine"));
const DesktopEight = React.lazy(() => import("pages/DesktopEight"));
const Endorse = React.lazy(()=>import("pages/Endorse"))

const ProjectRoutes = () => { 
  // const navigate = useNavigate();
  const { authenticated, setAuthenticated } = useAuth();
  // const [userData, setUserData] = useState(null);
  const [click, setClick] = useState(false);

  // const navigate = useNavigate();

  // useEffect(() => {
  //   const verifyToken = async () => {
  //     try {
  //       const userKey = localStorage.getItem("userKey");
  //       const token = localStorage.getItem("token");

  //       // Check if userKey and token are available
  //     if (!userKey || !token) {
  //       console.log("User Key: ", userKey );
  //       console.log("Token: ", token)
  //       return; // Skip API call if userKey or token is missing
  //     }

  //       const response = await fetch(`${API_URL}/activity/varifybytiken`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ userKey: userKey, token: token }),
  //       });
  //       const result = await response.json();
  //       if (response.ok) {
  //         setAuthenticated(true);
  //         // const result = await response.json();
  //       }
  //       // console.log(result, "response");

  //       if (result.error) {
  //         // handleLogout();
  //       }
  //     } catch (error) {
  //       console.error("Error verifying token:", error);
  //     }
  //   };

  //   verifyToken();
  // }, []);

  const handleClick = () => {
    setClick(!click);
  };

  

  return (
    <React.Suspense fallback={<h1 className="w-screen h-screen flex items-center justify-center">Loading...</h1>}>
      <Router>
        {/* <PageNavigation/>  */}
        <Routes>
          <Route path="/" element={<DesktopOne />} />
          {/* <Route path="*" element={<NotFound />} /> */}
          <Route path="/login" element={<DesktopOne />} />
          <Route path="/register" element={<DesktopTwo />} />
          <Route element={<Layout />}>
          <Route path="/create" element={<DesktopThree />} />
          <Route path="/activity" element={<DesktopFour />} />
          <Route path="/endorse" element={<Endorse />} />
          <Route path="/admin" element={<DesktopFive />} />
          <Route path="/managecategoris" element={<DesktopSix />} />
          <Route path="/aproovehours" element={<DesktopSeven />} />
          <Route path="/aproovers" element={<DesktopEight />} />
          <Route path="/desktopnine" element={<DesktopNine />} />
          </Route>

        </Routes>
      </Router>
    </React.Suspense>
  );
};
export default ProjectRoutes;
