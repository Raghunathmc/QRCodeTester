import React, { useEffect ,useState,useContext} from 'react';
import './layout.scss';
import { useLocation } from 'react-router-dom'
import {GenericContext} from 'context/genericContext'
import {LocaleContext} from 'context/localeContenxt'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 import Preloader from 'components/preloader/preloader';
 import Util from 'utils/util';
//  import ScanProductBarcodePopUp from 'screens/scan-product-barcode-popup/scan-product-barcode-popup';
//  import ScanPermissionErrorPopUp from 'screens/scan-permission-error-popup/scan-permission-error-popup';
const Layout =  (props) => {
  const {genericState, setAppLanguage } = useContext(GenericContext);
  const {localeState, setLocale } = useContext(LocaleContext);
const location = useLocation();
const [pathname,setPathname] = useState("")
const [isBarcodeScannerOpen,setBarcodeScannerOpen] = useState(false)
useEffect(()=>{
  const { hash, pathname, search } = location;
  setPathname(pathname);
},[])
useEffect(()=>{
  if (genericState.appLanguage) {
    try {
      import('../../utils/languages/'+genericState.appLanguage+'.json').then((obj)=>{
        setLocale(obj?.default)})
  } catch (error) {
      import('../../utils/languages/en-us.json').then((obj)=>{setLocale(obj.default)})
  }
  }else{
    import('../../utils/languages/en-us.json').then((obj)=>{setLocale(obj.default)})
  }
},[genericState.appLanguage])
  return (
    <div className={`app-layout ${genericState.appLanguage}`}>   
      {props.children}
    </div>
  )
}
export default Layout