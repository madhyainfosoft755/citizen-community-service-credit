import React from "react";

const sizeClasses = {
  txtInterRegular15Black90087: "font-inter font-normal",
  txtInterMedium12: "font-inter font-medium",
  txtInterSemiBold14: "font-inter font-semibold",
  txtInterMedium13: "font-inter font-medium",
  txtInterSemiBold15: "font-inter font-semibold",
  txtInterSemiBold12: "font-inter font-semibold",
  txtInterSemiBold13: "font-inter font-semibold",
  txtInterSemiBold24: "font-inter font-semibold",
  txtInterSemiBold16Gray900: "font-inter font-semibold",
  txtInterSemiBold16: "font-inter font-semibold",
  txtInterMedium12Gray8007e: "font-inter font-medium",
  txtInterMedium14: "font-inter font-medium",
  txtInterSemiBold17: "font-inter font-semibold",
  txtInterMedium15: "font-inter font-medium",
  txtInterMedium14Black900: "font-inter font-medium",
  txtInterSemiBold11: "font-inter font-semibold",
  txtInterMedium13Black90099: "font-inter font-medium",
  txtInterRegular12: "font-inter font-normal",
  txtInterRegular15: "font-inter font-normal",
};

const Text = ({ children, className = "", size, as, ...restProps }) => {
  const Component = as || "p";

  return (
    <Component
      className={`text-left ${className} ${size && sizeClasses[size]}`}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export { Text };
