import React from 'react';
import bannerLogoImage from 'static/banner-logo.png';
import bannerLogoWhite from 'static/banner-logo-white.svg';
import './logo.scss';
const BannerLogo = ({className ,color, commonTextData = {CoachOutlet : ""}}) => {
    return (
        <div className={"logo-container "+className}>
            <img alt={commonTextData.CoachOutlet} src={color === 'white' ?bannerLogoWhite:bannerLogoImage} />
        </div>
    );
} 
export default BannerLogo;