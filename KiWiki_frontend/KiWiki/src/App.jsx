import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import logoWiki from '../public/assets/logo_wiki.png'


function App() {

  return (

    <div className='max-h-screen flex-row justify-center items-center max-h-screen bg-white'>
      <img src={logoWiki} className='flex-1'></img>
      <div className='flex-1'>
      <h1>Bienvenido a KiWiki, cabrón</h1>
      </div>
    </div>

  )
}

export default App
