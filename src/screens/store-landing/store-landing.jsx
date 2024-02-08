import React, { Component } from "react";
import { connect } from "react-redux";
import { sha256 } from 'js-sha256';
import Layout from "../../components/layout/layout";
import BannerLogo from "../../components/logo/logo";
import MainButton from "../../components/main-button/main-button";
import LanguageSelect from "../../components/language-select/language-select";
import scanIcon from "../../static/scan-icon.svg";
import Util from "../../utils/util";
import { setCurrentStore, setPinValidity, setEmailOptIn } from "../../actions/store";
import { setLocaleData } from '../../actions/locale';
import "./store-landing.scss";
import PinInput from "../../components/pin-input/pin-input";
import StoreService from "../../services/store.service";
import { subscribeNewsletter } from "../../actions/store";
import Preloader from '../../components/preloader/preloader';

class StoreLanding extends Component {
  state = {
    pin:'',
    email: '',
    isEmailSubmitted: false,
    isEmailSubmittedRefresh: false,
    selectedLanguageObj: Util.LOCALE_VALUES_LIST[0],
    isEmailOptIn: true,
    is25percPassed: false,
    is50percPassed: false,
    is75percPassed: false,
    is100percPassed: false,
  };
  isEmailEntryStarted = false;
  componentDidMount() {
    document.title = 'Coach Store Landing Page';
    window.togglePreloader(true);
    if (this.props.match.params && this.props.match.params.storeId) {
      Util.removeStringFromStorage(Util.BASKET_ID);
      Util.removeStringFromStorage(Util.CAMERA_PERMISSION_FLAG);
      Util.removeStringFromStorage(Util.STORE_TOKEN);
      Util.removeStringFromStorage(Util.APPLIED_COUPONS);
      Util.removeStringFromStorage(Util.OFFER_IS_ERROR_SHOWED);
      Util.removeStringFromStorage(Util.APPLIED_BASKET_PROMOS);
      Util.removeStringFromStorage(Util.SERVER_DATE);
      Util.removeFromSessionStorage(Util.PERSONALIZED_PROMO_LIST);
      Util.removeStringFromStorage(Util.DATALAB_CUSTOMER_ID);
      Util.removeFromSessionStorage(Util.INLINE_REQUESTED_PRODUCT_IDS);
      Util.removeFromSessionStorage(Util.REQUEST_INLINE_BUTTON_VISIBLE);
      Util.removeFromSessionStorage(Util.HIDE_SAVE_TO_BAG_BUTTON);
      Util.removeFromSessionStorage(Util.IS_ECATALOGUE_FLOW);
      Util.removeStringFromStorage(Util.SHOW_ATTENTIVE_FLOATING_POPUP);
      Util.removeStringFromStorage(Util.INSIDER_GATE_GROUP);
      Util.clearCoupons();
      Util.clearCart();

      // intro carousel should be there for insider gated store for every session
      if (Util.getInsiderGateGroup() !== Util.INSIDER_GATE_GROUPS.WITHOUT_INSIDER_GATE) {
        Util.removeStringFromStorage(Util.INTRO_CAROUSEL_SHOWN);
      }

      const existingQueryParams = Util.getQueryParams();
      if (existingQueryParams && existingQueryParams.target) {
        Util.addStringToSessionStorage(Util.IS_ECATALOGUE_FLOW, 'true');
      } else {
        Util.addStringToSessionStorage(Util.IS_ECATALOGUE_FLOW, 'false');
      }

      if (Util.isMobile()) {
        if (Util.isAndroidWebView()) {
          window.togglePreloader(true);
          window.location.href = '/browser-not-supported/'+this.props.match.params.storeId;
        } else if (Util.isAndroid() && Util.isChrome()) {
          this.props.setStore(this.props.match.params.storeId);
        } else if(Util.isIos() && Util.isChrome()) {
          window.togglePreloader(true);
          window.location.href = '/browser-not-supported/'+this.props.match.params.storeId;
        } else if (Util.isIos() && Util.isSafari()) {
          this.props.setStore(this.props.match.params.storeId);
        } else {
          window.togglePreloader(true);
          window.location.href = '/browser-not-supported/'+this.props.match.params.storeId;
        }
      } else {
        this.props.setStore(this.props.match.params.storeId);
      }
      if (window.location.search.indexOf('pinError=true') > -1) {
        this.props.setPinValidity(false);
      }
      const isSubscribed = Util.getObjectFromStorage(Util.EMAIL_SUBSCRIPTION_FLAG);
      if (isSubscribed) {
        this.setState({isEmailSubmittedRefresh: true});
        this.setState({isEmailSubmitted: true});
      }
    } else {
      window.location.href = '/';
    }

    // Preselecting app language
    const selectedLanguage = Util.getStringFromStorage(Util.APP_LANGUAGE);
    if (selectedLanguage) {
      const selectedLanguageObj = Util.getSelectedLanguageObject(selectedLanguage);
      this.setState({selectedLanguageObj});
    }
  }
  render() {
    let emailSub = {};
    let accountCreate={};
    let storeLanding = {};
    let common = {};
    let email = false;
    let disclimer = false;
    const isSubscribed = Util.getObjectFromStorage(Util.EMAIL_SUBSCRIPTION_FLAG);
    if (this.props.locale && this.props.locale.screens) {
      accountCreate = this.props.locale.screens.createAccount;
      storeLanding = this.props.locale.screens.storeLanding;
      emailSub = this.props.locale.screens.emailSub;
      common = this.props.locale.screens.common;
    }

    const queryParams = Util.getQueryParams();
    if (queryParams && queryParams.target) {
      window.togglePreloader(true);
    }
    
    // Setting disclaimer text on footer of the screen
    if (!this.props.pinValidationActivated && this.props.currentStore.emailposition == 'PRE' && isSubscribed) {
      email = false;
      disclimer = true;
    } else if (!this.props.pinValidationActivated && this.props.currentStore.emailposition == 'PRE') {
      email = true;
      disclimer = true;
    } else if (!this.props.pinValidationActivated && this.props.currentStore.emailposition != 'PRE') {
      email = false;
      disclimer = true;
    } else if (this.props.pinValidationActivated && this.props.currentStore.emailposition == 'PRE') {
      // In pin screen
      email = false;
      disclimer = true;
    } else if (this.props.pinValidationActivated && this.props.currentStore.emailposition == 'INIT' && this.state.isEmailSubmitted) {
      email = false;
      disclimer = true;
    } else if (!this.props.pinValidationActivated && this.props.currentStore.emailposition == 'INIT' && isSubscribed) {
      email = false;
      disclimer = true;
    } else if (this.props.pinValidationActivated && this.props.currentStore.emailposition == 'INIT') {
      email = true;
      disclimer = true;
    } else if (this.props.pinValidationActivated && this.props.currentStore.emailposition != 'PRE') {
      email = false;
      disclimer = true;
    }
    const storePin = Util.getStorePin();
    return (
        // <div className="store-landing-screen visible">
        //   <BannerLogo className="landing-logo" color="white" commonTextData={common}/>
        //   {isSubscribed && !this.state.isEmailSubmittedRefresh && this.state.isEmailSubmitted && this.props.pinValidationActivated && this.props.currentStore.emailposition == 'INIT' ?
        //     <>
        //       <label className="first">{emailSub.infoLabel1}</label>
        //       <label className="mid">{storeLanding.enterTodays}</label>
        //       <label className="last">{storeLanding.enterAccessCode}</label>
        //     </>:
        //     <>
        //       {/* <h2 className="title">{common.love} {common.scan}</h2>
        //       <h2 className="title last">{common.shop}</h2> */}
        //       <h2 className="title last">{common.appName}</h2>
        //       <span className="store-label">{storeLanding.greetingMessage}</span>
        //       <span className="store-name">{this.props.currentStore.storeDisplayName || this.props.currentStore.name}</span>
        //     </>
        //   }
          
        //   {this.props.pinValidationActivated && this.props.currentStore.emailposition != 'INIT' && !storePin ?
        //     <span className="store-code-label">{storeLanding.codeInfo}</span>:''
        //   }
        //   {
        //     isSubscribed && 
        //     this.state.isEmailSubmittedRefresh && 
        //     this.state.isEmailSubmitted && 
        //     this.props.pinValidationActivated && 
        //     this.props.currentStore.emailposition == 'INIT' &&
        //     !storePin ?
        //     <span className="store-code-label">{storeLanding.codeInfo}</span>:''
        //   }
        //   {((!this.props.pinValidationActivated && 
        //   this.props.currentStore.emailposition == 'PRE') ||
        //   (this.props.pinValidationActivated && 
        //     this.props.currentStore.emailposition == 'INIT')) && !isSubscribed ?
        //     <span className="store-code-label">{storeLanding.emailInfo}</span>:''
        //   }

        //   {/* If pin is not activated for init email screen */}
        //   {!this.props.pinValidationActivated && 
        //     this.props.currentStore.emailposition == 'INIT' && !isSubscribed ?
        //     <span className="store-code-label">{storeLanding.emailInfo}</span>:''
        //   }

        //   {!this.props.pinValidationActivated && 
        //     this.props.currentStore.emailposition == 'INIT' && !isSubscribed ?
        //     <>
        //       <div className="email-capture-container">
        //         <div className="input-container">
        //           <MainInput
        //             type="email"
        //             placeholder={emailSub.inputPlaceholder}
        //             value={this.state.email}
        //             onChange={this.onEmailChange.bind(this)}
        //             id="email-input"
        //             aria-label="email input"
        //           />
        //         </div>
        //         <div className="opt-in-container" tabIndex="1">
        //             <div className="checkbox">
        //                 <input type="checkbox" value={this.props.isEmailOptIn} id="checkbox" name="check" defaultChecked={this.props.isEmailOptIn} onChange={this.onEmailOptInChange.bind(this)}/>
        //                 <label htmlFor="checkbox"></label>
        //             </div>
        //             <span className="" dangerouslySetInnerHTML={{__html: common.emailOptInDesclaimer}}></span>
        //         </div>
        //       </div>
        //       <div className="action-container">
        //         <MainButton
        //           text={storeLanding.buttonLabel}
        //           disabled={!this.isValidEmail(this.state.email)}
        //           onClick={this.onEmailSubmit.bind(this)}
        //           style={{backgroundColor: "#e7e5de", color: "#000000"}}
        //         />
        //       </div>
        //     </>:''
        //   }
        //   {/* *************** */}

        //   {((!this.props.pinValidationActivated && this.props.currentStore.emailposition == 'PRE') ||
        //   (this.props.pinValidationActivated && 
        //     this.props.currentStore.emailposition == 'INIT')) && !isSubscribed ?
        //     <div className="email-capture-container">
        //       <div className="input-container">
        //         <MainInput
        //           type="email"
        //           placeholder={emailSub.inputPlaceholder}
        //           value={this.state.email}
        //           onChange={this.onEmailChange.bind(this)}
        //           id="email-input"
        //           aria-label="email input"
        //         />
        //       </div>
        //       <div className="opt-in-container">
        //           <div tabIndex="1" aria-label={this.props.isEmailOptIn?"checked checkbox":"Not checked checkbox" }  className="checkbox">
        //               <input  type="checkbox" value={this.props.isEmailOptIn} id="checkbox" name="check" defaultChecked={this.props.isEmailOptIn} onChange={this.onEmailOptInChange.bind(this)}/>
        //               <label htmlFor="checkbox"></label>
        //           </div>
        //         <span className="">
        //             &nbsp;{common.emailOptInDesclaimer}
        //             &nbsp;<a target='_blank' href='https://www.coachoutlet.com/privacy.html' onClick={this.privacyPolicyLink} aria-describedby='new-window-0'> {accountCreate.privacyPolicy} <span hidden>opens in a new window</span></a>&nbsp;  or  &nbsp;<a target='_blank' href='https://www.coachoutlet.com/emailus?ctid=contact-us' onClick={this.contactUsLink} aria-describedby='new-window-0'> {emailSub.contactUsLink} <span hidden>opens in a new window</span></a>&nbsp;
        //             {common.emailOptInDesclaimer2}
        //         </span>
        //       </div>
        //     </div>:''
        //   }
        //   {this.props.pinValidationActivated && this.props.currentStore.emailposition == 'INIT' && this.state.isEmailSubmitted ?
        //     <div className="pin-container">
        //       <PinInput onPinChanged={this.onPinChanged.bind(this)} value={this.state.pin} buttonLabel={storeLanding.buttonLabel}/>
        //       {!storePin ?
        //         <div className={`pin-error ${!this.props.isPinValid ? "show": ""}`}>{storeLanding.pinInvalid}</div>:''
        //       }
        //     </div>:''
        //   }
        //   {this.props.pinValidationActivated && this.props.currentStore.emailposition != 'INIT' ?
        //     <div className="pin-container">
        //       <PinInput onPinChanged={this.onPinChanged.bind(this)} value={this.state.pin} buttonLabel={storeLanding.buttonLabel}/>
        //       {!storePin ?
        //         <div className={`pin-error ${!this.props.isPinValid ? "show": ""}`}>{storeLanding.pinInvalid}</div>:''
        //       }
        //     </div>:
        //     <div className="action-container">
        //       {!this.props.pinValidationActivated && this.props.currentStore.emailposition == 'PRE' && !isSubscribed ?
        //         <MainButton
        //           text={storeLanding.buttonLabel}
        //           disabled={!this.isValidEmail(this.state.email)}
        //           onClick={this.onGetStarted.bind(this, '')}
        //           style={{backgroundColor: "#e7e5de", color: "#000000"}}
        //         />:''
        //       }
        //       {this.props.pinValidationActivated && this.props.currentStore.emailposition == 'INIT' && !isSubscribed ?
        //         <MainButton
        //           text={storeLanding.buttonLabel}
        //           disabled={!this.isValidEmail(this.state.email)}
        //           onClick={this.onEmailSubmit.bind(this)}
        //           style={{backgroundColor: "#e7e5de", color: "#000000"}}
        //         />:
        //         <>
        //           {!this.props.pinValidationActivated && this.props.currentStore.emailposition == 'INIT' && isSubscribed ?
        //             <MainButton
        //             text={storeLanding.buttonLabel}
        //             onClick={this.onGetStarted.bind(this, '')}
        //             style={{backgroundColor: "#e7e5de", color: "#000000"}}
        //           />:''
        //           }
        //         </>
        //       }
        //       {!this.props.pinValidationActivated && (this.props.currentStore.emailposition == 'PRE' || this.props.currentStore.emailposition == 'POST') && isSubscribed ?
        //         <MainButton
        //           text={storeLanding.buttonLabel}
        //           onClick={this.onGetStarted.bind(this, '')}
        //           style={{backgroundColor: "#e7e5de", color: "#000000"}}
        //         />:''
        //       }
        //       {!this.props.pinValidationActivated && this.props.currentStore.emailposition == 'POST' && !isSubscribed ?
        //         <MainButton
        //           text={storeLanding.buttonLabel}
        //           onClick={this.onGetStarted.bind(this, '')}
        //           style={{backgroundColor: "#e7e5de", color: "#000000"}}
        //         />:''
        //       }
        //       {!this.props.pinValidationActivated && this.props.currentStore.emailposition == 'NONE' ?
        //         <MainButton
        //           text={storeLanding.buttonLabel}
        //           onClick={this.onGetStarted.bind(this, '')}
        //           style={{backgroundColor: "#e7e5de", color: "#000000"}}
        //         />:''
        //       }
        //     </div>
        //   }
        //   <div className="locale-selector">
        //     <LanguageSelect list={Util.LOCALE_VALUES_LIST} onSelect={this.onLanguageSelect.bind(this)} value={this.state.selectedLanguageObj.value} placeholder="CHANGE LANGUAGE"/>
        //   </div>
        //   <PrivacyPolicyLink textData={emailSub} commonTextData={common} disclimer={disclimer} email={email} isEmailOptIn={this.props.isEmailOptIn} onEmailCheckChange={this.onEmailOptInChange.bind(this)}/>
        // </div>
        <Preloader />
    );
  }
  contactUsLink(){
    dataLayer.push({
        'event': 'outboundLink',
        'linkAction': 'Contact Us'
       });
  }
    privacyPolicyLink(){
      dataLayer.push({
          'event': 'outboundLink',
          'linkAction': 'Privacy Policy'
         });
  }
  onEmailOptInChange(event) {
    if (event && event.target) {
      this.props.setEmailOptIn(event.target.checked);
      // this.setState({isEmailOptIn: event.target.checked});
    }
  }
  onLanguageSelect(language) {
    window.togglePreloader(true);
    this.setState({selectedLanguageObj: JSON.stringify(language)});
    Util.addStringToStorage(Util.APP_LANGUAGE, language.value);
    window.location.reload();
  }
  isValidEmail(email) {
      return Util.isValidEmail(email);
  }
  onEmailChange(e) {
    if (e.target.value.length > 0 && !this.isEmailEntryStarted) {
      // GA Tapestry
      dataLayer.push({
        'event': 'flowInteraction',
        'flowAction': 'email entry start',
        'flowConfig': Util.getGAFlowConfig()
      });
      this.isEmailEntryStarted = true;
    }
    this.setState({ email: e.target.value });
  }
  onEmailSubmit() {
    const storeDetail = Util.getStoreDetails();
    const request = {
      email: this.state.email,
      storeId: storeDetail.storeId,
      emailOptIn: this.props.isEmailOptIn
    };
    this.props.subscribeNewsletter(request, this.onEmailSubscribed.bind(this));
    // Setting Encrypted email to storage
    const encEmail = sha256(this.state.email);
    Util.addObjectToStorage(Util.USER_EMAIL, encEmail);
    // Setting flag for later email subscription toggle
    Util.addObjectToStorage(Util.EMAIL_SUBSCRIPTION_FLAG, true);
  }
  onEmailSubscribed(response) {
    // If the pin is not there and email position is INIT
    if (!this.props.pinValidationActivated && this.props.currentStore.emailposition == 'INIT') {
      this.onGetStarted('');
    } else {
      this.setState({isEmailSubmitted: true});
    }
    // If email subscription position is PRE
    if (
      this.props.currentStore &&
      this.props.currentStore.emailposition === Util.PRE_EMAIL_CAPTURE
    ) {
      // window.togglePreloader(true);
      // window.location.href="/offers";
      // this.props.history.push('/offers');
      let queryParam = window.location.search;
      let storeInfo = Util.getObjectFromStorage(Util.STORE_DETAILS)
      if(storeInfo.config.preferredLanguage && storeInfo.config.preferredLanguage=='en-us')
      {
      Util.gotoRoute('/home'+(queryParam || ''), this.props.history);
      }
      else
      window.location.href = '/home'+(queryParam || '');

    }
  }
  onPinChanged(pin) {
    if (pin && pin != 'undefined') {
      if (pin.length === 1) {
        // GA Tapestry
        dataLayer.push({
          'event': 'flowInteraction',
          'flowAction': 'code entry start',
          'flowConfig': Util.getGAFlowConfig()
        });
      }
      if (pin.length === 4) {
        this.setState({pin: pin});
        setTimeout(() => {
            this.onPinSubmitted(pin);
        }, 0);
      } else {
          this.setState({pin: pin});
      }
    } else {
      Util.clearStorePin();
      const storeDetail = Util.getStoreDetails();
      window.location.href = '/store/'+storeDetail.storeId+'?pinError=true';
      // window.location.reload();
    }
  }
  onPinSubmitted(pin) {
    if (pin && pin.length == 4) {
      // Google Analytics: Store Pin Submitted
      dataLayer.push({
        logText: "Store Pin: pin submitted",
        event: "logText"
      });
      this.blurTextFields();
      this.onGetStarted(pin);
    }
  }
  onGetStarted(pin = '') {
    if (!pin) {
      // GA Tapestry - StartScanning/GetStarted Button click
      dataLayer.push({
        'event': 'flowInteraction',
        'flowAction': 'start scanning click',
        'flowConfig': Util.getGAFlowConfig()
      });
    }
    StoreService.startSession(pin)
      .then(data => {
        if (data && data.valid && data.token) {
          this.props.setPinValidity(true);
          // Google Analytics: Log button click of get started button in store landing page
          dataLayer.push({
            logText: "Button Click - Get Started button in store landing page",
            event: "logText"
          });
          // Checking if the user has already subscribed
          const isSubscribed = Util.getObjectFromStorage(Util.EMAIL_SUBSCRIPTION_FLAG);
          if (
            this.props.currentStore &&
            this.props.currentStore.emailposition === Util.PRE_EMAIL_CAPTURE &&
            this.props.pinValidationActivated &&
            !isSubscribed
          ) {
            if (pin) {
              // GA Tapestry
              dataLayer.push({
                'event': 'flowInteraction',
                'flowAction': 'code entry success',
                'flowConfig': Util.getGAFlowConfig(),
                eventCallback: () => {
                  // window.togglePreloader(true);
                  // window.location.href = "/email";
                  // this.props.history.push('/email');
                  Util.gotoRoute('/email', this.props.history);
                },
                eventTimeout: 2000
              });
            }
          } else {
            if (pin) {
              // GA Tapestry
              dataLayer.push({
                'event': 'flowInteraction',
                'flowAction': 'code entry success',
                'flowConfig': Util.getGAFlowConfig()
              });
            }
            if (
              this.props.currentStore &&
              this.props.currentStore.emailposition === Util.PRE_EMAIL_CAPTURE && 
              !isSubscribed
            ) {
              const storeDetail = Util.getStoreDetails();
              const request = {
                email: this.state.email,
                storeId: storeDetail.storeId,
                emailOptIn: this.props.isEmailOptIn
              };
              this.props.subscribeNewsletter(request, this.onEmailSubscribed.bind(this));
              // Setting Encrypted email to storage
              const encEmail = sha256(this.state.email);
              Util.addObjectToStorage(Util.USER_EMAIL, encEmail);
              // Setting flag for later email subscription toggle
              Util.addObjectToStorage(Util.EMAIL_SUBSCRIPTION_FLAG, true);
              // Google Analytics: Upfront email capture
              dataLayer.push({
                logText: "Store Session: Upfront email capture completed",
                event: "logText"
              });
            } else {
              // window.toggleBarcodeScanner();
              // window.togglePreloader(true);
              // window.location.href="/offers";
              // this.props.history.push('/offers');
              let queryParam = window.location.search;
              let storeInfo = Util.getObjectFromStorage(Util.STORE_DETAILS)
              if(storeInfo.config.preferredLanguage && storeInfo.config.preferredLanguage=='en-us')
              {
              Util.gotoRoute('/home'+(queryParam || ''), this.props.history);
              }
              else
              window.location.href = '/home'+(queryParam || '');
            }
          }
        } else {
          // Google Analytics: Store Pin Submitted
          dataLayer.push({
            errorValue: 'Store Pin: Invalid pin entered',
            event: "errorLogged"
          });
          // GA Tapestry
          dataLayer.push({
            'event': 'flowInteraction',
            'flowAction': 'code entry invalid',
            'flowConfig': Util.getGAFlowConfig()
          });
          this.setState({pin: ''});
          this.props.setPinValidity(false);
          this.blurTextFields();
        }
      })
      .catch(e => {
        // Google Analytics: Store Pin Submitted
        dataLayer.push({
          errorValue: 'Store Session: Start session failure',
          event: "errorLogged"
        });
        this.props.setPinValidity(false);
        Util.clearToken();
      });
  }
  blurTextFields() {
    const pinInputTextArray = document.querySelectorAll('#pin-input div div input');
    if (pinInputTextArray && pinInputTextArray.length > 0) {
      pinInputTextArray.forEach(pinInput => {
        if (pinInput) {
          pinInput.blur();
        }
      });
    }
  }
  onLanguageClick(language) {
    Util.addStringToStorage(Util.APP_LANGUAGE, language);
    window.location.reload();
  }
}

const mapStateToProps = state => {
  return {
    currentStore: state.store,
    pinValidationActivated: state.store.pinValidationActivated,
    locale: state.locale,
    isPinValid: state.store.isPinValid,
    isEmailOptIn: state.store.isEmailOptIn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setPinValidity: (validity) => dispatch(setPinValidity(validity)),
    setStore: storeId => dispatch(setCurrentStore(storeId)),
    subscribeNewsletter: (request, callBackFn) => dispatch(subscribeNewsletter(request, callBackFn)),
    setLocale: localeObj => dispatch(setLocaleData(localeObj)),
    setEmailOptIn: status => dispatch(setEmailOptIn(status))
  };
};

const connectedStoreLanding = connect(
  mapStateToProps,
  mapDispatchToProps
)(StoreLanding);

export default connectedStoreLanding;
