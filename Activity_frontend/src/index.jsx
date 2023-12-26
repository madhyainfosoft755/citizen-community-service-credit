import React from "react";
import "./styles/color.css";
import "./styles/font.css";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles/index.css";
import "./styles/tailwind.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "components/AuthProvider/AuthProvider";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
     <GoogleOAuthProvider clientId="34762084028-m8143jq3dv0q2c7l59e2dus71l02fl8c.apps.googleusercontent.com">
    
    
  
    <App />
    </GoogleOAuthProvider>;
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
