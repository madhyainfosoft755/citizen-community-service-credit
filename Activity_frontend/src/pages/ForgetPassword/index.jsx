import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "Constant";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Forget = () => {
  const notify = (e) => toast(e);
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(`${API_URL}/activity/forgetpassword`, {
        email,
      });
      console.log("ye rha response", response);
      if (response && response.data && response.data.message) {
        setMessage(response.data.message);
        notify(response.data.message);
        setStep(2);
      } else {
        console.error("Invalid response structure:", response);
        notify("line 2", response.error);
        setMessage("An error occurred");
      }
    } catch (error) {
      setMessage(error.response.data.message || "An error occurred");
      notify("Email Not Found");
    }
  };

  const handleVerifyPin = async () => {
    try {
      const response = await axios.post(`${API_URL}/activity/verifyPin`, {
        email,
        pin,
      });
      console.log("horray")
      setMessage("");
      console.log("haiyaaa")
      notify(response.data.message)
      setStep(3);
      // Show password update form
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      setMessage(error.response.data.message || "Invalid PIN");
      notify(error.response.data.message)
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
      notify(response.data.message)
      navigate("/login")
    } catch (error) {
      setMessage(error.response.data.message || "An error occurred");
      notify(error.response.data.message)
    }
  };

  const login = () => {
    navigate("/login")

  }
  return (
    <div className="w-screen h-screen sm:w-screen sm:h-screen md:w-screen md:h-screen flex items-start justify-center p-4  sm:p-0">

      <div className="relative overflow-hidden w-4/12 h-full sm:w-full flex items-center justify-center  border-[1px] rounded-lg">
        <div className="w-64 h-64 absolute rounded-full -top-10 -right-20 bg-blue-200/20"></div>
        <div className="w-64 h-64 absolute rounded-full -bottom-10 -left-20 bg-blue-200/20"></div>
        <div className="relative p-8 flex flex-col items-center justify-center  w-full h-full sm:w-full sm:h-full ">
          {step === 1 && (
            <>

              <div className={`border-[1px] border-gray-400 p-1 w-full  rounded-xl bg-inherit mb-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 ${email && 'focus:border-blue-400'}`}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="border-none bg-inherit w-full h-full text-sm"
                  onFocus={() => setMessage('')}
                  required
                />
              </div>
              <button
                className="mt-2 mb-2 border-2 border-blue-400 px-6 py-1 text-sm rounded-full"
                onClick={handleForgotPassword}
              >
                Send PIN
              </button>
            </>
          )}

          <br />
          {step === 2 && (
            <>

              <div className={`border-[1px] border-gray-400 p-1 w-full  rounded-xl bg-inherit mb-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 ${email && 'focus:border-blue-400'}`}>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter Pin"
                  className="border-none bg-inherit w-full h-full text-sm"
                />
              </div>

              <button
                className="mt-2 mb-2 border-2 border-blue-400 px-6 py-1 text-sm rounded-full"
                onClick={handleVerifyPin}
              >
                Verify PIN
              </button>
            </>
          )}

          {pin && !message && (
            <div className="flex flex-col items-center justify-center mt-5">
              <div className="flex items-center justify-center border-[1px] border-gray-400 p-1 rounded-xl">
                <input
                  className=" border-none bg-inherit text-sm"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <div className="mt-2 flex items-center justify-center border-[1px] border-gray-400 p-1 rounded-xl">
                <input
                  className=" border-none bg-inherit text-sm"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>

              <button
                className={`mt-5 mb-2 border-2 border-blue-400 px-6 py-2 bg-blue-400 text-white-A700 text-sm rounded-full`}
                onClick={handleUpdatePassword}
              >
                Update Password
              </button>
            </div>
          )}

          <button className="mt-5 mb-2 border-2 border-blue-400 px-6 py-2 bg-blue-400 text-white-A700 text-sm rounded-full" onClick={login}>Go to Login Page</button>
        </div>

      </div>
    </div>

  );
};

export default Forget;
