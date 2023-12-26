import React from "react";

import { Button, Img, Input, Text } from "components";

const DesktopFivePage = () => {
  return (
    <>
      <div className="bg-white-A700 flex flex-col font-inter items-center justify-start mx-auto p-[74px] md:px-10 sm:px-5 w-full">
        <div className="bg-white-A700 flex flex-col items-center justify-start mb-[140px] pb-[25px] md:px-5 rounded-[5px] shadow-bs2 w-[33%] md:w-full">
          <div className="flex flex-col gap-[22px] items-end justify-start w-full">
            <div className="bg-gray-50 flex flex-row items-center justify-between p-7 sm:px-5 w-full">
              <div className="flex flex-row gap-4 items-center justify-center ml-[5px]">
                <Img
                  className="h-[58px] md:h-auto rounded-[50%] w-[58px]"
                  src="images/img_ellipse3.png"
                  alt="ellipseThree"
                />
                <div className="flex flex-col items-center justify-start w-3/5">
                  <div className="flex flex-col items-start justify-start w-full">
                    <Text
                      className="text-base text-gray-900"
                      size="txtInterSemiBold16Gray900"
                    >
                      Emma Janson
                    </Text>
                    <Text
                      className="mt-1 text-gray-900_b2 text-xs"
                      size="txtInterMedium12"
                    >
                      ID : 123456
                    </Text>
                  </div>
                </div>
              </div>
              <Button
                className="cursor-pointer font-semibold leading-[normal] min-w-[90px] mr-1 my-[11px] text-[13px] text-center"
                shape="round"
                color="indigo_A200"
              >
                12.5 Hours
              </Button>
            </div>
            <div className="flex flex-col items-start justify-start w-[93%] md:w-full">
              <Text
                className="text-base text-gray-900"
                size="txtInterSemiBold16Gray900"
              >
                Top Five Stars
              </Text>
              <div className="flex sm:flex-col flex-row gap-[11px] items-center justify-between mt-[13px] w-full">
                <div className="md:h-[163px] h-[164px] relative w-[76%] sm:w-full">
                  <div className="absolute bg-white-A700_33 h-[90px] left-[0] rounded-tl-[5px] rounded-tr-[5px] top-[0] w-[59%]"></div>
                  <div
                    className="absolute bg-cover bg-no-repeat flex flex-col h-full inset-y-[0] items-center justify-end left-[0] my-auto p-3.5 w-[49%]"
                    style={{ backgroundImage: "url('images/img_group23.svg')" }}
                  >
                    <div className="flex flex-col gap-[9px] items-center justify-start mt-0.5">
                      <Text
                        className="text-[15px] text-indigo-A200"
                        size="txtInterSemiBold15"
                      >
                        Month
                      </Text>
                      <Text
                        className="leading-[160.00%] text-[13px] text-black-900_99 text-center"
                        size="txtInterMedium13Black90099"
                      >
                        <>
                          Levis D.
                          <br />
                          William K.
                          <br />
                          Shortan W.
                          <br />
                          Loise M.
                          <br />
                          Petter P.
                        </>
                      </Text>
                    </div>
                  </div>
                  <div
                    className="absolute bg-cover bg-no-repeat flex flex-col h-full inset-y-[0] items-center justify-end my-auto p-3.5 right-[0] w-[49%]"
                    style={{ backgroundImage: "url('images/img_group23.svg')" }}
                  >
                    <div className="flex flex-col gap-2.5 items-center justify-start">
                      <Text
                        className="text-[15px] text-indigo-A200"
                        size="txtInterSemiBold15"
                      >
                        Six Months
                      </Text>
                      <Text
                        className="leading-[160.00%] text-[13px] text-black-900_99 text-center"
                        size="txtInterMedium13Black90099"
                      >
                        <>
                          Levis D.
                          <br />
                          William K.
                          <br />
                          Shortan W.
                          <br />
                          Loise M.
                          <br />
                          Petter P.
                        </>
                      </Text>
                    </div>
                  </div>
                </div>
                <div
                  className="bg-cover bg-no-repeat flex sm:flex-1 flex-col h-[164px] items-end justify-end pl-3.5 py-3.5 w-[22%] sm:w-full"
                  style={{ backgroundImage: "url('images/img_group23.svg')" }}
                >
                  <div className="flex flex-col gap-[9px] items-end justify-start mt-0.5">
                    <Text
                      className="text-[15px] text-indigo-A200"
                      size="txtInterSemiBold15"
                    >
                      Year
                    </Text>
                    <Text
                      className="leading-[160.00%] text-[13px] text-black-900_99 text-center"
                      size="txtInterMedium13Black90099"
                    >
                      <>
                        Levis D.
                        <br />
                        William K.
                        <br />
                        Shortan W.
                        <br />
                        Loise M.
                        <br />
                        Petter P.
                      </>
                    </Text>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-2.5 items-center justify-start mt-[19px] w-[92%] md:w-full">
                <Button
                  className="border border-indigo-A200 border-solid cursor-pointer font-semibold min-w-[170px] text-center text-sm"
                  shape="round"
                  color="indigo_A200_21"
                >
                  Approve Hours
                </Button>
                <Button
                  className="border border-indigo-A200 border-solid cursor-pointer font-semibold min-w-[170px] text-center text-sm"
                  shape="round"
                  color="indigo_A200_21"
                >
                  Manage Category
                </Button>
              </div>
              <div className="flex flex-row gap-2.5 items-center justify-start mt-2.5 w-[92%] md:w-full">
                <Button
                  className="border border-indigo-A200 border-solid cursor-pointer font-semibold min-w-[170px] text-center text-sm"
                  shape="round"
                  color="indigo_A200_21"
                >
                  Manage Approvers
                </Button>
                <Input
                  name="groupSeventyFour"
                  placeholder="Manage Users"
                  className="font-semibold p-0 placeholder:text-indigo-A200 text-left text-sm w-full"
                  wrapClassName="border border-indigo-A200 border-solid w-[49%]"
                  shape="round"
                  color="indigo_A200_21"
                  size="xs"
                ></Input>
              </div>
              <Button
                className="cursor-pointer font-semibold min-w-[350px] mt-[177px] text-base text-center"
                shape="round"
                color="indigo_A200"
                variant="outline"
              >
                GENERATE REPORT
              </Button>
              <Button
                className="cursor-pointer font-semibold min-w-[350px] mt-[11px] text-base text-center"
                shape="round"
                color="indigo_A200"
              >
                SUBMIT
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesktopFivePage;
