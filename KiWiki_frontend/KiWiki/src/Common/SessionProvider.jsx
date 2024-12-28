import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios'

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [sessionProfile, setSessionProfile ] = useState(null);

  const [urlUser, setUrlUser] = useState(null);
  const [data, setData] = useState(null);
  const [done, setDone] = useState(false);
  const [user, setUser] = useState(false);

  const funLogin = (profile) => {
    setIsLoggedIn(true); 
    setSessionProfile(profile);


    setUrlUser(`http://localhost:8000/users/${profile.email}`);


  };

  const funLogout = () => {
    setIsLoggedIn(false); 
    setSessionProfile(null);
  };

  //Tratar de obtener el user por email
  useEffect(() => {
    const fetchData = async() => {
          try {
            if(urlUser) {
                const response = await axios.get(urlUser);
                setData(response.data);
            }
        } catch (err) {
            console.log(err.message);
        } finally {
          setDone(true);
        }
    };
    fetchData();
  }, [urlUser]);

  //Si ha encontrado un user por email lo pone, si no hace una peticion para postearlo con permisos basicos
  useEffect(() => {
    const postUser = async() => {
    
        //REDACTOR, EDITOR, ADMIN

        const payload = {
            rol: 'REDACTOR',
            email: sessionProfile.email,
            sendEmail: false,
        };
    
        try {
          const response = await axios.post('http://localhost:8000/users/', payload, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          console.error("Error posting data:", error);
        } finally {
          
        }
    };
    if(done && data !== null) {
      //Guardar en la sesion el user
      setUser(data);
    } else if (done && sessionProfile !== null) {
      //Meter un user en la bd
      postUser();
    }
  },[done, data]);

  return (
    <SessionContext.Provider value={{ isLoggedIn, sessionProfile, user, funLogin, funLogout }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);