import React from "react";

import { Img, List, Text } from "components";

const DesktopEightPage = () => {
  return (
    <>
      <div className="bg-white-A700 flex flex-col font-inter items-center justify-start mx-auto p-[79px] md:px-10 sm:px-5 w-full">
        <div className="bg-white-A700 flex flex-col gap-[27px] items-center justify-start mb-[130px] pb-[485px] md:px-5 rounded-[5px] shadow-bs2 w-[33%] md:w-full">
          <div className="bg-white-A700 flex flex-row gap-[104px] items-start justify-start p-[13px] rounded-tl-[5px] rounded-tr-[5px] shadow-bs3 w-full">
            <Img
              className="h-[15px] ml-[18px] mt-5"
              src="images/img_arrowleft.svg"
              alt="arrowleft"
            />
            <Text
              className="mt-[19px] text-[17px] text-gray-900"
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
    </>
  );
};

export default DesktopEightPage;
