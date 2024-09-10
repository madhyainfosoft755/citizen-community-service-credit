import { API_URL } from "Constant";
import { FacebookShareButton, WhatsappShareButton, LinkedinShareButton, LinkedinIcon } from "react-share";
import { FacebookIcon, WhatsappIcon, TwitterIcon } from "react-share";
function encodeUnicode(str) {
    return btoa(encodeURIComponent(str));
}
const Share = ({ postId }) => {

    const id = encodeUnicode(postId)

    return <>
        <FacebookShareButton
            url={`${API_URL}/activity/posts/${id}`}

            title={`Community Care 247`}
            style={{ width: "24px" }}
        >
            <FacebookIcon logoFillColor="white" round={true} style={{ width: "24px" }} />

        </FacebookShareButton>
        &nbsp;
        <WhatsappShareButton
            url={`${API_URL}/activity/posts/${id}`}

            title={`Community Care 247`}
            style={{ width: "24px" }}
        >
            <WhatsappIcon logoFillColor="white" round={true} style={{ width: "24px" }} />
        </WhatsappShareButton>
        &nbsp;
        <LinkedinShareButton
            url={`${API_URL}/activity/posts/${id}`}

            title={`Community Care 247`}
            style={{ width: "24px" }}
        >
            <LinkedinIcon logoFillColor="white" round={true} style={{ width: "24px" }} />
        </LinkedinShareButton>

    </>
}

export default Share;