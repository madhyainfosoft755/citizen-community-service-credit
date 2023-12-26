import React,{useEffect,useState} from "react";

import { Button, Img, List, Text } from "components";
import { API_URL } from "Constant";
import { Card, Avatar } from 'antd';
import { useNavigate } from "react-router-dom";
import Location from 'pages/Location/Location'
import { useAuth } from 'components/AuthProvider/AuthProvider'




 
const Createpost = ( ) => {

  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { authenticated, setAuthenticated } = useAuth();


  




  useEffect(() => {
    // Function to get and format the current date

    const getCurrentDate = () => {
      const dateObj = new Date();
      const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString('default', {
        month: 'short',
      })} ${dateObj.getFullYear()}`;
      setCurrentDate(formattedDate);
    };

    // Call the function when the component mounts
    getCurrentDate();
  }, []);


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

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log("file")
  };
  const [selectedVideo, setSelectedVideo] = useState(null);

const handleVideoChange = (e) => {
  const videoFile = e.target.files[0];
  setSelectedVideo(videoFile);
};


  const handleLocationChange = (address) => {
    setFormData((prevData) => ({
      ...prevData,
      address: address,
    }));
    // console.log(location)
  };

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


  useEffect(() => {
    // Check if both token and user key are present in local storage
    const token = localStorage.getItem("token");
    const userKey = localStorage.getItem("userKey");

    if (!token || !userKey) {
      // Redirect to the login page if either token or user key is missing
      navigate("/login");
    }

    // You may also want to check the validity of the token here if needed

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures that this effect runs only once on mount

  const handleLogout = () => {
    // Clear authentication status, remove token and user key, and redirect to the login page
    setAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userKey");
    navigate("/login");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();



   
    // Create FormData object
    const formsDATA = new FormData();
    // formsDATA.append('selectedActivity', selectedActivity);
    formsDATA.append('selectedCategories', JSON.stringify(selectedCategories));

    formsDATA.append('date', currentDate);
    formsDATA.append('photo', selectedFile);
    formsDATA.append('video', selectedVideo); 


   
    console.log(formsDATA.get('name')); 
    console.log('formDatafddsfjdsk',formsDATA); 


    const formDataJson = {};
    for (const [key, value] of formsDATA.entries()) {
      formDataJson[key] = value;
    }

    console.log(formDataJson, "form data")
    
    try {

      const response = await fetch(`${API_URL}/activity/CreateActivity`, {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        body: formsDATA,
        // body:formsDATA.stringify()
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
        // navigate("");
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
 

  return (
    <>
    {authenticated && (
       <form onSubmit={handleSubmit}>
      <div className="bg-white-A700 flex flex-col font-inter items-center justify-start mx-auto p-[75px] md:px-10 sm:px-5 w-full">
        <div className="bg-white-A700 flex flex-col items-center justify-start mb-[138px] pb-[26px] md:px-5 rounded-[5px] shadow-bs2 w-[33%] md:w-full">
          <div className="flex flex-col gap-5 items-center justify-start w-full">
            <div className="bg-gray-50 flex flex-row items-center justify-between p-7 sm:px-5 w-full">
              <div className="flex flex-row gap-4 items-center justify-center ml-[5px]">
                <Img
                  className="h-[58px] md:h-auto rounded-[50%] w-[58px]"
                  src='' 
                  alt="ellipseThree"
                />
                <div className="flex flex-col items-center justify-start w-3/5">
                  <div className="flex flex-col items-start justify-start w-full">
                    <Text
                      className="text-base text-gray-900"
                      size="txtInterSemiBold16Gray900"
                    >
                    name
                      
                      
                    </Text>
                    <Text
                      className="mt-1 text-gray-900_b2 text-xs"
                      size="txtInterMedium12"
                    >
                    {/* {userData.id} */}
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
            <div className="flex flex-col items-start justify-start w-[85%] md:w-full">
              <Button
                className="!text-indigo-500 cursor-pointer font-semibold leading-[normal] min-w-[350px] text-center text-sm"
                shape="round"
                size="md"
              >
                + Add New Activity
              </Button>
              <Text
                className="mt-5 text-base text-gray-900"
                size="txtInterSemiBold16Gray900"
              >
                Select Category
              </Text>
              <div className="flex flex-row gap-4 items-center justify-between mt-[18px] w-full">
                <Button type="button"
                      className={` border-solid cursor-pointer font-medium min-w-[155px] text-center text-sm ${buttonStates[0] ?  'border border-indigo-A200 ' : ''
                        }`}
                    shape="round"
                    // color="gray_50_01"
                    name="Gardning"
                  
                 
                  // color="gray_50_01"
                  onClick={() => handleButtonClick(0,"Gardening")}
                >
                  Gardening
                </Button>
                <Button  type="button"
                      className={` border-solid cursor-pointer font-medium min-w-[155px] text-center text-sm ${buttonStates[1] ? 'border border-indigo-A200  ' : ''
                        }`}
                    shape="round"
                    // color="gray_50_01"
                    name="Teching Poor"
                    onClick={() => handleButtonClick(1,"Teching Poor")}
                >
                  Teaching Poor
                </Button>
              </div>
              <div className="flex flex-row gap-4 items-center justify-between mt-4 w-full">
                <Button type="button"
                  className={` border-solid cursor-pointer font-medium min-w-[155px] text-center text-sm ${buttonStates[2] ? 'border border-indigo-A200' : ''
                }`}
                  shape="round"
                  onClick={() => handleButtonClick(2,"Cleaning")}
                >
                  Cleaning
                </Button>
                <Button type="button"
                  className={` border-solid cursor-pointer font-medium min-w-[155px] text-center text-sm ${buttonStates[3] ? 'border border-indigo-A200' : ''
                }`}
                  shape="round"
                  onClick={() => handleButtonClick(3,"Planting a tree")}
                >
                  Planting a tree
                </Button>
              </div>
              <div className="flex flex-row gap-4 items-center justify-between mt-4 w-full">
                <Button  type="button"
                  className={` border-solid cursor-pointer font-medium min-w-[155px] text-center text-sm ${buttonStates[4] ? 'border border-indigo-A200' : ''
                }`}
                  shape="round"
                  onClick={() => handleButtonClick(4,"Marathon")}

                >
                  Marathon
                </Button>
                <Button type="button"
                  className={` border-solid cursor-pointer font-medium min-w-[155px] text-center text-sm ${buttonStates[5] ? 'border border-indigo-A200' : ''
                }`}
                  shape="round"
                  onClick={() => handleButtonClick(5,"Social Activities")}


                >
                  Social Activities
                </Button>
              </div>
              <div className="flex flex-row gap-2.5 items-center justify-between mt-[30px] w-full">
                <Button 
                  className="cursor-pointer flex items-center justify-center min-w-[170px]"
                  leftIcon={
                    <div className="mb-[3px] mr-[9px] bg-indigo-A200">
                      <Img src="images/img_linkedin.svg" alt="linkedin" />
                    </div>
                  }
                  shape="round"
                  color="blue_50"
                >
                  <div className="font-medium leading-[normal] text-[15px] text-left ">
                    <Location  onLocationChange={handleLocationChange}/>
                    
                  </div>
                </Button>
                <Button
                  className="cursor-pointer flex items-center justify-center min-w-[170px]"
                  leftIcon={
                    <div className="h-4 mb-[3px] mr-2.5 w-4 bg-indigo-A200">
                      <Img
                        className="h-4"
                        src="images/img_calendar.svg"
                        alt="calendar"
                      />
                    </div>
                  }
                  shape="round"
                  color="blue_50"
                >
                  <div className="font-medium leading-[normal] text-[15px] text-left">
                  {currentDate}
                  </div>
                </Button>
              </div>
              <List
                className="sm:flex-col flex-row gap-4 grid grid-cols-2 justify-center mt-6 w-full"
                orientation="horizontal"
              >
                <div className="flex flex-1 flex-col gap-[9px] items-start justify-start w-full">
                  <Text
                    className="text-base text-gray-900"
                    size="txtInterSemiBold16Gray900"
                  >
                    Photos
                  </Text>
                  <div className="bg-gray-50_01 border border-dashed border-indigo-500 flex flex-col items-center justify-end p-2 rounded-[5px] shadow-bs1 w-full">
                    <div className="flex flex-row gap-2.5 items-start justify-center mt-0.5 w-[44%] md:w-full">
                    

                    
                 

                 
                      <Text
                        className="text-[13px] text-indigo-A200"
                        size="txtInterMedium13"
                      >   <input className="bg-gray-50_01  flex flex-col items-center justify-end p-2 rounded-[5px] shadow-bs1 w-full"  
                      name='file'
                      type="file"
                      id="photo"
                      accept="image/*"
                      onChange={handleFileChange}
                   



                    />
                        {/* Upload */}
                      </Text>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2.5 items-start justify-start w-full">
                  <Text
                    className="text-base text-gray-900"
                    size="txtInterSemiBold16Gray900"
                  >
                    Videos
                  </Text>
                  <div className="bg-gray-50_01 border border-dashed border-indigo-500 flex flex-col items-center justify-end p-2 rounded-[5px] shadow-bs1 w-full">
                    <div className="flex flex-row gap-2.5 items-start justify-center mt-0.5 w-[44%] md:w-full">
                      {/* <Img
                        className="h-3 w-3"
                        src="images/img_twitter.svg"
                        alt="twitter"
                      /> */}
                         
                          
                           

                  
                      <Text
                        className="text-[13px] text-indigo-A200"
                        size="txtInterMedium13"
                      ><input  className="bg-gray-50_01  flex flex-col items-center justify-end p-2 rounded-[5px] shadow-bs1 w-full"
                      type="file"
                      id="video"
                      accept="video/*"
                      onChange={handleVideoChange}
                    />
                        {/* Upload */}
                      </Text>
                    </div>
                  </div>
                </div>
              </List>
              <Text
                className="mt-[27px] text-base text-gray-900"
                size="txtInterSemiBold16Gray900"
              >
                Add Hours Spent
              </Text>
              <Button
                className="cursor-pointer font-semibold min-w-[350px] mt-[67px] text-base text-center"
                shape="round"
                color="indigo_A200"
               
              >
                SUBMIT
              </Button>


            </div>
            
          </div>
        </div>
      </div>
      <Button
        className="cursor-pointer font-semibold min-w-[350px] mt-[67px] text-base text-center"
        shape="round"
        color="indigo_A200"
        onClick={handleLogout} // Add logout functionality
      >
        LOGOUT
      </Button> 
 
        
        
      </form>
     
    
  )}
    </>
  );
};

export default Createpost;
