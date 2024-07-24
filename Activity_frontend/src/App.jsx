import React from "react";
import Routes from "./Routes";
import { Slide, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./app.css"
function App() {
  return(
<>
<ToastContainer transition={Zoom} position="top-center" autoClose={2000} />
<Routes />
</>
  ) 
}


export default App;


