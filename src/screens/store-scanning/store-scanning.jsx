import { useState,useEffect,useContext } from "react";
import { useZxing } from "react-zxing";

import {useNavigate} from 'react-router-dom';
import {LocaleContext} from 'context/localeContenxt'
import BannerLogo from 'components/logo/logo';
import './store-scanning.scss';
import Util from 'utils/util';
 const StoreScanning = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState("");
  const [locale, setLocale] = useState({});
  const {localeState} = useContext(LocaleContext);
  const { ref } = useZxing({
    onDecodeResult(result) {
      setResult(result.getText());
    },
  });
  useEffect(() => {
    document.title = "Coach Store Scanning Page"

 }, []);
 useEffect(() => {
  if(localeState.localeData && localeState.localeData.screens){
    setLocale(localeState.localeData.screens)
    
  }

}, [localeState.localeData]);
useEffect(() => {
  
  if(result){
    const baseUrl = window.location.origin;
    alert(">>>>>>>>>>>>>"+result+"<<<<<<<<")
    if (result && (result.indexOf(baseUrl) > -1)) {
      console.log(result)
      console.log(baseUrl)
      console.log(result.replace(baseUrl,""))
      navigate(result.replace(baseUrl,""));
     
    }    
  }

}, [result]);
  return (
    <div className="store-scanning-screen" aria-label="store scanning screen">
<BannerLogo className="landing-logo" commonTextData={locale?.common}/>
    <h2 className="title">{locale?.common?.appName}</h2>
    <div className="scan-icon" aria-label="barcode scanning region">
    <section >
      <video ref={ref} />
      </section>
      </div>
      <span className="store-label">{locale?.storeScanning?.scanninglabel}</span>
  </div>
  );
};

export default StoreScanning