// PostCarousel.jsx

import React from "react";
import Slider from "react-slick";

const PostCarousel = ({ userPosts }) => {
  const carouselSettings = {
    infinite: true,
    lazyload: true,
    speed: 500,
    slidesToShow: 1,
    centerMode: true,
  };

  return (
    <Slider {...carouselSettings}>
      {userPosts.map((post) => (
        <div key={post.postId}>
          {/* Render card content for each post */}
          {/* You can use the post data to display details, photos, and videos */}
          {/* Customize this part based on your data structure */}
          <div>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            {/* Add logic to display photos and videos */}
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default PostCarousel;
