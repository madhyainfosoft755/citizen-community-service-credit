import React from "react";
import "./styles/color.css";
import "./styles/font.css";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles/index.css";
import "./styles/tailwind.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "components/AuthProvider/AuthProvider";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(
  <React.StrictMode>

    <AuthProvider>
     <GoogleOAuthProvider clientId= {process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    {/* <ToastContainer> */}
    <App />
    {/* </ToastContainer> */}
    </GoogleOAuthProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
