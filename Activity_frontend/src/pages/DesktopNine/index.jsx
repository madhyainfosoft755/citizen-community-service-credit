import React from "react";

import { Button, Img, Text } from "components";
import { useNavigate } from "react-router-dom";

const DesktopNinePage = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-screen h-screen bg-white-A700 flex items-start justify-center sm:w-screen sm:h-screen md:w-screen md:h-screen p-5 sm:p-0">
        <div className="relative w-4/12 h-full sm:w-full sm:h-full md:w-3/4 md:h-full lg:w-3/4 lg:h-full flex flex-col items-center justify-start gap-5 border-[1px] rounded-lg sm:rounded-none overflow-hidden">
          <div className="relative w-full flex flex-col items-center justify-center gap-2">
            <div className="bg-white-A700 flex flex-row items-center justify-between p-5 shadow-bs3 w-full">
              <div onClick={() => navigate("/admin")}>
                <Img className="h-4 cursor-pointer" src="images/img_arrowleft.svg" alt="arrowleft" />
              </div>
              <Text
                className=" text-gray-900"
                size="txtInterSemiBold17"
              >
                Generate Report
              </Text>
              <div />
            </div>
            <div className="flex flex-col md:gap-10 gap-[449px] items-center justify-start w-[85%] md:w-full">
              <div
                className="bg-cover bg-no-repeat flex flex-col h-[122px] items-center justify-end p-5 w-full bg-blue-300"
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

        </div>
      </div>
    </>
  );
};

export default DesktopNinePage;
