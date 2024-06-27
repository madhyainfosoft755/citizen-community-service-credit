// ... (imports and constants)
import React from "react";
import PropTypes from "prop-types";
import { ErrorMessage } from "../../components/ErrorMessage";

const variants = {
  fill: {
    indigo_A200: "bg-indigo-A200 text-white-A700",
    indigo_A200_21: "bg-indigo-A200_21 text-indigo-A200",
    white_A700: "bg-white-A700 shadow-bs text-gray-600",
    gray_100: "bg-gray-100 text-black-900",
  },
};
const shapes = { round: "rounded-[5px]" };
const sizes = {
  xs: "pb-2 pt-[9px] px-2",
  sm: "pb-[11px] pt-[13px] px-[11px]",
  md: "pb-3.5 pt-4 px-3.5",
};

// ... (imports and constants)

const Input = React.forwardRef(
  (
    {
      wrapClassName = "",
      className = "",
      name = "",
      placeholder = "",
      type = "text",
      children,
      errors = [],
      label = "",
      prefix,
      suffix,
      onChange,
      shape = "",
      size = "md",
      variant = "fill",
      color = "gray_100",
      ...restProps
    },
    ref,
  ) => {
    const handleChange = (e) => {
      const value = e?.target?.value; 
      const name = e?.target?.name; 
      if (onChange) onChange(name, value);
    };

    return (
      <>
      <div
        className={`${wrapClassName} 
            ${shapes[shape] || ""} 
            ${variants[variant]?.[color] || ""} 
            ${sizes[size] || ""}`}
      >
        {!!label && label}
        {!!prefix && prefix}
        <input 
          ref={ref}  // Forward the ref to the input element
          className={`${className} bg-transparent border-0`}
          type={type}
          name={name}
          onChange={handleChange}
          placeholder={placeholder}
          {...restProps}
        />
        {!!suffix && suffix}
      </div>
      {!!errors && <ErrorMessage errors={errors} />}
    </>
    );
  },
);

// ... (propTypes)

export { Input };





// import React from "react";
// import PropTypes from "prop-types";
// import { ErrorMessage } from "../../components/ErrorMessage";

// const variants = {
//   fill: {
//     indigo_A200: "bg-indigo-A200 text-white-A700",
//     indigo_A200_21: "bg-indigo-A200_21 text-indigo-A200",
//     white_A700: "bg-white-A700 shadow-bs text-gray-600",
//     gray_100: "bg-gray-100 text-black-900",
//   },
// };
// const shapes = { round: "rounded-[5px]" };
// const sizes = {
//   xs: "pb-2 pt-[9px] px-2",
//   sm: "pb-[11px] pt-[13px] px-[11px]",
//   md: "pb-3.5 pt-4 px-3.5",
// };

// const Input = React.forwardRef(
//   (
//     {
//       wrapClassName = "",
//       className = "",
//       name = "",
//       placeholder = "",
//       type = "text",
//       children,
//       errors = [],
//       label = "",
//       prefix,
//       suffix,
//       onChange,
//       shape = "",
//       size = "md",
//       variant = "fill",
//       color = "gray_100",
//       ...restProps
//     },
//     ref,
//   ) => {
//     const handleChange = (e) => {
//       if (onChange) onChange(e?.target?.value);
//     };

//     return (
//       <>
//         <div
//           className={`${wrapClassName} 
//               ${shapes[shape] || ""} 
//               ${variants[variant]?.[color] || ""} 
//               ${sizes[size] || ""}`}
//         >
//           {!!label && label}
//           {!!prefix && prefix}
//           <input
//             ref={ref}
//             className={`${className} bg-transparent border-0`}
//             type={type}
//             name={name}
//             onChange={handleChange}
//             placeholder={placeholder}
//             {...restProps}
//           />
//           {!!suffix && suffix}
//         </div>
//         {!!errors && <ErrorMessage errors={errors} />}
//       </>
//     );
//   },
// );

// Input.propTypes = {
//   wrapClassName: PropTypes.string,
//   className: PropTypes.string,
//   name: PropTypes.string,
//   placeholder: PropTypes.string,
//   type: PropTypes.string,
//   shape: PropTypes.oneOf(["round"]),
//   size: PropTypes.oneOf(["xs", "sm", "md"]),
//   variant: PropTypes.oneOf(["fill"]),
//   color: PropTypes.oneOf([
//     "indigo_A200",
//     "indigo_A200_21",
//     "white_A700",
//     "gray_100",
//   ]),
// };

// export { Input };
