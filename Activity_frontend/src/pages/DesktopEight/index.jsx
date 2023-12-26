import React from "react";

import { Button, Img, Input, Text } from "components";

const DesktopSevenPage = () => {
  return (
    <>
      <div className="bg-white-A700 flex flex-col font-inter items-center justify-start mx-auto p-[74px] md:px-10 sm:px-5 w-full">
        <div className="bg-white-A700 flex flex-col gap-[27px] items-center justify-start mb-[140px] pb-[531px] md:px-5 rounded-[5px] shadow-bs2 w-[33%] md:w-full">
          <div className="bg-white-A700 flex flex-row items-start justify-between p-[13px] rounded-tl-[5px] rounded-tr-[5px] shadow-bs3 w-full">
            <Img
              className="h-[15px] ml-[19px] mt-[21px]"
              src="images/img_arrowleft.svg"
              alt="arrowleft"
            />
            <Text
              className="mt-5 text-[17px] text-gray-900"
              size="txtInterSemiBold17"
            >
              Manage Approvers
            </Text>
            <Button
              className="flex h-[27px] items-center justify-center mr-[18px] mt-[15px] rounded-[3px] w-[27px]"
              shape="round"
              color="indigo_A200"
              size="xs"
            >
              <Img className="h-3.5" src="images/img_close.svg" alt="close" />
            </Button>
          </div>
          <div className="flex flex-col gap-2.5 items-center justify-start w-[85%] md:w-full">
            <Input
              name="groupSeventySix"
              placeholder="Emma Jackson"
              className="font-medium p-0 placeholder:text-black-900 text-[15px] text-left w-full"
              wrapClassName="flex w-full"
              suffix={
                <div className="ml-[35px] sm:w-full sm:mx-0 w-[4%] bg-indigo-A200 my-px">
                  <Img
                    className="my-auto"
                    src="images/img_thumbsup.svg"
                    alt="thumbs_up"
                  />
                </div>
              }
              shape="round"
            ></Input>
            <Input
              name="groupSeventySeven"
              placeholder="Joan Wicks"
              className="font-medium p-0 placeholder:text-black-900 text-left text-sm w-full"
              wrapClassName="flex w-full"
              suffix={
                <div className="ml-[35px] sm:w-full sm:mx-0 w-[4%] bg-indigo-A200 my-px">
                  <Img
                    className="my-auto"
                    src="images/img_thumbsup.svg"
                    alt="thumbs_up"
                  />
                </div>
              }
              shape="round"
            ></Input>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesktopSevenPage;
