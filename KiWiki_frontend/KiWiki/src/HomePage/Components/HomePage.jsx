import axios from 'axios'
import {useEffect} from 'react';
import logoWiki from '/assets/logo_wiki.png'
import SearchBar from '../../Common/SearchBar'; 
import '../CSS/HomePage.css'


function HomePage(){

    useEffect(() => {
        document.title = 'Kiwiki';
    },[]);

    return(
    <div id='homeScreen' className='h-screen xl flex flex-col justify-center items-center'>
      <div className='flex flex-1 flex-col justify-end'>
        <img src={logoWiki} className='ml-7 w-80 h-80'></img>
      </div>
      <div className='flex flex-col gap-y-7'>
        <h1 id='kiwiki' className='text-center text-6xl font-sans font-bold italic tracking-wide'>KIWIKI</h1>
        <footer className='text-center text-2xl max-w-2xl mx-auto font-medium'>Bienvenido a KiWiki. Busca lo que quieras, encuentra lo que necesitas. ¡Todo lo que necesitas saber está aquí!</footer>
      </div>
      <div className='flex-1 mt-12 justify-start items-center flex-col'>
        <SearchBar></SearchBar>
      </div>
    </div>

    );



}

export default HomePage;