import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { API_URL } from "Constant";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./slider.css";
import PopupComponent from "components/popup";
import SplashScreen from "components/Splash Screen/SplashScreen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const Slider1 = ({ items, isPopUpVisible, setIsPopUpVisible, setSelectedPost, selectedPost }) => {
  const [locationData, setLocationData] = useState([]);
  const [showSplashScreen, setShowSplashScreen] = useState(true); // State to control splash screen visibility
  // console.log("kya endrose aa rha hai", items)

  useEffect(() => {
    const fetchData = async () => {
      const updatedItems = await Promise.all(
        items.map(async (item) => {
          try {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${item.latitude},${item.longitude}&key=${process.env.REACT_APP_GoogleGeocode}`
            );
            // console.log("ye hai location ka data",response)

            if (response.data && response.data.results.length > 0) {
              const { address_components } = response.data.results[0];
              const cityData = address_components.find(component =>
                component.types.includes("administrative_area_level_3")
              );
              const politicalData = address_components.find(component =>
                component.types.includes("administrative_area_level_1")
              );

              const city = cityData ? cityData.long_name : "Unknown City";
              const state = politicalData ? politicalData.long_name : "Unknown State";

              return { ...item, city, state };
            }
          } catch (error) {
            console.error("Error fetching location data:", error);
          }
        })
      );
      setLocationData(updatedItems);
    };

    fetchData();
  }, [items]);

    const handleViewPost = (post) => {
    setSelectedPost(post);
    setIsPopUpVisible(true);
    console.log("kya hai post", post)
  };

  // console.log("location data", locationData)
  const settings = {
    infinite: items.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    rtl: true,
  };

  return (
    <div className="w-full h-full flex flex-col justify-between border-none outline-none">


      {showSplashScreen ? (
        <SplashScreen onAnimationEnd={() => setShowSplashScreen(false)} /> // Handle the end of the splash screen animation
      ) : (
        locationData && locationData.length > 0 && items ? (
          <Slider {...settings}>
            {locationData.map((item, index) => (
              <div className="flex flex-col items-center justify-between gap-4" key={item.id}>
                <div className="w-full h-[200px] sm:h-52 sm:h-50 md:h-full flex items-center justify-center bg-gray-50 overflow-hidden">
                  {item && item.photos && (
                    <img
                      className="w-8/12 h-auto object-cover object-top"
                      src={`${API_URL}/image/${item.photos}`}
                      alt={`Photo ${item.id}`}
                      onClick={() => handleViewPost(item)}
                    />
                  )}
                </div>
                <div className="w-full h-48 py-2 px-2 sm:p-1 md:p-0 mt-2 sm:mt-1 flex flex-col gap-2 sm:gap-2 items-center justify-between overflow-auto scroller"   >
                  <div className="w-full h-2/5 flex items-center justify-between gap-2 ">
                    <div className="h-full flex flex-col items-start justify-center ">
                      <h3 className="text-gray-500 mb-1 font-semibold underline">Activity</h3>
                      <h3 className="text-left whitespace-nowrap">{item.category}</h3>
                    </div>

                    <div className="h-full flex flex-col items-end justify-center">
                      <h3 className="text-gray-500 font-semibold  mb-1 underline">Location</h3>
                      <h3 className="flex flex-nowrap text-right ">
                        {item.city},{item.state}
                      </h3>
                    </div>
                  </div>
                  <div className="w-full h-2/5 flex items-center justify-between gap-2 ">
                    <div className="h-full flex flex-col items-start justify-center ">
                      <h3 className="text-gray-500 mb-1 font-semibold underline">Date</h3>
                      <h3 className="text-left whitespace-nowrap">{item.Date}</h3>
                    </div>

                    <div className="h-full flex flex-col items-end justify-center">
                      <h3 className="text-gray-500 font-semibold  mb-1 underline">Start Time</h3>
                      <h3 className="flex flex-nowrap text-right ">
                        {item.fromTime}
                      </h3>
                    </div>
                  </div>

                  <div className="w-full h-2/5 flex items-center justify-between gap-2 ">
                    <div className="flex flex-col items-start justify-center">
                      <h3 className="text-gray-500 mb-1 font-semibold underline">Total Time</h3>
                      <h3 className=" ">{item.totalTime}</h3>
                    </div>

                    <div className=" flex flex-col items-end justify-center">
                      <h3 className="text-gray-500 mb-1 font-semibold underline">Endorsed</h3>
                      <div className="flex items-center ">

                      {[...Array(3)].map((_, i) => (
                          <FontAwesomeIcon
                            key={i}
                            icon={faCircleCheck}
                            className={`mx-1 ${item.endorsementCounter > i ? 'text-green-500 -ml-1' : 'text-red-500 -ml-1'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-2/5 flex items-center justify-between gap-2">
                    <div className=" flex flex-col items-start justify-center">
                      <h3 className="text-gray-500 mb-1 font-semibold underline">Approved</h3>
                      <h3 className="">{item.approved ? "YES" : item.rejected ? "NO" : "Waiting..."}</h3>
                    </div>

                    <div className="flex flex-col items-end justify-center">
                      <h3 className="text-gray-500 mb-1 font-semibold underline">Images</h3>
                      <button onClick={() => handleViewPost(item)} className="text-blue-600 underline">View</button>
                    </div>
                  </div>
                  {item && item.rejectionReason && (
                    <div className="w-full  h-1/6" >
                      <h1 className="text-gray-500 mb-1 font-semibold underline">Comments from Approver</h1>
                      <h1>{item.rejectionReason}</h1>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img
              className="w-1/2 h-auto object-cover object-center"
              src="images/nopost.svg"
              alt="No posts available for endorsement"
            />
          </div>
        )
      )}


    </div>
  );
};

export default Slider1;
