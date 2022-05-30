import React from "react";
import {useNavigate} from "react-router-dom";

const AuctionRedirect = () => {
    const nav = useNavigate()
    React.useEffect(() => {
        nav("/auctions")
    })
    return (<div></div>)
}
export default AuctionRedirect;