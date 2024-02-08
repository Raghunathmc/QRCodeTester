import React, { Suspense, lazy,useEffect } from "react";
import ErrorBoundary from 'ErrorBoundary/ErrorBoundary';
import { BrowserRouter as Router, Route, Routes  } from "react-router-dom";
import Preloader from 'components/preloader/preloader';
import './App.css';
import Layout from "components/layout/layout";

const App = () => {
    const StoreScanning = lazy(() => import('screens/store-scanning/store-scanning'));

    useEffect(()=>{
        
        console.log(StoreScanning)
      },[])
 
  return(
   
    <ErrorBoundary>
            <Suspense fallback={<Preloader />}>
               
                <Router>
                <Layout>
                    <Routes>
                    <Route path="/"  element={<StoreScanning />} />
                    <Route path="/stores/:storeId?"  element={<div>s</div>} />
                </Routes>
                </Layout>
            </Router>
           
        </Suspense>
    </ErrorBoundary>

   );
}

export default App;