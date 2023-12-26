import React, { useState, useRef } from 'react'
// import { Text } from  ".../Components/Atom/Text"
// import { Img } from ".../Components/Atom/Img"
import { API_URL } from '../../Constant';

import { Button, Img, Input, Line, Text } from "components";
import { Navigate } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { Flex } from 'antd';







const Register = () => {

  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);


  const myInputRef = React.createRef();
  // Use state to store form data
  const [formsData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    idCard: '',
    password: '',
    confirmPassword: '',
  });
  console.log("formdata", formsData)

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log("file")
  };

  // this function for get selected are 
  const [selectedCategories, setSelectedCategories] = useState([]);



  const  handleButtonClick2=()=>{
    navigate('/login')
  }



  const [buttonStates, setButtonStates] = useState(Array(3).fill(false)); // Assuming 3 buttons, adjust the size as needed

  const handleButtonClick = (index, value) => {
    setButtonStates((prevButtonStates) => {
      const newButtonStates = [...prevButtonStates];
      newButtonStates[index] = !newButtonStates[index];
      return newButtonStates;
    });
  
    setSelectedCategories((prevCategories) => {
      if (prevCategories.includes(value)) {
        // If category is already selected, remove it
        return prevCategories.filter((category) => category !== value);
      } else {
        // If category is not selected, add it
        return [...prevCategories, value];
      }
    });
  };
  
  // End here 

  const handleInputChange = (e) => {
    // Check if e and e.target are defined
    console.log("handle inpu cahe", e);
    if (e && e.target) {
      const { name, value } = e.target;


      // Check if name is defined before updating state
      if (name !== undefined) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("event", e.target[0].value);
   
    const formsDATA = new FormData();
    formsDATA.append('name', e.target[0].value);
    formsDATA.append('email', e.target[1].value);
    formsDATA.append('groupThree', e.target[2].value);
    formsDATA.append('groupFour', e.target[3].value);
    formsDATA.append('groupFive', e.target[4].value);
    formsDATA.append('password', e.target[5].value);
    formsDATA.append('cpassword', e.target[5].value); 

    formsDATA.append('selectedCategories', JSON.stringify(selectedCategories));

    console.log(formsDATA);
    // formsData.append('selectedFile',selectedFile);
    console.log(selectedFile, "selected file");
    formsDATA.append('photo', selectedFile);

    // Check the console to see if the data is correctly appended
    console.log(formsDATA.get('name'));


    const formDataJson = {};
    for (const [key, value] of formsDATA.entries()) {
      formDataJson[key] = value;
    }


    console.log(formDataJson, "finrn data")




    try {

      const response = await fetch(`${API_URL}/activity/Register`, {
        method: 'POST',
        body: formsDATA,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
        navigate("/login");
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }


  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="bg-white-A700 flex flex-col font-inter items-center justify-end mx-auto p-[46px] md:px-10 sm:px-5 w-full">
          <div className="bg-white-A700 flex flex-col gap-[15px] justify-start mt-[27px] md:px-5 rounded-[5px] shadow-bs2 w-[31%] md:w-full">
            <div className="flex flex-col items-start justify-start md:ml-[0] ml-[45px] w-[90%] md:w-full">

              <div className="md:h-[207px] h-[160px] w-full">
                {/* <div style={{marginBottom:"" ,display:"flex",justifyContent:"center" ,height:"49%"}}>

                Let’s Get Started!
                </div> */}
                 <Text
                  className=" left-[2%] text-center  text-black-900_a2  mr-[12%] "
                  size="txtInterSemiBold24"
                >
                 Let’s Get Started!
                </Text>

                {/* <Text
                  className="absolute left-[17%] text-2xl md:text-[22px] text-black-900 sm:text-xl top-[15%]"
                  size="txtInterSemiBold24"
                >
                </Text> */}
                <Text
                  className=" left-[5%] text-[15px] text-black-900_a2 top-[-16%] "
                  size="txtInterRegular15"
                >
                  Create an account to access all features
                </Text>

                <Input

                  name="name"
                  className="p-0 placeholder:text-gray-600 text-[15px] text-left w-full"
                  wrapClassName="border border-indigo-500_19 border-solid bottom-[28%] flex left-[0] mb-[20px] rounded-[25px] w-[89%]"
                  type="text"
                  placeholder="Name"
                  onChange={handleInputChange}
                  prefix={
                    <div className="mt-px mb-0.5 mr-[19px] w-[15px]  top-[0] bottom-[1%] right-[5%] reletive">
                      <Img
                        className="absolute my-auto"
                        src="images/img_lock.svg"
                        alt="lock"
                      />
                    </div>
                  }
                  color="white_A700"
                />

                <Input
                  name="groupTwo"
                  placeholder="Email"
                  className="p-0 placeholder:text-gray-600 text-[15px] text-left w-full "
                  wrapClassName="border border-indigo-500_19 border-solid bottom-[0] flex left-[0] rounded-[25px] w-[89%]"
                  type="email"
                  prefix={
                    <div className="mt-[3px] mb-0.5 mr-[18px] sm:w-full sm:mx-0 w-[5%]  right-[5%] reletive inset-y-[1%]">
                      <Img
                        className="absolute my-auto"
                        src="images/img_vector_gray_600.svg"
                        alt="Vector"
                      />
                    </div>
                  }
                  color="white_A700"
                  onChange={handleInputChange}
                ></Input>
              </div>
              <Input
                name="groupThree"
                placeholder="Phone"
                className="p-0 placeholder:text-gray-600 text-[15px] text-left w-full"
                wrapClassName="border border-indigo-500_19 border-solid flex mt-5 rounded-[25px] w-[89%]"
                type="number"

                prefix={
                  <div className="h-[17px] mb-px mr-[17px] w-[17px] bg-gray-1">
                    <Img
                      className="absolute my-auto my-auto"
                      src="images/img_call.svg"
                      alt="call"
                    />
                  </div>
                }
                color="white_A700"

                onChange={handleInputChange}

              ></Input>
              <Input
                name="groupFour"
                placeholder="Address"
                className="p-0 placeholder:text-gray-600 text-[15px] text-left w-full"
                wrapClassName="border border-indigo-500_19 border-solid flex mt-5 rounded-[25px] w-[89%]"
                prefix={
                  <Img
                    className="mr-[21px] my-px"
                    src="images/img_linkedin_gray_600.svg"
                    alt="linkedin"
                  />
                }
                color="white_A700"
                onChange={handleInputChange}
              ></Input>
              <Input
                name="groupFive"
                placeholder="Adhar Card / National Id"
                className="p-0 placeholder:text-gray-600 text-[15px] text-left w-full"
                wrapClassName="border border-indigo-500_19 border-solid flex mt-5 rounded-[25px] w-[89%]"
                prefix={
                  <div className="mt-px mb-[3px] mr-4 sm:w-full sm:mx-0 w-[6%] ">
                    <Img
                      className="my-auto"
                      src="images/img_television.svg"
                      alt="television"
                    />
                  </div>
                }
                color="white_A700"
                onChange={handleInputChange}
              ></Input>

              <Input
                name="password"
                placeholder="Password"
                className="p-0 placeholder:text-gray-600 text-[15px] text-left w-full"
                wrapClassName="border border-indigo-500_19 border-solid flex mt-5 rounded-[25px] w-[89%]"
                prefix={
                  <div className="mt-px mb-[3px] mr-4 sm:w-full sm:mx-0 w-[6%] ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-key" viewBox="0 0 16 16">
                      <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8m4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5" />
                      <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                    </svg>
                  </div>
                }
                color="white_A700"
                onChange={handleInputChange}
              ></Input>

              <Input
                name="cpassword"
                placeholder="Conferm Password"
                className="p-0 placeholder:text-gray-600 text-[15px] text-left w-full"
                wrapClassName="border border-indigo-500_19 border-solid flex mt-5 rounded-[25px] w-[89%]"
                prefix={
                  <div className="mt-px mb-[3px] mr-4 sm:w-full sm:mx-0 w-[6%] ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-key" viewBox="0 0 16 16">
                      <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8m4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5" />
                      <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                    </svg>
                  </div>
                }
                color="white_A700"
                onChange={handleInputChange}
              ></Input>



              <div className="bg-gray-50_01 border border-dashed border-indigo-500 flex flex-col items-center justify-end mt-[35px] p-2 rounded-[5px] shadow-bs1 w-[89%] md:w-full">
                <div className="flex flex-row gap-2.5 items-start justify-center mt-0.5 w-[45%] md:w-full">





                  <Text
                    className="text-[8px] text-indigo-A200"
                    size="txtInterMedium13"
                  // onChange={handleFileChange}

                  >
                    <input className='flex flex-row gap-2.5 items-start justify-center mt-0.5 w-[45%] md:w-full'
                      name='file'
                      type="file"
                      id="photo"
                      accept="image/*"
                      onChange={handleFileChange}
                      // label="Upload Your Photo"
                      



                    />
                   
                    Upload Your Photo
                  </Text>
                </div>
              </div>
              <div className="flex flex-col items-start justify-start mt-7 w-[89%] md:w-full">
                <Text
                  className="text-base text-gray-900"
                  size="txtInterSemiBold16Gray900"
                >
                  Select Interest areas
                </Text>
                <div className="flex flex-row gap-[15px] items-center justify-between mt-[13px] w-full">
                  <Button  type="button"
                      className={` border-solid cursor-pointer font-medium min-w-[155px] text-center text-sm ${buttonStates[0] ? 'border border-indigo-A200' : ''
                        }`}
                    shape="round"
                    // color="gray_50_01"
                    name="planting_tree"
                    onClick={() => handleButtonClick(0,"Planting tree")}



                  >
                    Planting tree
                  </Button>
                  <Button
                    type="button"
                    className={` border-solid cursor-pointer font-medium min-w-[155px] text-center text-sm ${buttonStates[1] ? 'border border-indigo-A200' : ''
                      }`}
                    shape="round"
                    name="Teaching kids"
                    onClick={() => handleButtonClick(1, "Teaching kids")}
                  >
                    Teaching kids
                  </Button>

                </div>
                <div className="flex flex-row gap-[15px] items-center justify-between mt-4 w-full">

                  <div className="flex flex-col items-center justify-start mr-[3px] mt-0.5">

                    <Button
                      type="button"
                      className={` border-solid cursor-pointer font-medium min-w-[155px] text-center text-sm ${buttonStates[2] ? 'border border-indigo-A200' : ''
                        }`}
                      shape="round"
                      name='local Cleaning'
                      onClick={() => handleButtonClick(2, "  Feeding the poor")}

                    >
                      Feeding the poor
                    </Button>
 
                  </div>
                  <Button
                      type="button"
                      className={` border-solid cursor-pointer font-medium min-w-[155px] text-center text-sm ${buttonStates[3] ? 'border border-indigo-A200' : ''
                        }`}
                    shape="round"
                    name='local Cleaning'
                    onClick={() => handleButtonClick(3,"Local cleaning")}

                  >
                    Local cleaning
                  </Button>
                </div>
                <div className="flex flex-row gap-3.5 items-center justify-between mt-4 w-full">
                  <Button  type="button"
                      className={` border-solid cursor-pointer font-medium min-w-[155px] text-center text-sm ${buttonStates[4] ? 'border border-indigo-A200' : ''
                        }`}
                    shape="round"
                    name="Blood Donation"
                    onClick={() => handleButtonClick(4,"Blood Donation")}


                  >
                    Blood Donation
                  </Button>
                  <Button
                    type="button"
                    className={` border-solid cursor-pointer font-medium min-w-[155px] text-center text-sm ${buttonStates[5] ? 'border border-indigo-A200' : ''
                      }`}
                    shape="round"
                    onClick={() => handleButtonClick(5,"Running a marathon")}

                    name="Runnung a marathon"

                  >
                    Running a marathon
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex mr-11 relative w-[90%] sm:w-full">
              {/* <div className="bg-indigo-A200_5f h-[50px] my-auto rounded-[85px] w-[46%]"></div> */}
              <Button

                className="border border-indigo-500_19 border-solid cursor-pointer font-semibold min-w-[100%] ml-[19px] h-[30%] mt-8 rounded-[25px] shadow-bs text-base text-center z-[1]"
                color="indigo_A200"
                size="md"
                type="submit"
                onSubmit={handleSubmit}
              >
                Create Account
              </Button>

              <Text
                className=" ml-[-300px] mr-[37 px] mt-auto text-black-900 text-sm z-[1] mt-[35%] "
                size="txtInterMedium14Black900"
                // style={{display:"flex", justifyContent:"center"}}
              >
              
                <span className="text-black-900 font-inter text-left font-medium "  >
                  Already have an account ?
                </span>
                <span className="text-indigo-A200 font-inter text-left font-medium" onClick={handleButtonClick2}>
                  Login here
                </span>
           
              </Text>

            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Register;
const parentRef = React.createRef();
