import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios'

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [sessionProfile, setSessionProfile ] = useState(null);

  const [urlUser, setUrlUser] = useState(null);
  const [data, setData] = useState(null);
  const [done, setDone] = useState(false);
  const [user, setUser] = useState(null);


  const funLogin = (profile) => {
    setIsLoggedIn(true); 
    setSessionProfile(profile);


    setUrlUser(`http://localhost:8000/users/${profile.email}`);


  };

  const funLogout = () => {
    setIsLoggedIn(false); 
    setSessionProfile(null);
    setUrlUser(null);
    setData(null);
    setDone(false);
    setUser(null);
  };

  const setRol = async(targetEmail, newRol) => {

    const targetMailUrl = `http://localhost:8000/users/${targetEmail}`
    let targetUser = null;

    const processData = async(url) => {
      try {
          if(url) {
              const response = await axios.get(url);
              targetUser = response.data;
              console.log(response.data);
          }
      } catch (err) {
          console.log(err.message);
      } finally {
        console.log(targetUser);
        if(targetUser !== null) {
          try {
            const payload = {
              rol: newRol,
              email: targetEmail,
              sendEmail: targetUser.send_email,
            };
      
            const result = await axios.put(url, payload); // Enviar el payload en la solicitud
            //setResponse(result.data); // Manejar la respuesta
            console.log(result);
          } catch (error) {
            console.error("Error al actualizar:", error.response || error.message);
          }
        } else {
          console.log("No se puede ejecutar setRol porque no hay usuario objetivo")
        }
      }
    };
    processData(targetMailUrl);
  };

  const toggleMyMailPreference = async () => {
    if(user !== null) {
      console.log(user);
      const targetMailUrl = `http://localhost:8000/users/${user.email}`

      try {
        const payload = {
          rol: user.rol,
          email: user.email,
          sendEmail: !(user.send_email),
        };
  
        const result = await axios.put(targetMailUrl, payload); // Enviar el payload en la solicitud
        //setResponse(result.data); // Manejar la respuesta
        console.log(result);
        setUser((prevUser) => ({
          ...prevUser,
          send_email: !prevUser.send_email,
        }));
      } catch (error) {
        console.error("Error al actualizar:", error.response || error.message);
      }

    } else {
      console.log("No se puede cambiar la preferencia de mails si no esta el usuario activo");
    }
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
          if(urlUser){
            setDone(true);
          }
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
          const response = await axios.get(urlUser);
          setData(response.data);
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
    <SessionContext.Provider value={{ isLoggedIn, sessionProfile, user, funLogin, funLogout, setRol, toggleMyMailPreference }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);