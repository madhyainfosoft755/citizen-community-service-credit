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
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Share from "components/shareComponent";

const Slider1 = ({ items = [], isPopUpVisible, setIsPopUpVisible, setSelectedPost, selectedPost }) => {
  const [locationData, setLocationData] = useState([]);
  const [showSplashScreen, setShowSplashScreen] = useState(true); // State to control splash screen visibility
  // console.log("kya endrose aa rha hai", items)

  const getFirstPhoto = (photos) => {
    if (!photos) return null;

    try {
      const parsedPhotos = JSON.parse(photos);
      return Array.isArray(parsedPhotos) ? parsedPhotos[0] : parsedPhotos;
    } catch (error) {
      return photos;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!Array.isArray(items) || items.length === 0) {
        setLocationData([]);
        return;
      }

      const updatedItems = await Promise.all(items &&
        items.map(async (item) => {
          try {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${item.latitude},${item.longitude}&key=${process.env.REACT_APP_GoogleGeocode}`
            );
            // console.log("ye hai location ka data",response)

            if (response.data && response.data.results.length > 0) {

              // console.log("what is the response data", response)
              const { address_components } = response.data.results[0];
              const cityData = address_components.find(component =>
                component.types.includes("administrative_area_level_3")
              );
              const politicalData = address_components.find(component =>
                component.types.includes("administrative_area_level_1")
              );

              const city = cityData ? cityData.long_name : "Unknown City";
              const state = politicalData ? politicalData.long_name : "Unknown State";

              const firstPhoto = getFirstPhoto(item.photos);

              return { ...item, city, state, firstPhoto };
            }
          } catch (error) {
            console.error("Error fetching location data:", error);
          }
        })
      );
      setLocationData(updatedItems.filter(Boolean));
    };

    fetchData();
  }, [items]);

  const handleViewPost = (post) => {
    setSelectedPost(post);
    setIsPopUpVisible(true);
    // console.log("kya hai post", post)
  };

  // console.log("location data", locationData)
  const settings = {
    infinite: items.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    rtl: true,
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // console.log("data of posts",locationData);

  return (
    <div className="relative w-full h-full flex flex-col justify-between border-none outline-none overflow-hidden">


      {showSplashScreen ? (
        <SplashScreen onAnimationEnd={() => setShowSplashScreen(false)} /> // Handle the end of the splash screen animation
      ) : (
        locationData && locationData.length > 0 && items ? (
          <Slider {...settings}>
            {locationData.map((item, index) => (

              <div key={index} className="relative">
                <div className=" relative w-full h-1/2 sm:h-1/2  md:h-1/2 flex items-center justify-center bg-gray-50">
                  {item && item.firstPhoto && (
                    <img
                      className="w-auto h-5/6 object-cover object-top rounded"
                      src={`${API_URL}/image/${item.firstPhoto}`}
                      alt="First photo"
                      onClick={() => handleViewPost(item)}
                    />
                  )}

                  {item.organization !== undefined && <h1 className="absolute top-1 right-2  text-lg font-bold">{item.organization}</h1>}
                </div>
                {item && item.approved && <div className="flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-3 py-5">
                  <Share postId={item && item.id} />

                </div>
                }
                <div className="w-full h-1/2 py-2 px-2 sm:p-1 md:p-0 mt-2 sm:mt-1 flex flex-col gap-2 sm:gap-0 items-center justify-between overflow-auto scroller">
                  <div className="w-full h-2/5 flex items-center justify-between gap-2 ">
                    <div className="h-full flex flex-col items-start justify-center ">
                      <h3 className="text-gray-500 mb-1 font-semibold underline">Activity</h3>
                      <h3 className="text-left whitespace-nowrap">{item && item.category}</h3>
                    </div>

                    <div className="h-full flex flex-col items-end justify-center">
                      <h3 className="text-gray-500 font-semibold  mb-1 underline">Location</h3>
                      <h3 className="flex flex-nowrap text-right ">
                        {item && item.city},{item && item.state}
                      </h3>
                    </div>
                  </div>
                  <div className="w-full h-2/5 flex items-center justify-between gap-2 ">
                    <div className="h-full flex flex-col items-start justify-center ">
                      <h3 className="text-gray-500 mb-1 font-semibold underline">Date</h3>
                      <h3 className="text-left whitespace-nowrap">{formatDate(item && item.Date)}</h3>
                    </div>

                    <div className="h-full flex flex-col items-end justify-center">
                      <h3 className="text-gray-500 font-semibold  mb-1 underline">Start Time</h3>
                      <h3 className="flex flex-nowrap text-right ">
                        {item && item.fromTime}
                      </h3>
                    </div>
                  </div>

                  <div className="w-full h-2/5 flex items-center justify-between gap-2 ">
                    <div className="flex flex-col items-start justify-center">
                      <h3 className="text-gray-500 mb-1 font-semibold underline">Total Time</h3>
                      <h3 className=" ">{item && item.totalTime}</h3>
                    </div>

                    <div className=" flex flex-col items-end justify-center">
                      <h3 className="text-gray-500 mb-1 font-semibold underline">Endorsed</h3>
                      <div className="flex items-center ">

                        {[...Array(1)].map((_, i) => (
                          <FontAwesomeIcon
                            key={i}
                            icon={item && item.endorsementCounter > i ? faCircleCheck : faCircleXmark}
                            className={`mx-1 ${item && item.endorsementCounter > i ? 'text-green-500 -ml-1' : 'text-red-500 -ml-1'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-2/5 flex items-center justify-between gap-2">
                    <div className=" flex flex-col items-start justify-center">
                      <h3 className="text-gray-500 mb-1 font-semibold underline">Approved</h3>
                      <h3 className="">{item && item.approved ? "YES" : item && item.rejected ? "NO" : "Waiting..."}</h3>
                    </div>

                    <div className="flex flex-col items-end justify-center">
                      <h3 className="text-gray-500 mb-1 font-semibold underline">Images</h3>
                      <button onClick={() => handleViewPost(item)} className="text-blue-600 underline">View</button>
                    </div>
                  </div>
                  <div className="w-full h-2/5 flex items-center justify-between gap-2">
                    {item && item.rejectionReason && (
                      <div className="flex flex-col items-start justify-center" >
                        <h1 className="text-gray-500 mb-1 font-semibold underline">Comments from Approver</h1>
                        <h1>{item.rejectionReason}</h1>
                      </div>

                    )}
                  </div>
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
