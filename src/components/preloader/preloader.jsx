import React from 'react';
import preloader from 'static/loader.gif';
import 'components/preloader/preloader.scss';
function Preloader(props) {
    return (
        <div className={"preloader-container"+(props.isSectionLoader ? ' section-loader': '')}>
            <div className="overlay"></div>
            <div className="preloader">
                <img src={preloader} alt=""/>
            </div>
        </div>
    );
}
  
export default Preloader;