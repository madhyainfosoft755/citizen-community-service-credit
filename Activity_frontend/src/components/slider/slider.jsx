import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { API_URL } from "Constant";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slider1 = ({ items }) => {
  const settings = {
    // dots: true,
    infinite: items.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // autoplay: true,
    autoplaySpeed: 5000,
    rtl:true
  };

  const getAddressDetails = (address) => {
    console.log(address)
    const addressParts = address.split(",");
    const cityState = addressParts[0];
    const [city, state] = cityState.split(",");
    return { city, state };
  };
  

  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  //   return date.toLocaleDateString("en-GB", options); // Format the date as DD/MM/YYYY
  // };
  return (
    <div className="w-full h-full">
      <Slider {...settings}>
        {items.map((item, index) => (
          <div key={item.id}>
            <div className="h-52 overflow-hidden ">
              {item.photos && (
                <img
                  className="w-full h-full object-cover object-top"
                  src={`${API_URL}/image/${item.photos}`}
                  alt={`Photo${item.id}`}
                />
              )}
            </div>
            <div className="h-full py-1 grid grid-rows-3 gap-4 ">
              <div className="flex items-center justify-between  gap-2">
                <div className="w-34 ml-3 flex flex-col items-center justify-center">
                  <h3 className="underline mb-1">Activity</h3>
                  <h3 className="text-center">{item.category}</h3>
                </div>

                <div className="w-44 flex flex-col items-end mr-4 justify-center">
                  <h3 className="underline mb-1">Location</h3>
                  {item.location && (
                    <h3 className="w-full text-right">{getAddressDetails(item.location).city}</h3>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between  gap-2">
                <div className="w-24 flex flex-col items-center justify-center">
                  <h3 className="underline mb-1">Total Time</h3>
                  <h3>{item.totalTime}</h3>
                </div>

                <div className="w-24 flex flex-col items-center justify-center">
                  <h3 className="underline mb-1">Endorsed</h3>
                  <h3>NO</h3>
                </div>
              </div>

              <div className="flex items-center justify-between  gap-2">
                <div className="w-24 flex flex-col items-center justify-center">
                  <h3 className="underline mb-1">Approved</h3>
                  <h3>NO</h3>
                </div>

                <div className="w-24 flex flex-col items-center justify-center">
                  <h3 className="underline mb-1">Images</h3>
                  <button className="text-blue-600">View</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Slider1;
