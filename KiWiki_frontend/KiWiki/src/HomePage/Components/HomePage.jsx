import axios from 'axios'
import {useEffect} from 'react';
import logoWiki from '/assets/logo_wiki.png'
import SearchBar from '../../Common/SearchBar'; 
import '../CSS/HomePage.css'
import Navbar from '../../Common/NavBar';


function HomePage(){

    useEffect(() => {
        document.title = 'Kiwiki';
    },[]);

    return(
    <div id='homeScreen' className='h-screen xl flex flex-col justify-center items-center'>
      <Navbar/>
      <div className='flex flex-1'>
        <img src={logoWiki} className='ml-7 w-80 h-80'></img>
      </div>
      <div className='flex flex-1 flex-col gap-y-7'>
        <h1 id='kiwiki' className='text-center text-6xl font-sans font-bold italic tracking-wide'>KIWIKI</h1>
        <footer className='text-center text-2xl max-w-2xl mx-auto font-medium'>Bienvenido a KiWiki. Busca lo que quieras, encuentra lo que necesitas. ¡Todo lo que necesitas saber está aquí!</footer>
      </div>
      <SearchBar></SearchBar>
    </div>
    );



}

export default HomePage;