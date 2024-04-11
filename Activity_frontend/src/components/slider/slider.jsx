import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { API_URL } from "Constant";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./slider.css";

const Slider1 = ({ items }) => {
  const [locationData, setLocationData] = useState([]);
  console.log("kya endrose aa rha hai", items)

  useEffect(() => {
    const fetchData = async () => {
      const updatedItems = await Promise.all(
        items.map(async (item) => {
          try {
            const response = await axios.get(
              `https://api.opencagedata.com/geocode/v1/json?q=${item.latitude}+${item.longitude}&key=${process.env.REACT_APP_OpenCagePass}`
            );

            const { results } = response.data;
            console.log("ye aa rha hai location", results)
            if (results && results.length > 0) {
              const { city, state } = results[0].components;
              console.log("ye hai city aur state",city,state  )
              return { ...item, city, state };
            }
          } catch (error) {
            console.error("Error fetching location data:", error);
          }
          return item;
        })
      );
      setLocationData(updatedItems);
    };

    fetchData();
  }, [items]);

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
    <div className="w-full h-full ">
      {locationData && locationData.length > 0 ? (
        <Slider {...settings}>
          {locationData.map((item, index) => (
            <div key={item.id}>
              <div className="h-60 overflow-hidden">
                {item.photos && (
                  <img
                    className="w-full h-full object-cover object-top"
                    src={`${API_URL}/image/${item.photos}`}
                    alt={`Photo${item.id}`}
                  />
                )}
              </div>
              <div className="h-full py-1 grid grid-rows-3 gap-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-34 ml-3 flex flex-col items-center justify-center">
                    <h3 className="underline mb-1">Activity</h3>
                    <h3 className="text-center">{item.category}</h3>
                  </div>

                  <div className="w-44 flex flex-col items-end mr-4 justify-center">
                    <h3 className="underline mb-1">Location</h3>
                    <h3>
                      {item.city}, {item.state}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="w-24 flex flex-col items-center justify-center">
                    <h3 className="underline mb-1">Total Time</h3>
                    <h3>{item.totalTime}</h3>
                  </div>

                  <div className="w-24 flex flex-col items-center justify-center">
                    <h3 className="underline mb-1">Endorsed</h3>
                    <h3>{item.endorsementCounter >= 3 ? "YES" : "NO"}</h3>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
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
      ) : (
        <h3 className="absolute inset-0 marquee flex items-center justify-center w-full h-full text-4xl font-semibold">No posts added</h3>
      )}
    </div>
  );
};

export default Slider1;
