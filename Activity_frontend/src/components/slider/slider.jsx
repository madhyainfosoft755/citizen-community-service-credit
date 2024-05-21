import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { API_URL } from "Constant";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./slider.css";
import PopupComponent from "components/popup";


const Slider1 = ({ items , isPopUpVisible, setIsPopUpVisible, setSelectedPost, selectedPost }) => {
  const [locationData, setLocationData] = useState([]);
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
    <div className="w-full h-full   border-none outline-none">

      {locationData && locationData.length > 0 && items ? (
        <Slider {...settings}>
          {locationData.map((item, index) => (
            <div key={item.id}>
              <div className="h-44 sm:h-52 sm:h-50">
                {item && item.photos && (
                  <img
                    className="w-full h-full object-cover object-top"
                    src={`${API_URL}/image/${item.photos}`}
                    alt={`Photo ${item.id}`}
                  />
                )}
              </div>
              <div className="h-full py-4 mt-2 grid grid-rows-3 gap-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-34 ml-3 flex flex-col items-center justify-center">
                    <h3 className="text-gray-500 mb-1 font-semibold">Activity</h3>
                    <h3 className="text-center ">{item.category}</h3>
                  </div>

                  <div className=" flex flex-col items-end mr-4 justify-center">
                    <h3 className="text-gray-500 font-semibold  mb-1">Location</h3>
                    <h3 className="flex flex-wrap ">
                      {item.city},{item.state}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="w-24 flex flex-col items-center justify-center">
                    <h3 className="text-gray-500 mb-1 font-semibold">Total Time</h3>
                    <h3 className=" ">{item.totalTime}</h3>
                  </div>

                  <div className="w-24 flex flex-col items-center justify-center">
                    <h3 className="text-gray-500 mb-1 font-semibold ">Endorsed</h3>
                    <h3 className="">{item.endorsementCounter >= 3 ? "YES" : "NO"}</h3>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="w-24 flex flex-col items-center justify-center">
                    <h3 className="text-gray-500 mb-1 font-semibold ">Approved</h3>
                    <h3 className="">{item.approved == true ? "YES" : "NO"}</h3>
                  </div>

                  <div className="w-24 flex flex-col items-center justify-center">
                    <h3 className="text-gray-500 mb-1 font-semibold">Images</h3>
                    <button onClick={() => handleViewPost(item)} className="text-blue-600 underline">View</button>
                  </div>
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
      )}
     
    </div>
  );
};

export default Slider1;
