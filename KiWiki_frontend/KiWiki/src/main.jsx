import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'

import HomePage from './HomePage/Components/HomePage.jsx';
import DetailedEntry from './Entry/DetailedEntry.jsx';
import Wiki from './Wiki/Wiki.jsx';
import ListEntries from './Entry/ListEntries.jsx';
import PostVersion from './Version/PostVersion.jsx';
import CreateWiki from './Wiki/CreateWiki.jsx';

createRoot(document.getElementById('root')).render(
  <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/wikis/:nameWiki/entries/:entry_id" element={<DetailedEntry/>} />
        <Route path="/wikis/:nameWiki/entries/:entry_id/versionedit" element={<PostVersion/>}/> 
        {/* <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} /> {/* Ruta para 404 */}
        <Route path='/wikis/:selectedOption/:query/:dateOption' element={<Wiki/>}></Route>
        <Route path='/wikis/:selectedOption/:query' element={<Wiki/>}></Route>
        <Route path='/wikis/:nameWiki/entries' element={<ListEntries/>}></Route>
        <Route path='/wikis/create' element={<CreateWiki/>}></Route>
        <Route path='/wikis/:nameWiki/modify' element={<CreateWiki/>}></Route>
      </Routes>
    </Router>
)