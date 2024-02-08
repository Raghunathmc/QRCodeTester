import { createContext, useState,useReducer, useEffect } from 'react';

// Action Types
const actionTypes = {
    SET_LOCALE_DETAILS: 'SET_LOCALE_DETAILS',
  }
// Create new context
export const LocaleContext = createContext();
const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_LOCALE_DETAILS:
            return {...state,"localeData":action.payload};
        default: return ;
      }
  }

  // Create Provider to wrap app
export const LocaleContextProvider = ({ children }) => {
    const [localeState, dispatch] = useReducer(reducer, '');
  const setLocale = (payload) => {
    dispatch({
      type: actionTypes.SET_LOCALE_DETAILS,
      payload
    });
  }
useEffect(()=>{
    dispatch({ type: actionTypes.SET_LOCALE_DETAILS,
        payload:{}});
},[])
  return (
    <LocaleContext.Provider value={{localeState, setLocale}}>{children}</LocaleContext.Provider>
  )
}