import { createContext, useState,useReducer, useEffect } from 'react';

// Action Types
const actionTypes = {
    SET_APP_LANGUAGE: 'SET_APP_LANGUAGE',
  }

// Create new context
export const GenericContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_APP_LANGUAGE:
            return {...state,"appLanguage":action.payload};
        default: return ;
      }
  }
// Create Provider to wrap app
export const GenericContextProvider = ({ children }) => {
    const [genericState, dispatch] = useReducer(reducer, '');
  const setAppLanguage = (payload) => {
    dispatch({
      type: actionTypes.SET_APP_LANGUAGE,
      payload
    });
  }
useEffect(()=>{
    dispatch({ type: actionTypes.SET_APP_LANGUAGE,
        payload:"en-us"});
},[])
  return (
    <GenericContext.Provider value={{genericState, setAppLanguage}}>{children}</GenericContext.Provider>
  )
}