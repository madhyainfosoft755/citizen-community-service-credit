import { FacebookShareButton, WhatsappShareButton, TwitterShareButton } from "react-share";
import { FacebookIcon, WhatsappIcon, TwitterIcon } from "react-share";

const Share = () => {
    return <>
        <FacebookShareButton
            url={`https://cch247.com/apps/`}

            title={`Community Care Hours`}
            style={{ width: "24px" }}
        >
            <FacebookIcon logoFillColor="white" round={true} style={{ width: "24px" }} />

        </FacebookShareButton>
        <WhatsappShareButton
            url={`https://cch247.com/apps/`}

            title={`Community Care Hours`}
            style={{ width: "24px" }}
        >
            <WhatsappIcon logoFillColor="white" round={true} style={{ width: "24px" }} />
        </WhatsappShareButton>
    </>
}

export default Share;