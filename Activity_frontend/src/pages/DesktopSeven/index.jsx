import React, { useState } from "react";

import { Img, List, Text } from "components";
import { useNavigate } from "react-router-dom";

const DesktopEightPage = () => {
  const navigate = useNavigate();

  const goback = () => {
    navigate("/admin");
  };

  return (
    <div className=" flex items-center justify-center p-4 sm:p-0  w-screen h-screen sm:w-screen sm:h-screen">
      <div className=" relative w-4/12 h-full sm:w-full sm:h-full md:w-3/4 md:h-full  lg:w-3/4 lg:h-full  flex flex-col items-center  justify-start border-[1px] gap-4  rounded-lg sm:rounded-none overflow-hidden">
        <div className="bg-white-A700 flex  items-center justify-start relative p-6 shadow-bs3 w-full">
          <div onClick={goback}>
            <Img
              className="h-4 cursor-pointer"
              src="images/img_arrowleft.svg"
              alt="arrowleft"
            />
          </div>
          <Text
            className=" text-base text-gray-900 absolute left-[35%]"
            size="txtInterSemiBold17"
          >
            Approve Hours
          </Text>

        </div>
        <List
          className="flex flex-col gap-2.5 items-center w-[85%]"
          orientation="vertical"
        >
          <div className="bg-gray-100 flex flex-row items-center justify-between p-4 rounded-[5px] w-full">
            <div className="flex flex-col gap-1.5 items-start justify-start ml-0.5">
              <Text
                className="text-[15px] text-black-900"
                size="txtInterMedium15"
              >
                Emma Jackson
              </Text>
              <Text
                className="text-black-900_99 text-xs"
                size="txtInterRegular12"
              >
                Requested for 3 Hours approval
              </Text>
            </div>
            <Text
              className="text-[13px] text-indigo-A200"
              size="txtInterSemiBold13"
            >
              Approve
            </Text>
          </div>
          <div className="bg-gray-100 flex flex-row items-center justify-between p-4 rounded-[5px] w-full">
            <div className="flex flex-col gap-1.5 items-start justify-start ml-0.5">
              <Text
                className="text-[15px] text-black-900"
                size="txtInterMedium15"
              >
                Emma Jackson
              </Text>
              <Text
                className="text-black-900_99 text-xs"
                size="txtInterRegular12"
              >
                Requested for 3 Hours approval
              </Text>
            </div>
            <Text
              className="text-[13px] text-indigo-A200"
              size="txtInterSemiBold13"
            >
              Approve
            </Text>
          </div>
        </List>
      </div>
    </div>
  );
};

export default DesktopEightPage;
