import React, { createContext, useState, useContext } from 'react';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [ sessionProfile, setSessionProfile ] = useState(null);


  const funLogin = (profile) => {
    setIsLoggedIn(true); 
    setSessionProfile(profile);
  };

  const funLogout = () => {
    setIsLoggedIn(false); 
    setSessionProfile(null);
  };

  return (
    <SessionContext.Provider value={{ isLoggedIn, sessionProfile, funLogin, funLogout }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);