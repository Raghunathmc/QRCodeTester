import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GenericContextProvider } from 'context/genericContext';
import { LocaleContextProvider } from 'context/localeContenxt';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(


 <GenericContextProvider>
                    <LocaleContextProvider>
    <App />
    </LocaleContextProvider>
            </GenericContextProvider>


);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
