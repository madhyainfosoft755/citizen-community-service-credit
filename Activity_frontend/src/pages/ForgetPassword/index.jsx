import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "Constant";
import { useNavigate } from "react-router-dom";

const Forget = () => {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  console.log("kya email mil rhi ahi", email);

  
  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(`${API_URL}/activity/forgetpassword`, {
        email,
      });
      console.log("ye rha response", response);
      if (response && response.data && response.data.message) {
        setMessage(response.data.message);
      } else {
        console.error("Invalid response structure:", response);
        setMessage("An error occurred");
      }
    } catch (error) {
      setMessage(error.response.data.message || "An error occurred");
    }
  };

  const handleVerifyPin = async () => {
    try {
      const response = await axios.post(`${API_URL}/activity/verifyPin`, {
        email,
        pin,
      });
      setMessage("");
      // Show password update form
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      setMessage(error.response.data.message || "Invalid PIN");
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/activity/updatePassword`, {
        email,
        newPassword,
      });
      setMessage(response.data.message);
      // Clear form fields after successful password update
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      setMessage(error.response.data.message || "An error occurred");
    }
  };

  const login = () => {
    navigate("/login")
  }
  return (
    <div className="w-screen h-screen sm:w-screen sm:h-screen md:w-screen md:h-screen flex items-start justify-center p-4  ">

      <div className="relative overflow-hidden w-4/12 h-full   border-[1px] rounded-lg">
        <div className="w-64 h-64 absolute rounded-full -top-10 -right-20 bg-blue-200/20"></div>
        <div className="relative p-8 flex flex-col items-center justify-center">
        {!pin && !message && (
          <div className={`border-[1px] border-black-900 p-1 w-full h-full rounded-xl bg-inherit mb-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 ${email && 'focus:border-blue-400'}`}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="border-none  w-full h-full"
              onFocus={() => setMessage('')}
            />
          </div>
        )}
        {!message && (
          <button
            className="mt-2 mb-2 border-2 border-blue-400 px-6 py-2 rounded-full"
            onClick={handleForgotPassword}
          >
            Send PIN
          </button>
        )}
          <br />
          {!pin && !message && (
          <div className={`border-[1px] border-black-900 p-1 w-full h-full rounded-xl bg-inherit mb-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 ${email && 'focus:border-blue-400'}`}>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter email"
              className="border-none  w-full h-full"
            />
          </div>
          )}
          
          {/* <input
            className="border-4 border-black-900 p-3 rounded-xl bg-inherit"
            type="text"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
          /> */}
          <button
            className="mt-2 mb-2 border-2 border-blue-400 px-6 py-2 rounded-full"
            onClick={handleVerifyPin}
          >
            Verify PIN
          </button>

          {message && <p>{message}</p>}

          {pin && !message && (
            <div className="flex flex-col items-center justify-center mt-5">
              <input
                className="border-4 border-black-900 p-3 rounded-xl mb-2"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <input
                className="border-4 border-black-900 p-3 rounded-xl"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm new password"
              />
              <button
                className="mt-5 mb-2 border-2 border-blue-400 px-6 py-2 bg-blue-400 text-white-A700 rounded-full"
                onClick={handleUpdatePassword}
              >
                Update Password
              </button>
            </div>
          )}

          <button className="mt-5 mb-2 border-2 border-blue-400 px-6 py-2 bg-blue-400 text-white-A700 rounded-full" onClick={login}>Go to Login Page</button>
        </div>

      </div>
    </div>

  );
};

export default Forget;
