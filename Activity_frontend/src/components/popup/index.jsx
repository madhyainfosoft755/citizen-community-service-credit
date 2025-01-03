import { API_URL } from "Constant";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const PopupComponent = ({ post, onClose }) => {
  console.log("kya post aa rhe hain", post);
  // Check if the post object and photos property are valid before rendering
  // if (!post || !post.photos || !Array.isArray(post.photos)) {
  //     return <div>Error: Invalid post data</div>;
  //   }

  return (
    <div className="popup-container overflow-auto absolute top-0 left-0 z-50 w-screen h-screen pt-6 pb-6 bg-white-A700/50 flex flex-col justify-start items-center sm:gap-3">
      {/* Close button */}
      <button
        // style={{borderColor:"red"}}
        className="border-2 border-solid border-red-500 p-1 text-white-A700 rounded-md  w-1/3 h-1/12 flex items-center justify-center sm:mt-2"
        onClick={onClose}
      >
        <FontAwesomeIcon icon={faClose} className="text-xl text-black-900" />
      </button>
      <br />

      <div className="w-full h-full flex flex-col items-center justify-center sm:flex-col">
        <div className="w-auto h-4/6 flex flex-wrap gap-2 items-center justify-center">
          {/* Render photo if available */}
          {(() => {
                try {
                  const parsedPhotos = JSON.parse(post.photos);
                  return Array.isArray(parsedPhotos) ? (
                    parsedPhotos.map((photo, index) => (
                      <img
                        key={index}
                        className="popup-image w-auto h-full mr-2"
                        src={`${API_URL}/image/${photo}`}
                        alt={`Post Photo ${index + 1}`}
                      />
                    ))
                  ) : (
                    <img
                      className="popup-image w-auto h-full mr-2"
                      src={`${API_URL}/image/${parsedPhotos}`}
                      alt="Post Photo"
                    />
                  );
                } catch (error) {
                  // Agar JSON parse fail ho jata hai, to string ko as-is use karo
                  return (
                    <img
                      className="popup-image w-auto h-full mr-2"
                      src={`${API_URL}/image/${post.photos}`}
                      alt="Post Photo"
                    />
                  );
                }
              })()}
        </div>

        <div className="w-auto h-4/5 ">
          {/* Render video if available */}
          {post.videos && (
            <video
              controls
              className="popup-video w-auto h-full"
              src={`${API_URL}/video/${post.videos}`}
              alt="Post Video"
            ></video>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupComponent;
