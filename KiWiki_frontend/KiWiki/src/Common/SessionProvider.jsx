import React, { createContext, useState, useContext } from 'react';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 


  const funLogin = () => {
    setIsLoggedIn(true); 
  };

  const funLogout = () => {
    setIsLoggedIn(false); 
  };

  return (
    <SessionContext.Provider value={{ isLoggedIn, funLogin, funLogout }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);