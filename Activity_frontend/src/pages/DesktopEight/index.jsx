import React from "react";

import { Button, Img, Input, Text } from "components";
import { useNavigate } from "react-router-dom";

const DesktopSevenPage = () => {
  const navigate  = useNavigate();
  const goback = ()=>{
    navigate("/admin")
  }
  return (
      <div className="w-screen h-screen  bg-white-A700 flex items-start justify-center sm:w-screen sm:h-screen md:w-screen md:h-screen p-5 sm:p-0">
        <div className="relative w-4/12 h-full sm:w-full sm:h-full md:w-3/4 md:h-full  lg:w-3/4 lg:h-full  flex flex-col items-center  justify-start gap-4 border-[1px]  rounded-lg sm:rounded-none overflow-hidden">
          <div className="bg-white-A700 flex flex-row items-center justify-between p-5  shadow-bs3 w-full">
          <div onClick={goback}>
            <Img
              className="h-4 cursor-pointer"
              src="images/img_arrowleft.svg"
              alt="arrowleft"
            />
          </div>
            <Text
              className=" text-gray-900"
              size="txtInterSemiBold17"
            >
              Manage Approvers
            </Text>
            <Button
              className="flex w-7 h-7 items-center justify-center  rounded-1 "
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
                <div className="ml-[35px] sm:w-full sm:mx-0 w-[4%]  my-px">
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
                <div className="ml-[35px] sm:w-full sm:mx-0 w-[4%]  my-px">
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
  );
};

export default DesktopSevenPage;
