import React from "react";

import { Button, Img, Text } from "components";

const DesktopNinePage = () => {
  return (
    <>
      <div className="bg-white-A700 flex flex-col font-inter items-center justify-start mx-auto p-[78px] md:px-10 sm:px-5 w-full">
        <div className="bg-white-A700 flex flex-col gap-[27px] items-center justify-start mb-[132px] pb-[25px] md:px-5 rounded-[5px] shadow-bs2 w-[33%] md:w-full">
          <div className="bg-white-A700 flex flex-row gap-[98px] items-start justify-start p-3.5 rounded-tl-[5px] rounded-tr-[5px] shadow-bs3 w-full">
            <Img
              className="h-[15px] ml-[17px] mt-[19px]"
              src="images/img_arrowleft.svg"
              alt="arrowleft"
            />
            <Text
              className="mt-[18px] text-[17px] text-gray-900"
              size="txtInterSemiBold17"
            >
              Generate Report
            </Text>
          </div>
          <div className="flex flex-col md:gap-10 gap-[449px] items-center justify-start w-[85%] md:w-full">
            <div
              className="bg-cover bg-no-repeat flex flex-col h-[122px] items-center justify-end p-5 w-full"
              style={{ backgroundImage: "url('images/img_group2.svg')" }}
            >
              <div className="flex flex-col items-center justify-start w-[94%] md:w-full">
                <div className="flex flex-col gap-[11px] items-center justify-start w-full">
                  <div className="flex flex-row gap-2.5 items-center justify-between w-full">
                    <Button
                      className="!text-black-900 cursor-pointer font-medium min-w-[140px] text-center text-xs"
                      shape="round"
                    >
                      Select Date
                    </Button>
                    <Button
                      className="!text-black-900 cursor-pointer font-medium min-w-[140px] text-center text-xs"
                      shape="round"
                    >
                      Select Category
                    </Button>
                  </div>
                  <div className="flex flex-row gap-2.5 items-center justify-between w-full">
                    <Button
                      className="!text-black-900 cursor-pointer font-medium min-w-[140px] text-center text-xs"
                      shape="round"
                    >
                      Select City
                    </Button>
                    <Button
                      className="!text-black-900 cursor-pointer font-medium min-w-[140px] text-center text-xs"
                      shape="round"
                    >
                      Select State
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <Button
              className="cursor-pointer font-semibold min-w-[350px] text-base text-center"
              shape="round"
              color="indigo_A200"
            >
              GENERATE REPORT
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesktopNinePage;
