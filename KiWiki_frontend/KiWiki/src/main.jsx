import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import HomePage from './HomePage/Components/HomePage.jsx';
import EntrySection from './Entry/EntrySection.jsx';
import Wiki from './Wiki/Wiki.jsx';
import ListEntries from './Entry/ListEntries.jsx';

createRoot(document.getElementById('root')).render(

  <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/entry" element={<EntrySection/>} />
        {/* <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} /> {/* Ruta para 404 */}
        <Route path='/wikis/:selectedOption/:query' element={<Wiki/>}></Route>
        <Route path='/wikis/:nameWiki/entries' element={<ListEntries/>}></Route>
      </Routes>
    </Router>
)
