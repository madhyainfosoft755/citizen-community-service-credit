import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "pages/Home";
import NotFound from "pages/NotFound";
import PageNavigation from "pages/PageNavigation/PageNavigate";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "components/AuthProvider/AuthProvider";
import ProtectedRoute from "components/ProtectedComponent/ProtectedRoute";
import OpenActivity from "pages/OpenActivity";
import Certificate from "pages/Certficate";
import ProfileForUser from "pages/User_Profile";
import UserReport from "pages/Reports/reports";
import UserReportsTable from "pages/Reports/report-table";
import ActivityDetails from "pages/endorse-activity/endorse-activity";

const DesktopTwo = React.lazy(() => import("pages/DesktopTwo"));
const DesktopSeven = React.lazy(() => import("pages/DesktopSeven"));
const DesktopFive = React.lazy(() => import("pages/DesktopFive"));
const DesktopSix = React.lazy(() => import("pages/DesktopSix"));
const DesktopFour = React.lazy(() => import("pages/DesktopFour"));
const DesktopThree = React.lazy(() => import("pages/DesktopThree"));
const DesktopOne = React.lazy(() => import("pages/DesktopOne"));
const DesktopNine = React.lazy(() => import("pages/DesktopNine"));
const DesktopEight = React.lazy(() => import("pages/DesktopEight"));
const Endorse = React.lazy(() => import("pages/Endorse"))
const Verify = React.lazy(() => import("pages/VerifyPage"))
const Forget = React.lazy(() => import("pages/ForgetPassword"))
const DesktopTen = React.lazy(() => import("pages/DekstopTen"))
const ManageOrganization = React.lazy(() => import("pages/ManageOrganization"))
const UsersPosts = React.lazy(() => import("pages/UsersPost"))
const ReviewActivity = React.lazy(() => import("pages/ReviewActivity"))
const ProfilePage = React.lazy(() => import("pages/ProfilePage"))
const TokenRetrival = React.lazy(() => import("pages/TokenRetriver"))
const Profile = React.lazy(() => import("pages/Profile"))
const Imgmodel = React.lazy(() => import("pages/imageModel"))
const AIapproval = React.lazy(() => import("pages/AIapproval"))

const RestrictedRoute = ({ children }) => {
  const { authenticated } = useAuth();
  const restrictedPaths = ['/forget', '/login', '/register'];
  const currentPath = window.location.pathname.replace('/apps', '');

  if (authenticated && restrictedPaths.includes(currentPath)) {
    return <Navigate to="/create" replace />;
  }

  return children;
};

const ProjectRoutes = () => {
  // const { authenticated, setAuthenticated } = useAuth();
  // const [userData, setUserData] = useState(null);
  // const [click, setClick] = useState(false);

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

  // const handleClick = () => {
  //   setClick(!click);
  // };



  return (
    <React.Suspense fallback={<h1 className="w-screen h-screen flex items-center justify-center">Loading...</h1>}>
      <Router basename="/apps">
        <Routes>
          <Route path="/" element={<RestrictedRoute><DesktopOne /></RestrictedRoute>} />
          <Route path="/token" element={<RestrictedRoute><TokenRetrival /></RestrictedRoute>} />
          <Route path="/profile" element={<RestrictedRoute><ProfilePage /></RestrictedRoute>} />
          <Route path="/userprofile" element={<RestrictedRoute><Profile /></RestrictedRoute>} />
          <Route path="/login" element={<RestrictedRoute><DesktopOne /></RestrictedRoute>} />
          <Route path="/register" element={<RestrictedRoute><DesktopTwo /></RestrictedRoute>} />
          <Route path="/create" element={<RestrictedRoute><DesktopThree /></RestrictedRoute>} />
          <Route path="/activity" element={<RestrictedRoute><DesktopFour /></RestrictedRoute>} />
          <Route path="/verify/:token" element={<RestrictedRoute><Verify /></RestrictedRoute>} />
          <Route path="/forget" element={<RestrictedRoute><Forget /></RestrictedRoute>} />
          <Route path="/endorse" element={<RestrictedRoute><Endorse /></RestrictedRoute>} />
          <Route path="/endorse-activity/:id" element={<RestrictedRoute><ActivityDetails/></RestrictedRoute>} />
          <Route path="/posts/:postId" element={<RestrictedRoute><OpenActivity /></RestrictedRoute>} />
          <Route path="/certificate/:id" element={<RestrictedRoute><Certificate /></RestrictedRoute>} />
          <Route path="/users-profile" element={<RestrictedRoute><ProfileForUser /></RestrictedRoute>} />
          <Route path="/user-report" element={<RestrictedRoute><UserReport /></RestrictedRoute>} />
          <Route path="/user-report-table" element={<RestrictedRoute><UserReportsTable /></RestrictedRoute>} />

          <Route path="/admin" element={<ProtectedRoute element={DesktopFive} adminOnly />} />
          <Route path="/imgmod" element={<ProtectedRoute element={Imgmodel} adminOnly />} />
          <Route path="/aiapproval" element={<ProtectedRoute element={AIapproval} adminOnly />} />
          <Route path="/managecategories" element={<ProtectedRoute element={DesktopSix} adminOnly />} />
          <Route path="/approvehours" element={<ProtectedRoute element={DesktopSeven} adminOnly />} />
          <Route path="/approvers" element={<ProtectedRoute element={DesktopEight} adminOnly />} />
          <Route path="/generatereport" element={<ProtectedRoute element={DesktopNine} adminOnly />} />
          <Route path="/manageusers" element={<ProtectedRoute element={DesktopTen} adminOnly />} />
          <Route path="/manageorganization" element={<ProtectedRoute element={ManageOrganization} adminOnly />} />
          <Route path="/userspost/:userId" element={<ProtectedRoute element={UsersPosts} adminOnly />} />
          <Route path="/reviewactivity/:userId/:postId" element={<ProtectedRoute element={ReviewActivity} adminOnly />} />


          {/* <Route path="*" element={<NotFound />} /> */}
          <Route path="*" element={<Navigate to="/create" replace />} />
        </Routes>
      </Router>
    </React.Suspense>
  );
};
export default ProjectRoutes;
