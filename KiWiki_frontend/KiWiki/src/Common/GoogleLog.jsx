import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { useSession } from './SessionProvider'; // Usamos el contexto
import Cookies from 'universal-cookie';
const cookies = new Cookies();
import { useNavigate } from 'react-router-dom'

function GoogleLog() {

    const { isLoggedIn, sessionProfile, user, funLogin, funLogout } = useSession();
    const navigate = useNavigate();

    
    const [localUser, setLocalUser] = useState(null);
    const [ profile, setProfile ] = useState(null);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => { setLocalUser(codeResponse); seslogin(); },
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(
        () => {
            if (localUser) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${localUser.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${localUser.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
                        funLogin(res.data);
                    })
                    .catch((err) => console.log(err));
            }
            else if (isLoggedIn) {
                setProfile(sessionProfile);
                //console.log(sessionProfile);
            }
        },
        [ localUser,login ]
    );
    
    useEffect (
        () => {
            if (profile) {
                //console.log(profile);
                cookies.set('email', profile.email, { path: '/' });
            }
        },
        [profile]
    );

    const logOut = () => {
        googleLogout();
        setProfile(null);
        setLocalUser(null);
        cookies.remove('email', { path: '/' });
        funLogout();
    };

    const openRolSet = () => {
        navigate("/setRole");
    }

    return (
        <div>
            {profile ? (
                <div className='flex-row font-bold px-4 py-2 rounded-lg bg-white text-black'>
                    <div className='flex justify-center'>
                        <img src={profile.picture} alt="user image" className='rounded-full w-8 h-8 object-cover font-normal' />
                    </div>
                    <div className='flex-col flex-wrap font-normal'>
                        <p>Nombre: {profile.name}</p>
                        <p>Email: {profile.email}</p>
                    </div>
                    {user !== null && user.rol === 'ADMIN' && (
                        <div className='flex justify-center'>
                        <button onClick={openRolSet} 
                            className='px-1 hover:shadow-md rounded-md hover:bg-green-100 focus:outline-none transition duration-300'
                        >Moderar permisos</button>
                    </div>
                    )}
                    <div className='flex justify-center'>
                        <button onClick={logOut} 
                            className='px-1 hover:shadow-md rounded-md hover:bg-gray-100 focus:outline-none transition duration-300'
                        >Salir</button>
                    </div>
                </div>
                ) : (
                <div>
                    <button onClick={login}
                        className='font-bold px-4 py-2 hover:shadow-md rounded-full hover:bg-white focus:outline-none transition duration-300 hover:text-black'
                    >Login con Google</button>
                </div>
                )
            }
        </div>
    )
}

export default GoogleLog