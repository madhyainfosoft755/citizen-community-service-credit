import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./InputWithIconAndText.css"; // Import the CSS file
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const InputWithIconAndText = ({ icon, iconColor, type, inputClassName, text,error, ...rest }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to track password visibility

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const isRequired = type === "email" || type === "password" || type === "number"|| type === "name"; // Add more types if needed
  return (
    <div className={`input-with-icon-and-text ${isFocused ? "focused" : ""}`}>
      <div className="icon-container">
        <FontAwesomeIcon
          icon={icon}
          className="icon"
          style={{ color: isFocused ? iconColor : "#ccc" }}
        />
      </div>
      <input
        type={showPassword ? "text" : type} // Use 'text' type when showPassword is true
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`${inputClassName} ${showPassword ? 'show-password' : ''} ${error ? 'error' : ''}`}
        required={isRequired}

        {...rest}
      />




    {type == "checkbox" &&(


      <div  className="text-container">{text}</div>
    )
    }


      {type === "password" && (
        <div className="eye-icon-container" onClick={togglePasswordVisibility}>
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            className="eye-icon"
          />
        </div>
      )}
    </div>
  );
};

export default InputWithIconAndText;
