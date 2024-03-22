import React, { useState }  from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './InputWithIconAndText.css'; // Import the CSS file

const InputWithIconAndText = ({ icon,iconColor, text, ...rest }) => {
  
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={`input-with-icon-and-text ${isFocused ? 'focused' : ''}`}>
      <div className="icon-container">
        <FontAwesomeIcon icon={icon} className="icon" style={{ color: isFocused ? iconColor : '#ccc' }} />
      </div>
      <input
        type="text"
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      />
      <div className="text-container">{text}</div>
    </div>
  );
};

export default InputWithIconAndText;