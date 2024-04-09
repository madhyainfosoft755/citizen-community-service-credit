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
    <div className="popup-container overflow-auto absolute top-0 left-0 z-50 w-screen h-screen bg-black-900 bg-opacity-80 flex flex-col justify-center items-center">
      {/* Close button */}
      <button
        className="border-2 border-yellow-400 p-1 text-white-A700 rounded-xl  w-1/2 h-8 flex items-center justify-center mt-8"
        onClick={onClose}
      >
        <FontAwesomeIcon icon={faClose} />
      </button>

      <div className="w-full h-1/3 p-3">
        {/* Render photo if available */}
        {post.photos && (
          <img
            className="popup-image "
            src={`${API_URL}/image/${post.photos}`}
            alt="Post Photo"
          />
        )}
      </div>

      <div className="w-full h-2/3 p-3">
        {/* Render video if available */}
        {post.videos && (
          <video
            controls
            className="popup-video"
            src={`${API_URL}/video/${post.videos}`}
            alt="Post Video"
          ></video>
        )}
      </div>
    </div>
  );
};

export default PopupComponent;
