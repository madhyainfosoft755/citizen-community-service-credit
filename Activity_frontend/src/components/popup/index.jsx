import React from 'react';

const PopupComponent = ({ post, onClose }) => {

    console.log("kya post aa rhe hain", post)
     // Check if the post object and photos property are valid before rendering
    // if (!post || !post.photos || !Array.isArray(post.photos)) {
    //     return <div>Error: Invalid post data</div>;
    //   }
  return (
    <div className="popup-container">
       {/* Render photo if available */}
       {post.photo && (
        <img
          className="popup-image"
          src={post.photo.src}
          alt="Post Photo"
        />
      )}

      {/* Render video if available */}
      {post.video && (
        <video
          controls
          className="popup-video"
          src={post.video.src}
          alt="Post Video"
        ></video>
      )}

      {/* Close button */}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default PopupComponent;
