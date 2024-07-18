import { API_URL } from "Constant";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import Certficate from "pages/Certficate";

const CertficatePopup = ({ setIsPopupVisible }) => {
    // console.log("kya post aa rhe hain", post);
    // Check if the post object and photos property are valid before rendering
    // if (!post || !post.photos || !Array.isArray(post.photos)) {
    //     return <div>Error: Invalid post data</div>;
    //   }


    return (
        <div className="popup-container overflow-auto absolute top-0 left-0 z-50 w-screen h-screen pt-6 pb-6 bg-white-A700/50 flex flex-col justify-start items-center sm:gap-3">
            <Certficate setIsPopupVisible={setIsPopupVisible} />

        </div>
    );
};

export default CertficatePopup;
