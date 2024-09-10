import React from 'react';
import { Button } from 'components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons"; // Importing the copy icon

const LinkModal = ({ onClose, postId }) => {
    const link = `https://cch247.com/apps/endorse-activity/${postId}`;

    const copyLinkToClipboard = () => {
        navigator.clipboard.writeText(link);
        alert('Link copied to clipboard!');
    };
    console.log(postId, "post id");
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-blue-50 p-5 rounded-lg shadow-lg w-96 text-center">
                <div className="text-2xl font-semibold text-blue-300 mb-4">Thanks for submiting</div>
                <div className="text-lg font-semibold text-blue-300 mb-4">Link to Share</div>
                <div className="bg-[#fff] p-2 rounded-md flex items-center justify-between mb-4">
                    <a href={link} className="text-black flex-1 truncate">{link}</a>
                    <Button
                        type="button"
                        onClick={copyLinkToClipboard}
                        className="ml-2 p-2 rounded-md"
                        color="indigo_A200"
                    >
                        <FontAwesomeIcon icon={faCopy} className="text-black" />
                    </Button>
                </div>
                <Button type="button" size='sm' onClick={onClose} className="w-1/2 mt-4 rounded-lg" color="indigo_A200">
                    Close
                </Button>
            </div>
        </div>
    );
};

export default LinkModal;
