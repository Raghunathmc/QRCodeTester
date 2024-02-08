import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes as Switch } from "react-router-dom";
import Preloader from 'components/preloader/preloader';
import Layout from "components/layout/layout";

// const StoreLanding = lazy(() => import('/screens/store-landing/store-landing'));
// const AccountSignIn = lazy(() => import('/screens/account-sign-in/account-sign-in'));
// const ProductDetail = lazy(() => import('/screens/product-detail/product-detail'));
// const StoreScanning = lazy(() => import('/screens/store-scanning/store-scanning'));
// const BrowserNotSupported = lazy(() => import('/screens/browser-not-supported/browser-not-supported'));
// const BrowserIncompatible = lazy(() => import('/screens/browser-incompatible/browser-incompatible'));
// const NotFound = lazy(() => import('/screens/not-found/not-found'));
// const Cart = lazy(() => import('/screens/cart/cart'));
// const Checkout = lazy(() => import('/screens/checkout/checkout'));
// const Offers = lazy(() => import('/screens/offers/offers'));
// const AccountLogin = lazy(() => import('/screens/account-login/account-login'));
// const Account = lazy(() => import('/screens/account/account'));
// const AccountCreate = lazy(() => import('/screens/account-create/account-create'));
// const AccountProfile = lazy(() => import('/screens/account-profile/account-profile'));
// const Wishlist = lazy(() => import('/screens/wishlist/wishlist'));
// const Home = lazy(() => import('/screens/home/home'));
// const ProductListing = lazy(() => import('/screens/product-listing/product-listing'));
// const ProductCategories = lazy(() => import("./screens/product-categories/product-categories"));
// const ARExperince = lazy(() => import("./screens/fullview-AR-experience/fullview-AR-experience"));

// import StoreLanding from "./screens/store-landing/store-landing";
// import AccountSignIn from "./screens/account-sign-in/account-sign-in";
// import ProductDetail from "./screens/product-detail/product-detail";
// import StoreScanning from "./screens/store-scanning/store-scanning";
// import BrowserNotSupported from '/screens/browser-not-supported/browser-not-supported';
// import BrowserIncompatible from '/screens/browser-incompatible/browser-incompatible';
// import NotFound from "./screens/not-found/not-found";
// import Cart from "./screens/cart/cart";
// import Checkout from "./screens/checkout/checkout";
// import Offers from "./screens/offers/offers";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error) {
    return {hasError: true};
  }

  render() {
    if (this.state.hasError) {
      return <div className="body offline">
        <img src="data:image/png;base64,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" />
        <h3>Cannot Connect to Network</h3>
        <label>The internet connection appears to be offline. If available, please try another network or cellular data.</label>
      </div>;
    }

    return this.props.children;
  }
}

class App extends React.Component {
  render() {
    return (
      <ErrorBoundary>
        <Router history={this.history}>
          <Layout history={this.history}>
            <Suspense fallback={<Preloader />}>
              <Switch>
                {/*<Route path="/" exact component={StoreScanning} />
                 <Route path="/home" exact component={Home} />
                <Route path="/email" component={AccountSignIn} />
                <Route path="/offers" component={Offers} />
                <Route path="/product/:itemId?" component={ProductDetail} />
                <Route path="/cart" component={Cart} />
                <Route path="/checkout/:basketId?" component={Checkout} onLeave={ this.showConfirm }/>
                <Route path="/store/:storeId?" component={StoreLanding} />
                <Route path="/account/login" component={AccountLogin} />
                <Route path="/account/create" component={AccountCreate} />
                <Route path="/account/profile" component={AccountProfile} />
                <Route path="/account/wishlist" component={Wishlist} />
                <Route path="/product-listing/:category" component={ProductListing} />
                <Route path="/account" component={Account} />
                <Route path="/browser-not-supported/:storeCode?" component={BrowserNotSupported} />
                <Route path="/browser-incompatible" component={BrowserIncompatible} />
                <Route path="/product-categories"component={ProductCategories} />
                <Route path="/peanuts"component={ARExperince} /> 
                <Route component={NotFound} />*/}
              </Switch> 
            </Suspense>
          </Layout>
        </Router>
      </ErrorBoundary>
    );
  }
}

export default App;