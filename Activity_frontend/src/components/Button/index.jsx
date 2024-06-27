import React, { useState } from "react";
import PropTypes from "prop-types";

const shapes = { round: "rounded-[5px]" };
const variants = {
  fill: {
    white_A700: "bg-white-A700 shadow-bs1 text-black-900_a2",
    indigo_A200: "bg-indigo-A200 text-white-A700",
    gray_50_01: "bg-gray-50_01 shadow-bs1 text-indigo-A200",
    indigo_A200_21: "bg-indigo-A200_21 text-indigo-A200",
    blue_50: "bg-blue-50 text-gray-900",
  },
  outline: {
    indigo_A200: "border border-indigo-A200 border-solid text-indigo-A200",
  },
};
const sizes = { xs: "p-1.5", sm: "p-[11px]", md: "p-3.5" };

const Button = ({
  children,
  className = "",
  leftIcon,
  rightIcon,
  shape = "",
  size = "sm",
  variant = "fill",
  color = "white_A700",
  onClick, // Added onClick prop
  ...restProps
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(children); // Pass the button value to the onClick handler
    }
  };

  return (
    <button
      className={`${className} ${(shape && shapes[shape]) || ""} ${
        (size && sizes[size]) || ""
      } ${(variant && variants[variant]?.[color]) || ""}`}
      onClick={handleClick} // Attach the handleClick function to the onClick event
      {...restProps}
    >
      {!!leftIcon && leftIcon}
      {children}
      {!!rightIcon && rightIcon}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  shape: PropTypes.oneOf(["round"]),
  size: PropTypes.oneOf(["xs", "sm", "md"]),
  variant: PropTypes.oneOf(["fill", "outline"]),
  color: PropTypes.oneOf([
    "white_A700",
    "indigo_A200",
    "gray_50_01",
    "indigo_A200_21",
    "blue_50",
  ]),
  onClick: PropTypes.func, // Added onClick prop type
};

export { Button };






// import React from "react";
// import PropTypes from "prop-types";

// const shapes = { round: "rounded-[5px]" };
// const variants = {
//   fill: {
//     white_A700: "bg-white-A700 shadow-bs1 text-black-900_a2",
//     indigo_A200: "bg-indigo-A200 text-white-A700",
//     gray_50_01: "bg-gray-50_01 shadow-bs1 text-indigo-A200",
//     indigo_A200_21: "bg-indigo-A200_21 text-indigo-A200",
//     blue_50: "bg-blue-50 text-gray-900",
//   },
//   outline: {
//     indigo_A200: "border border-indigo-A200 border-solid text-indigo-A200",
//   },
// };
// const sizes = { xs: "p-1.5", sm: "p-[11px]", md: "p-3.5" };

// const Button = ({
//   children,
//   className = "",
//   leftIcon,
//   rightIcon,
//   shape = "",
//   size = "sm",
//   variant = "fill",
//   color = "white_A700",
//   ...restProps
// }) => {
//   return (
//     <button
//       className={`${className} ${(shape && shapes[shape]) || ""} ${
//         (size && sizes[size]) || ""
//       } ${(variant && variants[variant]?.[color]) || ""}`}
//       {...restProps}
//     >
//       {!!leftIcon && leftIcon}
//       {children}
//       {!!rightIcon && rightIcon}
//     </button>
//   );
// };

// Button.propTypes = {
//   className: PropTypes.string,
//   children: PropTypes.node,
//   shape: PropTypes.oneOf(["round"]),
//   size: PropTypes.oneOf(["xs", "sm", "md"]),
//   variant: PropTypes.oneOf(["fill", "outline"]),
//   color: PropTypes.oneOf([
//     "white_A700",
//     "indigo_A200",
//     "gray_50_01",
//     "indigo_A200_21",
//     "blue_50",
//   ]),
// };

// export { Button };
